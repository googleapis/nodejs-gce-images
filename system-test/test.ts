/**
 * Copyright 2018 Google LLC
 *
 * Distributed under MIT license.
 * See file LICENSE for detail or copy at https://opensource.org/licenses/MIT
 */

const {assert} = require('chai');
import {GCEImages, Image, ImageMap, ImagesMap} from '../src';

const gceImages = new GCEImages();

interface AllImagesByOSName {
  [index: string]: {[index: string]: Image[]};
}

describe('system tests', () => {
  const allImagesByOsName: AllImagesByOSName = {
    deprecated: {},
    stable: {},
  };

  before(async () => {
    [allImagesByOsName.deprecated, allImagesByOsName.stable] =
        await Promise.all(
            Object.keys(allImagesByOsName).map(key => gceImages.getAll({
              deprecated: key === 'deprecated'
            }) as Promise<ImagesMap>));
  });

  describe('all', () => {
    it('should default to deprecated: false', async () => {
      try {
        const images = await gceImages.getAll() as ImagesMap;
        assert.strictEqual(typeof images, 'object');
        Object.keys(images).forEach((osName) => {
          assert.strictEqual(
              images[osName].length, allImagesByOsName.stable[osName].length);
        });
      } catch (err) {
        assert.ifError(err);
      }
    });

    it('should get all of the images available for a specific OS', (done) => {
      const osName = 'ubuntu';

      gceImages.getAll(osName, (err, images) => {
        assert.ifError(err);
        assert(Array.isArray(images));
        assert.strictEqual(
            images!.length, allImagesByOsName.stable[osName].length);
        done();
      });
    });
  });

  describe('latest', () => {
    it('should get only the latest image from every OS', async () => {
      try {
        const images = await gceImages.getLatest() as ImageMap;
        assert.strictEqual(typeof images, 'object');
        Object.keys(images).forEach((osName) => {
          assert.strictEqual(typeof images[osName], 'object');
        });
      } catch (err) {
        assert.ifError(err);
      }
    });

    it('should get the latest image for a specific OS', async () => {
      const osName = 'ubuntu';
      try {
        const image = await gceImages.getLatest(osName) as Image;
        assert.strictEqual(typeof image, 'object');
        assert(image.selfLink.indexOf(osName) > -1);
      } catch (err) {
        assert.ifError(err);
      }
    });

    it('should get the latest image for a specific OS version', (done) => {
      const osName = 'ubuntu-1410';
      gceImages.getLatest(
          {
            osNames: [osName],
            deprecated: true,
          },
          (err, image) => {
            assert.ifError(err);
            assert.strictEqual(typeof image, 'object');
            assert((image as Image).selfLink.indexOf(osName) > -1);
            done();
          });
    });
  });
});
