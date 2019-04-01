/**
 * Copyright 2018 Google LLC
 *
 * Distributed under MIT license.
 * See file LICENSE for detail or copy at https://opensource.org/licenses/MIT
 */

'use strict';

// [START gceimages_latest_os_specific_version]
const {GCEImages} = require('gce-images');

async function getLatest() {
  const gceImages = new GCEImages();
  const result = await gceImages.getLatest('ubuntu-1404');
  console.log(result);
}

getLatest();
// [START gceimages_latest_os_specific_version]
