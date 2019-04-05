/**
 * Copyright 2018 Google LLC
 *
 * Distributed under MIT license.
 * See file LICENSE for detail or copy at https://opensource.org/licenses/MIT
 */

'use strict';

const {assert} = require('chai');
const cp = require('child_process');

const execSync = cmd => cp.execSync(cmd, {encoding: 'utf-8'});

describe('quickstart', () => {
  it('should return a list of images', () => {
    const stdout = execSync('node quickstart.js');
    assert.match(stdout, /^{/);
  });
});

describe('from project', () => {
  it('should return an image', () => {
    const stdout = execSync('node fromProject.js');
    assert.match(stdout, /^{/);
  });
});

describe('latestSpecificOS', () => {
  it('should return an image', () => {
    const stdout = execSync('node latestSpecificOS.js');
    assert.match(stdout, /^{/);
  });
});

describe('specificOS', () => {
  it('should return an image', () => {
    const stdout = execSync('node specificOS.js');
    assert.match(stdout, /^{/);
  });
});
