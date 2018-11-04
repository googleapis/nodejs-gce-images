/**
 * Copyright 2018 Google LLC
 *
 * Distributed under MIT license.
 * See file LICENSE for detail or copy at https://opensource.org/licenses/MIT
 */

import * as assert from 'assert';
import * as async from 'async';
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

  before(done => {
    // Get counts.
    async.forEachOf(
        allImagesByOsName,

        (_, key, next) => {
          gceImages.getAll(
              {deprecated: key === 'deprecated'}, (err, images) => {
                if (err) {
                  next(err);
                  return;
                }
                allImagesByOsName[key] = images as ImagesMap;
                next();
              });
        },

        done);
  });

  describe('all', () => {
    it('should default to deprecated: false', done => {
      gceImages.getAll((err, is) => {
        const images = is as ImagesMap;
        assert.ifError(err);
        assert.strictEqual(typeof images, 'object');
        Object.keys(images).forEach((osName) => {
          assert.strictEqual(
              images[osName].length, allImagesByOsName.stable[osName].length);
        });
        done();
      });
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
    it('should get only the latest image from every OS', (done) => {
      gceImages.getLatest((err, is) => {
        const images = is as ImageMap;
        assert.ifError(err);
        assert.strictEqual(typeof images, 'object');
        Object.keys(images).forEach((osName) => {
          assert.strictEqual(typeof images[osName], 'object');
        });
        done();
      });
    });

    it('should get the latest image for a specific OS', (done) => {
      const osName = 'ubuntu';

      gceImages.getLatest(osName, (err, image) => {
        assert.ifError(err);
        assert.strictEqual(typeof image, 'object');
        assert((image as Image).selfLink.indexOf(osName) > -1);
        done();
      });
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
