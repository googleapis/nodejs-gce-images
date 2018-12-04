/**
 * Copyright 2018 Google LLC
 *
 * Distributed under MIT license.
 * See file LICENSE for detail or copy at https://opensource.org/licenses/MIT
 */

'use strict';

// [START gceimages_quickstart]
const {GCEImages} = require('gce-images');
const gceImages = new GCEImages();
gceImages.getAll((err, images) => {
  if (err) {
    throw err;
  }
  console.log(images);
});
// [END gceimages_quickstart]
