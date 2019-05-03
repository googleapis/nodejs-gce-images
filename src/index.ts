/**
 * Copyright 2018 Google LLC
 *
 * Distributed under MIT license.
 * See file LICENSE for detail or copy at https://opensource.org/licenses/MIT
 */

import arrify = require('arrify');
import {GoogleAuth, GoogleAuthOptions} from 'google-auth-library';

export interface GCEImagesConfig extends GoogleAuthOptions {
  authClient?: GoogleAuth;
}

export interface GetOptions {
  deprecated?: boolean;
  osNames?: string[];
}

export interface Image {
  creationTimestamp: string;
  deprecated: boolean;
  kind: 'compute#image';
  selfLink: string;
  id: string;
  name: string;
  description: string;
  sourceType: string;
  rawDisk: {source: string; containerType: string};
  status: string;
  archiveSizeBytes: number;
  diskSizeGb: number;
  licenses: string[];
}

export interface GetAllCallback {
  (err: Error | null, images?: Image[] | ImagesMap): void;
}

export interface GetLatestCallback {
  (err: Error | null, images?: Image | ImageMap): void;
}

export interface ImagesMap {
  [index: string]: Image[];
}
export interface ImageMap {
  [index: string]: Image;
}

interface ParsedArguments<O, C> {
  options: O;
  callback: C;
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

  async getProjectId() {
    return this._auth.getProjectId();
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

  private static OS_TO_URL: {[index: string]: string} = {
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
   * @param {string=|object=} options - If a string, treat as an OS to fetch images for.
   * @param {boolean} options.deprecated [false] - Include deprecated results.
   * @param {array} options.osNames [all] - OS names to include in the results.
   * @param {function} callback - Callback function.
   * @returns {Promise} if callback is omitted.
   */
  getAll(cb: GetAllCallback): void;
  getAll(opts?: GetOptions | string): Promise<Image[] | ImagesMap>;
  getAll(opts: GetOptions | string, cb: GetAllCallback): void;
  getAll(
    optsOrCb?: GetOptions | string | GetAllCallback,
    cb?: GetAllCallback
  ): Promise<Image[] | ImagesMap> | void {
    const {options, callback} = this._parseArguments<
      GetOptions,
      GetAllCallback
    >(optsOrCb, cb);
    if (callback) {
      this.getAllAsync(options).then(
        r => callback(null, r as Image[]),
        callback
      );
    } else {
      return this.getAllAsync(options);
    }
  }

  private async getAllAsync(opts: GetOptions): Promise<Image[] | ImagesMap> {
    const osNamesToImages = new Map<string, Image[]>();
    await Promise.all(
      opts.osNames!.map(async name => {
        const singleOsOptions = Object.assign({}, opts, {osNames: [name]});
        osNamesToImages.set(
          name,
          (await this._getAllByOS(singleOsOptions)) || []
        );
      })
    );
    const result =
      opts.osNames!.length === 1
        ? (osNamesToImages.get(opts.osNames![0]) as Image[])
        : Array.from(osNamesToImages).reduce(
            (obj: ImagesMap, [key, value]) => {
              obj[key] = value;
              return obj;
            },
            {} as ImagesMap
          );
    return result as Image[];
  }

  /**
   * Get all available images, but only return the newest one.
   *
   * @param {string=|object=} options - If a string, treat as an OS to fetch
   *                                    images for.
   * @param {boolean} options.deprecated [false] - Include deprecated results.
   * @param {array} options.osNames [all] - OS names to include in the results.
   * @param {function} callback - Callback function.
   * @returns {Promise} if callback is omitted.
   */
  getLatest(cb: GetLatestCallback): void;
  getLatest(opts?: GetOptions | string): Promise<Image | ImageMap>;
  getLatest(opts: GetOptions | string, cb: GetLatestCallback): void;
  getLatest(
    optsOrCb?: GetOptions | string | GetLatestCallback,
    cb?: GetLatestCallback
  ): Promise<Image | ImageMap> | void {
    const {options, callback} = this._parseArguments<
      GetOptions,
      GetLatestCallback
    >(optsOrCb, cb);
    if (callback) {
      this.getLatestAsync(options).then(r => callback(null, r), callback);
    } else {
      return this.getLatestAsync(options);
    }
  }

  private async getLatestAsync(opts: GetOptions): Promise<Image | ImageMap> {
    const images = await this.getAllAsync(opts);
    let image: Image | ImageMap | undefined;
    if (Array.isArray(images)) {
      [image] = images.sort(this._sortNewestFirst);
    } else {
      image = {} as ImageMap;
      for (const name in images) {
        if (images[name]) {
          image[name] = images[name].sort(this._sortNewestFirst)[0];
        }
      }
    }
    return image;
  }

  async _getAllByOS(
    options: GetOptions & {osNames: string[]}
  ): Promise<Image[]> {
    const osParts = this._parseOsInput(options.osNames![0]);
    const reqOpts = {
      url: osParts.url,
      params: {} as {
        [index: string]: string;
      },
    };
    if (osParts.version.length > 0) {
      reqOpts.params.filter =
        'name eq ' + [osParts.name, osParts.version].join('-') + '.*';
    }
    const resp = await this._auth.request(reqOpts);
    let images = resp.data.items || [];
    if (!options.deprecated) {
      images = images.filter(this._filterDeprecated);
    }

    if (images.length === 0) {
      throw new Error('Could not find a suitable image.');
    }
    return images;
  }

  // tslint:disable-next-line no-any
  _parseArguments<O, C>(options: any, callback: any): ParsedArguments<O, C> {
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

    parsedArguments.options = Object.assign(
      defaultOptions,
      parsedArguments.options
    );
    parsedArguments.options.osNames = arrify(parsedArguments.options.osNames);

    return parsedArguments;
  }

  _parseOsInput(os: string) {
    const osParts = {
      name: '',
      version: '',
      url: '',
    };

    let project: string;
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
      osParts.url = `https://www.googleapis.com/compute/v1/projects/${project!}/global/images`;
    } else {
      osParts.url = GCEImages.OS_TO_URL[osParts.name];
    }

    if (!osParts.url) {
      throw new Error(
        [
          'Cannot find ' + os,
          'Expected one of: ' + Object.keys(GCEImages.OS_URLS).join(', '),
        ].join('. ')
      );
    }

    return osParts;
  }

  _filterDeprecated(image: Image) {
    return !image.deprecated;
  }

  _sortNewestFirst(imageA: Image, imageB: Image) {
    return imageA.creationTimestamp < imageB.creationTimestamp
      ? 1
      : imageA.creationTimestamp > imageB.creationTimestamp
      ? -1
      : 0;
  }
}
