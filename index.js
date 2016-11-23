'use strict';

var arrify = require('arrify');
var assign = require('object-assign');
var async = require('async');
var googleAuth = require('google-auto-auth');
var got = require('got');

function GCEImages(config) {
  if (!(this instanceof GCEImages)) {
    return new GCEImages(config);
  }

  config = config || {};
  config.scopes = ['https://www.googleapis.com/auth/compute'];
  this._auth = config.authClient || googleAuth(config);
  this.OS_URLS = GCEImages.OS_URLS;
}

GCEImages.OS_URLS = {
  centos: 'https://www.googleapis.com/compute/v1/projects/centos-cloud/global/images',
  'container-vm': 'https://www.googleapis.com/compute/v1/projects/google-containers/global/images',
  coreos: 'https://www.googleapis.com/compute/v1/projects/coreos-cloud/global/images',
  debian: 'https://www.googleapis.com/compute/v1/projects/debian-cloud/global/images',
  redhat: 'https://www.googleapis.com/compute/v1/projects/rhel-cloud/global/images',
  opensuse: 'https://www.googleapis.com/compute/v1/projects/opensuse-cloud/global/images',
  suse: 'https://www.googleapis.com/compute/v1/projects/suse-cloud/global/images',
  ubuntu: 'https://www.googleapis.com/compute/v1/projects/ubuntu-os-cloud/global/images',
  windows: 'https://www.googleapis.com/compute/v1/projects/windows-cloud/global/images'
};

GCEImages.OS_TO_URL = {
  centos: GCEImages.OS_URLS.centos,
  'centos-cloud': GCEImages.OS_URLS.centos,

  'container-vm': GCEImages.OS_URLS['container-vm'],
  'google-containers': GCEImages.OS_URLS['container-vm'],

  coreos: GCEImages.OS_URLS.coreos,
  'coreos-cloud': GCEImages.OS_URLS.coreos,

  debian: GCEImages.OS_URLS.debian,
  'debian-cloud': GCEImages.OS_URLS.debian,

  rhel: GCEImages.OS_URLS.redhat,
  'rhel-cloud': GCEImages.OS_URLS.redhat,
  redhat: GCEImages.OS_URLS.redhat,

  opensuse: GCEImages.OS_URLS.opensuse,
  'opensuse-cloud': GCEImages.OS_URLS.opensuse,

  suse: GCEImages.OS_URLS.suse,
  'suse-cloud': GCEImages.OS_URLS.suse,

  ubuntu: GCEImages.OS_URLS.ubuntu,
  'ubuntu-cloud': GCEImages.OS_URLS.ubuntu,
  'ubuntu-os-cloud': GCEImages.OS_URLS.ubuntu,

  windows: GCEImages.OS_URLS.windows,
  'windows-cloud': GCEImages.OS_URLS.windows
};

/**
 * Get all available images.
 *
 * @param {string=|object=} options - If a string, treat as an OS to fetch
 *                                    images for.
 * @param {boolean} options.deprecated [false] - Include deprecated results.
 * @param {array} options.osNames [all] - OS names to include in the results.
 * @param {function} callback - Callback function.
 */
GCEImages.prototype.getAll = function (options, callback) {
  var self = this;

  var parsedArguments = this._parseArguments(options, callback);
  options = parsedArguments.options;
  callback = parsedArguments.callback;

  var osNamesToImages = options.osNames.reduce(function (acc, osName) {
    acc[osName] = [];
    return acc;
  }, {});

  async.forEachOf(
    osNamesToImages,

    function (_, osName, next) {
      var singleOsOptions = assign({}, options, { osNames: [osName] });
      self._getAllByOS(singleOsOptions, function (err, images) {
        osNamesToImages[osName] = images || [];
        next(err || null);
      });
    },

    function (err) {
      if (err) {
        callback(err);
        return;
      }

      if (options.osNames.length === 1) {
        callback(null, osNamesToImages[options.osNames[0]]);
      } else {
        callback(null, osNamesToImages);
      }
    });
};
/**
 * Get all available images, but only return the newest one.
 *
 * @param {string=|object=} options - If a string, treat as an OS to fetch
 *                                    images for.
 * @param {boolean} options.deprecated [false] - Include deprecated results.
 * @param {array} options.osNames [all] - OS names to include in the results.
 * @param {function} callback - Callback function.
 */
GCEImages.prototype.getLatest = function (options, callback) {
  var self = this;

  var parsedArguments = this._parseArguments(options, callback);
  options = parsedArguments.options;
  callback = parsedArguments.callback;

  this.getAll(options, function (err, images) {
    if (err) {
      callback(err);
      return;
    }

    if (Array.isArray(images)) {
      images = images.sort(self._sortNewestFirst).shift();
    } else {
      for (var image in images) {
        images[image].sort(self._sortNewestFirst).splice(1);
      }
    }

    callback(null, images);
  });
};

GCEImages.prototype._getAllByOS = function (options, callback) {
  var self = this;

  var osParts = this._parseOsInput(options.osNames[0]);

  var reqOpts = {
    uri: osParts.url,
    json: true,
    query: {}
  };

  if (osParts.version.length > 0) {
    reqOpts.query.filter = 'name eq ' + [osParts.name, osParts.version].join('-') + '.*';
  }

  this._auth.authorizeRequest(reqOpts, function (err, authorizedReqOpts) {
    if (err) {
      callback(err);
      return;
    }

    got(reqOpts.uri, authorizedReqOpts, function (err, resp) {
      if (err) {
        callback(err);
        return;
      }

      var images = resp.items || [];

      if (!options.deprecated) {
        images = images.filter(self._filterDeprecated);
      }

      if (images.length === 0) {
        callback(new Error('Could not find a suitable image.'));
      } else {
        callback(null, images);
      }
    });
  });
};

GCEImages.prototype._parseArguments = function (options, callback) {
  var defaultOptions = {
    deprecated: false,
    osNames: Object.keys(GCEImages.OS_URLS)
  };

  var parsedArguments = {
    options: options,
    callback: callback
  };

  if (typeof options === 'string') {
    parsedArguments.options = {
      osNames: [options]
    };
  }

  if (typeof options === 'function') {
    parsedArguments.callback = options;
  }

  parsedArguments.options = assign(defaultOptions, parsedArguments.options);
  parsedArguments.options.osNames = arrify(parsedArguments.options.osNames);

  return parsedArguments;
};

GCEImages.prototype._parseOsInput = function (os) {
  var osParts = {
    name: '',
    version: '',
    url: ''
  };

  var project = false;
  var hasProject = false;

  if (GCEImages.OS_TO_URL[os]) {
    osParts.name = os;
  } else {

    hasProject = /\//.test(os);
    if (hasProject) {
      var projectAndOs = os.split('/');
      project = projectAndOs[0];
      os = projectAndOs[1];
    }
    os.split('-').forEach(function (part) {
      var hasName = osParts.name.length > 0;
      var hasVersion = osParts.version.length > 0;

      // Basically, if one of the parts of this name isn't 'cloud' or 'os',
      // consider it part of the version.
      switch (part) {
        case 'cloud':
        case 'os':
          if (!hasVersion) {
            osParts.name += !hasName ? part : '-' + part;
            break;
          }
          /* falls through */
        default:
          if (!hasName) {
            osParts.name = part;
          } else {
            osParts.version += !hasVersion ? part : '-' + part;
          }
          break;
      }
    });
  }

  if (hasProject) {
    osParts.url = 'https://www.googleapis.com/compute/v1/projects/' + project + '/global/images';
  } else {
    osParts.url = GCEImages.OS_TO_URL[osParts.name];
  }

  if (!osParts.url) {
    throw new Error([
      'Cannot find ' + os,
      'Expected one of: ' + Object.keys(GCEImages.OS_URLS).join(', ')
    ].join('. '));
  }

  return osParts;
};

GCEImages.prototype._filterDeprecated = function (image) {
  return !image.deprecated;
};

GCEImages.prototype._sortNewestFirst = function (imageA, imageB) {
  return imageA.creationTimestamp < imageB.creationTimestamp ? 1
       : imageA.creationTimestamp > imageB.creationTimestamp ? -1
       : 0;
};

module.exports = GCEImages;
