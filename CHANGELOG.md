# Changelog

[npm history][1]

[1]: https://www.npmjs.com/package/gce-images?activeTab=versions

## v1.1.0

02-05-2019 15:28 PST

### New Features
- feat: introduce async methods ([#100](https://github.com/googleapis/gce-images/pull/100))

### Dependencies
- fix(deps): update dependency google-auth-library to v3 ([#103](https://github.com/googleapis/gce-images/pull/103))

### Documentation
- docs: add lint/fix example to contributing guide ([#107](https://github.com/googleapis/gce-images/pull/107))
- docs: add samples and sample tests ([#88](https://github.com/googleapis/gce-images/pull/88))

## v1.0.0

Welcome to 1.0! The big feature in this release is the availability of TypeScript types out of the box.  To that end, there is a breaking change:

**BREAKING CHANGE**: The `GCEImages` object must now be instantiated.

#### Old Code
```js
const images = require('gce-images')();
```

#### New Code
```js
const {GCEImages} = require('gce-images');
const images = new GCEImages();
```
======

### New Features
- feat: convert to TypeScript ([#21](https://github.com/GoogleCloudPlatform/gce-images/pull/21))
- fix: improve TypeScript types ([#72](https://github.com/GoogleCloudPlatform/gce-images/pull/72))

### Dependencies
- fix(deps): update dependency google-auth-library to v2 ([#33](https://github.com/GoogleCloudPlatform/gce-images/pull/33))
- chore: drop dependency on got and google-auto-auth ([#23](https://github.com/GoogleCloudPlatform/gce-images/pull/23))

### Documentation

### Internal / Testing Changes
- chore: update CircleCI config ([#71](https://github.com/GoogleCloudPlatform/gce-images/pull/71))
- chore: include build in eslintignore ([#68](https://github.com/GoogleCloudPlatform/gce-images/pull/68))
- chore(deps): update dependency eslint-plugin-node to v8 ([#64](https://github.com/GoogleCloudPlatform/gce-images/pull/64))
- chore: update issue templates ([#63](https://github.com/GoogleCloudPlatform/gce-images/pull/63))
- chore: remove old issue template ([#61](https://github.com/GoogleCloudPlatform/gce-images/pull/61))
- build: run tests on node11 ([#60](https://github.com/GoogleCloudPlatform/gce-images/pull/60))
- chores(build): run codecov on continuous builds ([#55](https://github.com/GoogleCloudPlatform/gce-images/pull/55))
- chore(deps): update dependency typescript to ~3.1.0 ([#57](https://github.com/GoogleCloudPlatform/gce-images/pull/57))
- chore(deps): update dependency eslint-plugin-prettier to v3 ([#58](https://github.com/GoogleCloudPlatform/gce-images/pull/58))
- chores(build): do not collect sponge.xml from windows builds ([#56](https://github.com/GoogleCloudPlatform/gce-images/pull/56))
- chore: update new issue template ([#54](https://github.com/GoogleCloudPlatform/gce-images/pull/54))
- chore: update build config ([#51](https://github.com/GoogleCloudPlatform/gce-images/pull/51))
- Update kokoro config ([#48](https://github.com/GoogleCloudPlatform/gce-images/pull/48))
- Re-generate library using /synth.py ([#45](https://github.com/GoogleCloudPlatform/gce-images/pull/45))
- Update kokoro config ([#44](https://github.com/GoogleCloudPlatform/gce-images/pull/44))
- test: remove appveyor config ([#43](https://github.com/GoogleCloudPlatform/gce-images/pull/43))
- Update CI config ([#42](https://github.com/GoogleCloudPlatform/gce-images/pull/42))
- Enable prefer-const in the eslint config ([#40](https://github.com/GoogleCloudPlatform/gce-images/pull/40))
- Enable no-var in eslint ([#39](https://github.com/GoogleCloudPlatform/gce-images/pull/39))
- Move to the new github org ([#38](https://github.com/GoogleCloudPlatform/gce-images/pull/38))
- Update CI config ([#37](https://github.com/GoogleCloudPlatform/gce-images/pull/37))
- Retry npm install in CI ([#35](https://github.com/GoogleCloudPlatform/gce-images/pull/35))
- Update CI config ([#32](https://github.com/GoogleCloudPlatform/gce-images/pull/32))
- chore(deps): update dependency nyc to v13 ([#31](https://github.com/GoogleCloudPlatform/gce-images/pull/31))
- remove the docs command
- Update the CI config ([#30](https://github.com/GoogleCloudPlatform/gce-images/pull/30))
- test: add a key for CircleCI ([#29](https://github.com/GoogleCloudPlatform/gce-images/pull/29))
- Re-generate library using /synth.py ([#28](https://github.com/GoogleCloudPlatform/gce-images/pull/28))
- chore(deps): update dependency eslint-config-prettier to v3 ([#27](https://github.com/GoogleCloudPlatform/gce-images/pull/27))
- chore: ignore package-lock.json ([#26](https://github.com/GoogleCloudPlatform/gce-images/pull/26))
- chore(deps): lock file maintenance ([#25](https://github.com/GoogleCloudPlatform/gce-images/pull/25))
- chore: update renovate config ([#20](https://github.com/GoogleCloudPlatform/gce-images/pull/20))
- chore: upgrade to es6 ([#24](https://github.com/GoogleCloudPlatform/gce-images/pull/24))
- chore(deps): update dependency mocha to v5 ([#17](https://github.com/GoogleCloudPlatform/gce-images/pull/17))
- fix(deps): update dependency async to v2 ([#18](https://github.com/GoogleCloudPlatform/gce-images/pull/18))
- fix(deps): update dependency google-auto-auth to ^0.10.0 ([#16](https://github.com/GoogleCloudPlatform/gce-images/pull/16))
- Check in synth.py and conform to google node repo standards ([#14](https://github.com/GoogleCloudPlatform/gce-images/pull/14))
- Update renovate.json
- Add renovate.json
- chore: fix the directory structure ([#12](https://github.com/GoogleCloudPlatform/gce-images/pull/12))
- chore: make it OSPO compliant ([#10](https://github.com/GoogleCloudPlatform/gce-images/pull/10))

