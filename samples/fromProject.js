/**
 * Copyright 2018 Google LLC
 *
 * Distributed under MIT license.
 * See file LICENSE for detail or copy at https://opensource.org/licenses/MIT
 */

'use strict';

// [START gceimages_latest_os_from_project]
const {GCEImages} = require('gce-images');

async function getLatest() {
  const gceImages = new GCEImages();
  const projectId = await gceImages.getProjectId();
  const result = await gceImages.getLatest(`${projectId}/my-ubuntu-image`);
  console.log(result);
}

getLatest();
// [END gceimages_latest_os_from_project]
