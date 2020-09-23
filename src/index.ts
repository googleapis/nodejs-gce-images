// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import arrify = require('arrify');
import {GoogleAuth, GoogleAuthOptions} from 'google-auth-library';

export interface GCEImagesConfig extends GoogleAuthOptions {
  authClient?: GoogleAuth;
  /**
   * The host name used to access the compute API.
   * Defaults to `compute.googleapis.com`.
   */
  apiEndpoint?: string;
}

export interface GetOptions {
  deprecated?: boolean;
  osNames?: string[];
}

export interface Image {
  creationTimestamp: string;
  deprecated: {
    state: 'ACTIVE' | 'DEPRECATED' | 'OBSOLETE' | 'DELETED';
    replacement: string;
    deprecated: string;
    obsolete: string;
    deleted: string;
  };
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
  family: string;
  labelFingerprint: string;
  guestOsFeatures: {
    type:
      | 'MULTI_IP_SUBNET'
      | 'UEFI_COMPATIBLE'
      | 'VIRTIO_SCSI_MULTIQUEUE'
      | 'WINDOWS';
  }[];
  licenseCodes: string[];
  storageLocations: string[];
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

export interface OSUrls {
  centos: string;
  'container-vm': string;
  coreos: string;
  debian: string;
  redhat: string;
  opensuse: string;
  suse: string;
  ubuntu: string;
  windows: string;
}

export class GCEImages {
  private _auth: GoogleAuth;
  private apiEndpoint: string;
  OS_URLS: OSUrls;
  OS_TO_URL: {[index: string]: string};
  constructor(config: GCEImagesConfig = {}) {
    this.apiEndpoint = config.apiEndpoint || 'compute.googleapis.com';
    config.scopes = ['https://www.googleapis.com/auth/compute'];
    this._auth = config.authClient || new GoogleAuth(config);
    const projectsPath = `https://${this.apiEndpoint}/compute/v1/projects`;
    this.OS_URLS = {
      centos: `${projectsPath}/centos-cloud/global/images`,
      'container-vm': `${projectsPath}/cos-cloud/global/images`,
      coreos: `${projectsPath}/coreos-cloud/global/images`,
      debian: `${projectsPath}/debian-cloud/global/images`,
      redhat: `${projectsPath}/rhel-cloud/global/images`,
      opensuse: `${projectsPath}/opensuse-cloud/global/images`,
      suse: `${projectsPath}/suse-cloud/global/images`,
      ubuntu: `${projectsPath}/ubuntu-os-cloud/global/images`,
      windows: `${projectsPath}/windows-cloud/global/images`,
    };
    this.OS_TO_URL = {
      centos: this.OS_URLS.centos,
      'centos-cloud': this.OS_URLS.centos,
      'container-vm': this.OS_URLS['container-vm'],
      'google-containers': this.OS_URLS['container-vm'],
      cos: this.OS_URLS['container-vm'],
      coreos: this.OS_URLS.coreos,
      'coreos-cloud': this.OS_URLS.coreos,
      debian: this.OS_URLS.debian,
      'debian-cloud': this.OS_URLS.debian,
      rhel: this.OS_URLS.redhat,
      'rhel-cloud': this.OS_URLS.redhat,
      redhat: this.OS_URLS.redhat,
      opensuse: this.OS_URLS.opensuse,
      'opensuse-cloud': this.OS_URLS.opensuse,
      suse: this.OS_URLS.suse,
      'suse-cloud': this.OS_URLS.suse,
      ubuntu: this.OS_URLS.ubuntu,
      'ubuntu-cloud': this.OS_URLS.ubuntu,
      'ubuntu-os-cloud': this.OS_URLS.ubuntu,
      windows: this.OS_URLS.windows,
      'windows-cloud': this.OS_URLS.windows,
    };
  }

  async getProjectId() {
    return this._auth.getProjectId();
  }

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
        : Array.from(osNamesToImages).reduce((obj: ImagesMap, [key, value]) => {
            obj[key] = value;
            return obj;
          }, {} as ImagesMap);
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

    // All CoreOS images are now deprecated, See:
    // https://cloud.google.com/compute/docs/eol/coreOS 
    if (images.length === 0 && !osParts.name.startsWith('coreos')) {
      throw new Error('Could not find a suitable image.');
    }
    return images;
  }

  // tslint:disable-next-line no-any
  _parseArguments<O, C>(options: any, callback: any): ParsedArguments<O, C> {
    const defaultOptions = {
      deprecated: false,
      osNames: Object.keys(this.OS_URLS),
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

    if (this.OS_TO_URL[os]) {
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
      osParts.url = `https://compute.googleapis.com/compute/v1/projects/${project!}/global/images`;
    } else {
      osParts.url = this.OS_TO_URL[osParts.name];
    }

    if (!osParts.url) {
      throw new Error(
        [
          'Cannot find ' + os,
          'Expected one of: ' + Object.keys(this.OS_URLS).join(', '),
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
