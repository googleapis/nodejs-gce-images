/**
 * Copyright 2018 Google LLC
 *
 * Distributed under MIT license.
 * See file LICENSE for detail or copy at https://opensource.org/licenses/MIT
 */

'use strict';

// [START gceimages_latest_os]
const {GCEImages} = require('gce-images');
const gceImages = new GCEImages();
gceImages.getLatest('ubuntu', (err, image) => {
  if (err) {
    throw err;
  }
  console.log(image);
});
// [END gceimages_latest_os]
