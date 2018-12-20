/**
 * Copyright 2018 Google LLC
 *
 * Distributed under MIT license.
 * See file LICENSE for detail or copy at https://opensource.org/licenses/MIT
 */

'use strict';

// [START gceimages_latest_os_specific_version]
const {GCEImages} = require('gce-images');
async function main() {
  const gceImages = new GCEImages();
  console.log(await gceImages.getLatest('ubuntu-1404'));
}
main().catch(console.error);
// [START gceimages_latest_os_specific_version]
