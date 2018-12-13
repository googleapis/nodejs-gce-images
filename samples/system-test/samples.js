/**
 * Copyright 2018 Google LLC
 *
 * Distributed under MIT license.
 * See file LICENSE for detail or copy at https://opensource.org/licenses/MIT
 */

'use strict';

const {assert} = require('chai');
const execa = require('execa');

if (
  !process.env.GCLOUD_PROJECT ||
  !process.env.GOOGLE_APPLICATION_CREDENTIALS
) {
  throw new Error(
    'Please set the `GCLOUD_PROJECT` and `GOOGLE_APPLICATION_CREDENTIALS` environment variables to run the tests.'
  );
}

describe('quickstart', () => {
  it('should return a list of images', async () => {
    const {stdout} = await execa('node', ['quickstart.js']);
    assert.match(stdout, /^{/);
  });
});

describe('from project', () => {
  it('should return a an image', async () => {
    const {stdout} = await execa('node', ['fromProject.js']);
    assert.match(stdout, /^{/);
  });
});

describe('latestSpecificOS', () => {
  it('should return an image', async () => {
    const {stdout} = await execa('node', ['latestSpecificOS.js']);
    assert.match(stdout, /^{/);
  });
});

describe('specificOS', () => {
  it('should return an image', async () => {
    const {stdout} = await execa('node', ['specificOS.js']);
    assert.match(stdout, /^{/);
  });
});
