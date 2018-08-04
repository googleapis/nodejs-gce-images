/**
 * Copyright 2018 Google LLC
 *
 * Distributed under MIT license.
 * See file LICENSE for detail or copy at https://opensource.org/licenses/MIT
 */

'use strict';

import * as assert from 'assert';
import {GCEImages} from '../src';

const gceImages = new GCEImages();

describe('gce-images', function() {
  describe('_sortNewestFirst', function() {
    describe('when imageA.creationTimestamp is newer than imageB.creationTimestamp', function() {
      it('should return -1', function() {
        var imageA = {creationTimestamp: '2016-10-22T13:06:19.143-08:00'};
        var imageB = {creationTimestamp: '2016-09-25T07:31:52.339-07:00'};

        assert.strictEqual(gceImages._sortNewestFirst(imageA, imageB), -1);
      });
    });

    describe('when imageA.creationTimestamp is older than imageB.creationTimestamp', function() {
      it('should return 1', function() {
        var imageA = {creationTimestamp: '2016-10-22T13:06:19.143-08:00'};
        var imageB = {creationTimestamp: '2016-11-17T14:37:55.828-08:00'};

        assert.strictEqual(gceImages._sortNewestFirst(imageA, imageB), 1);
      });
    });

    describe('when imageA.creationTimestamp is equal to imageB.creationTimestamp', function() {
      it('should return 0', function() {
        var imageA = {creationTimestamp: '2016-08-25T07:14:24.426-07:00'};
        var imageB = {creationTimestamp: '2016-08-25T07:14:24.426-07:00'};

        assert.strictEqual(gceImages._sortNewestFirst(imageA, imageB), 0);
      });
    });
  });
});
