/**
 * Copyright 2018 Google LLC
 *
 * Distributed under MIT license.
 * See file LICENSE for detail or copy at https://opensource.org/licenses/MIT
 */

'use strict';

import * as arrify from 'arrify';
import * as async from 'async';
import {GoogleAuth, GoogleAuthOptions} from 'google-auth-library';
import {AxiosRequestConfig} from '../node_modules/axios';

export interface GCEImagesConfig extends GoogleAuthOptions {
  authClient?: GoogleAuth;
}

export class GCEImages {
  private _auth: GoogleAuth;
  OS_URLS: typeof GCEImages.OS_URLS;
  constructor(config?: GCEImagesConfig) {
    config = config || {};
    config.scopes = ['https://www.googleapis.com/auth/compute'];
    this._auth = config.authClient || new GoogleAuth(config);
    this.OS_URLS = GCEImages.OS_URLS;
  }

  private static OS_URLS = {
    centos:
        'https://www.googleapis.com/compute/v1/projects/centos-cloud/global/images',
    'container-vm':
        'https://www.googleapis.com/compute/v1/projects/cos-cloud/global/images',
    coreos:
        'https://www.googleapis.com/compute/v1/projects/coreos-cloud/global/images',
    debian:
        'https://www.googleapis.com/compute/v1/projects/debian-cloud/global/images',
    redhat:
        'https://www.googleapis.com/compute/v1/projects/rhel-cloud/global/images',
    opensuse:
        'https://www.googleapis.com/compute/v1/projects/opensuse-cloud/global/images',
    suse:
        'https://www.googleapis.com/compute/v1/projects/suse-cloud/global/images',
    ubuntu:
        'https://www.googleapis.com/compute/v1/projects/ubuntu-os-cloud/global/images',
    windows:
        'https://www.googleapis.com/compute/v1/projects/windows-cloud/global/images',
  };

  private static OS_TO_URL = {
    centos: GCEImages.OS_URLS.centos,
    'centos-cloud': GCEImages.OS_URLS.centos,

    'container-vm': GCEImages.OS_URLS['container-vm'],
    'google-containers': GCEImages.OS_URLS['container-vm'],
    cos: GCEImages.OS_URLS['container-vm'],

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
    'windows-cloud': GCEImages.OS_URLS.windows,
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
  getAll(options, callback?) {
    const parsedArguments = this._parseArguments(options, callback);
    options = parsedArguments.options;
    callback = parsedArguments.callback;

    const osNamesToImages = options.osNames.reduce((acc, osName) => {
      acc[osName] = [];
      return acc;
    }, {});

    async.forEachOf(
        osNamesToImages,

        (_, osName, next) => {
          const singleOsOptions =
              Object.assign({}, options, {osNames: [osName]});
          this._getAllByOS(singleOsOptions, (err, images) => {
            osNamesToImages[osName] = images || [];
            next(err || null);
          });
        },

        (err) => {
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
  }

  /**
   * Get all available images, but only return the newest one.
   *
   * @param {string=|object=} options - If a string, treat as an OS to fetch
   *                                    images for.
   * @param {boolean} options.deprecated [false] - Include deprecated results.
   * @param {array} options.osNames [all] - OS names to include in the results.
   * @param {function} callback - Callback function.
   */
  getLatest(options, callback?) {
    const parsedArguments = this._parseArguments(options, callback);
    options = parsedArguments.options;
    callback = parsedArguments.callback;

    this.getAll(options, (err, images) => {
      if (err) {
        callback(err);
        return;
      }

      if (Array.isArray(images)) {
        images = images.sort(this._sortNewestFirst).shift();
      } else {
        for (const image in images) {
          if (images[image]) {
            images[image].sort(this._sortNewestFirst).splice(1);
          }
        }
      }

      callback(null, images);
    });
  }

  _getAllByOS(options, callback) {
    const osParts = this._parseOsInput(options.osNames[0]);
    const reqOpts: AxiosRequestConfig = {url: osParts.url, params: {}};

    if (osParts.version.length > 0) {
      reqOpts.params.filter =
          'name eq ' + [osParts.name, osParts.version].join('-') + '.*';
    }

    this._auth.request(reqOpts).then(resp => {
      let images = resp.data.items || [];
      if (!options.deprecated) {
        images = images.filter(this._filterDeprecated);
      }
      if (images.length === 0) {
        callback(new Error('Could not find a suitable image.'));
      } else {
        callback(null, images);
      }
    }, callback);
  }

  _parseArguments(options, callback) {
    const defaultOptions = {
      deprecated: false,
      osNames: Object.keys(GCEImages.OS_URLS),
    };

    const parsedArguments = {
      options,
      callback,
    };

    if (typeof options === 'string') {
      parsedArguments.options = {
        osNames: [options],
      };
    }

    if (typeof options === 'function') {
      parsedArguments.callback = options;
    }

    parsedArguments.options =
        Object.assign(defaultOptions, parsedArguments.options);
    parsedArguments.options.osNames = arrify(parsedArguments.options.osNames);

    return parsedArguments;
  }

  _parseOsInput(os) {
    const osParts = {
      name: '',
      version: '',
      url: '',
    };

    let project = false;
    let hasProject = false;

    if (GCEImages.OS_TO_URL[os]) {
      osParts.name = os;
    } else {
      hasProject = /\//.test(os);
      if (hasProject) {
        const projectAndOs = os.split('/');
        project = projectAndOs[0];
        os = projectAndOs[1];
      }
      os.split('-').forEach(part => {
        const hasName = osParts.name.length > 0;
        const hasVersion = osParts.version.length > 0;

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
      osParts.url = 'https://www.googleapis.com/compute/v1/projects/' +
          project + '/global/images';
    } else {
      osParts.url = GCEImages.OS_TO_URL[osParts.name];
    }

    if (!osParts.url) {
      throw new Error([
        'Cannot find ' + os,
        'Expected one of: ' + Object.keys(GCEImages.OS_URLS).join(', '),
      ].join('. '));
    }

    return osParts;
  }

  _filterDeprecated(image) {
    return !image.deprecated;
  }

  _sortNewestFirst(imageA, imageB) {
    return imageA.creationTimestamp < imageB.creationTimestamp ?
        1 :
        imageA.creationTimestamp > imageB.creationTimestamp ? -1 : 0;
  }
}
