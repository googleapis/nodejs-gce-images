/**
 * Copyright 2018 Google LLC
 *
 * Distributed under MIT license.
 * See file LICENSE for detail or copy at https://opensource.org/licenses/MIT
 */

import * as assert from 'assert';
import {GCEImages, Image} from '../src';

const gceImages = new GCEImages();

describe('gce-images', () => {
  it('should use the configured apiEndpoint', () => {
    const apiEndpoint = 'fake.local';
    const images = new GCEImages({apiEndpoint});
    const expectedPath = `https://${apiEndpoint}/compute/v1/projects/centos-cloud/global/images`;
    assert.strictEqual(images.OS_URLS.centos, expectedPath);
  });

  describe('_sortNewestFirst', () => {
    describe('when imageA.creationTimestamp is newer than imageB.creationTimestamp', () => {
      it('should return -1', () => {
        const imageA = {
          creationTimestamp: '2016-10-22T13:06:19.143-08:00',
        } as Image;
        const imageB = {
          creationTimestamp: '2016-09-25T07:31:52.339-07:00',
        } as Image;
        assert.strictEqual(gceImages._sortNewestFirst(imageA, imageB), -1);
      });
    });

    describe('when imageA.creationTimestamp is older than imageB.creationTimestamp', () => {
      it('should return 1', () => {
        const imageA = {
          creationTimestamp: '2016-10-22T13:06:19.143-08:00',
        } as Image;
        const imageB = {
          creationTimestamp: '2016-11-17T14:37:55.828-08:00',
        } as Image;
        assert.strictEqual(gceImages._sortNewestFirst(imageA, imageB), 1);
      });
    });

    describe('when imageA.creationTimestamp is equal to imageB.creationTimestamp', () => {
      it('should return 0', () => {
        const imageA = {
          creationTimestamp: '2016-08-25T07:14:24.426-07:00',
        } as Image;
        const imageB = {
          creationTimestamp: '2016-08-25T07:14:24.426-07:00',
        } as Image;
        assert.strictEqual(gceImages._sortNewestFirst(imageA, imageB), 0);
      });
    });
  });
});
