// Copyright 2016 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
2018 Google LLC
 *
 * Distributed under MIT license.
 * See file LICENSE for detail or copy at https://opensource.org/licenses/MIT
 */

'use strict';

const {assert} = require('chai');
const {describe, it} = require('mocha');
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
