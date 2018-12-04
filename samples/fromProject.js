/**
 * Copyright 2018 Google LLC
 *
 * Distributed under MIT license.
 * See file LICENSE for detail or copy at https://opensource.org/licenses/MIT
 */

'use strict';

const projectId = process.env.GCLOUD_PROJECT;
if (!projectId) {
  throw new Error(
    'Please set the `GCLOUD_PROJECT` environment variable to run this sample.'
  );
}

// [START gceimages_latest_os_from_project]
const {GCEImages} = require('gce-images');
const gceImages = new GCEImages();
gceImages.getLatest(`${projectId}/ubuntu`, (err, image) => {
  if (err) {
    throw err;
  }
  console.log(image);
});
// [END gceimages_latest_os_from_project]
