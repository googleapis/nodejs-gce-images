[//]: # "This README.md file is auto-generated, all changes to this file will be lost."
[//]: # "To regenerate it, use `python -m synthtool`."
<img src="https://avatars2.githubusercontent.com/u/2810941?v=3&s=96" alt="Google Cloud Platform logo" title="Google Cloud Platform" align="right" height="96" width="96"/>

# [GCE Images: Node.js Client](https://github.com/googleapis/gce-images)

[![release level](https://img.shields.io/badge/release%20level-general%20availability%20%28GA%29-brightgreen.svg?style=flat)](https://cloud.google.com/terms/launch-stages)
[![npm version](https://img.shields.io/npm/v/gce-images.svg)](https://www.npmjs.org/package/gce-images)
[![codecov](https://img.shields.io/codecov/c/github/googleapis/gce-images/master.svg?style=flat)](https://codecov.io/gh/googleapis/gce-images)




Get a list of globally available Google Compute Engine images


A comprehensive list of changes in each version may be found in
[the CHANGELOG](https://github.com/googleapis/gce-images/blob/master/CHANGELOG.md).

* [GCE Images Node.js Client API Reference][client-docs]
* [GCE Images Documentation][product-docs]
* [github.com/googleapis/gce-images](https://github.com/googleapis/gce-images)

Read more about the client libraries for Cloud APIs, including the older
Google APIs Client Libraries, in [Client Libraries Explained][explained].

[explained]: https://cloud.google.com/apis/docs/client-libraries-explained

**Table of contents:**


* [Quickstart](#quickstart)

  * [Installing the client library](#installing-the-client-library)
  * [Using the client library](#using-the-client-library)
* [Samples](#samples)
* [Versioning](#versioning)
* [Contributing](#contributing)
* [License](#license)

## Quickstart

### Installing the client library

```bash
npm install gce-images
```


### Using the client library

```javascript
const {GCEImages} = require('gce-images');

async function getLatest() {
  const gceImages = new GCEImages();
  const result = await gceImages.getLatest({
    osNames: ['ubuntu-1404'],
    deprecated: true,
  });
  console.log(result);
}

getLatest();

```



## Samples

Samples are in the [`samples/`](https://github.com/googleapis/gce-images/tree/master/samples) directory. Each sample's `README.md` has instructions for running its sample.

| Sample                      | Source Code                       | Try it |
| --------------------------- | --------------------------------- | ------ |
| From Project | [source code](https://github.com/googleapis/gce-images/blob/master/samples/fromProject.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/gce-images&page=editor&open_in_editor=samples/fromProject.js,samples/README.md) |
| Latest Specific OS | [source code](https://github.com/googleapis/gce-images/blob/master/samples/latestSpecificOS.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/gce-images&page=editor&open_in_editor=samples/latestSpecificOS.js,samples/README.md) |
| Quickstart | [source code](https://github.com/googleapis/gce-images/blob/master/samples/quickstart.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/gce-images&page=editor&open_in_editor=samples/quickstart.js,samples/README.md) |
| Specific OS | [source code](https://github.com/googleapis/gce-images/blob/master/samples/specificOS.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/gce-images&page=editor&open_in_editor=samples/specificOS.js,samples/README.md) |



The [GCE Images Node.js Client API Reference][client-docs] documentation
also contains samples.

## Supported Node.js Versions

Our client libraries follow the [Node.js release schedule](https://nodejs.org/en/about/releases/).
Libraries are compatible with all current _active_ and _maintenance_ versions of
Node.js.

Client libraries targeting some end-of-life versions of Node.js are available, and
can be installed via npm [dist-tags](https://docs.npmjs.com/cli/dist-tag).
The dist-tags follow the naming convention `legacy-(version)`.

_Legacy Node.js versions are supported as a best effort:_

* Legacy versions will not be tested in continuous integration.
* Some security patches may not be able to be backported.
* Dependencies will not be kept up-to-date, and features will not be backported.

#### Legacy tags available

* `legacy-8`: install client libraries from this dist-tag for versions
  compatible with Node.js 8.

## Versioning

This library follows [Semantic Versioning](http://semver.org/).


This library is considered to be **General Availability (GA)**. This means it
is stable; the code surface will not change in backwards-incompatible ways
unless absolutely necessary (e.g. because of critical security issues) or with
an extensive deprecation period. Issues and requests against **GA** libraries
are addressed with the highest priority.





More Information: [Google Cloud Platform Launch Stages][launch_stages]

[launch_stages]: https://cloud.google.com/terms/launch-stages

## Contributing

Contributions welcome! See the [Contributing Guide](https://github.com/googleapis/gce-images/blob/master/CONTRIBUTING.md).

Please note that this `README.md`, the `samples/README.md`,
and a variety of configuration files in this repository (including `.nycrc` and `tsconfig.json`)
are generated from a central template. To edit one of these files, make an edit
to its template in this
[directory](https://github.com/googleapis/synthtool/tree/master/synthtool/gcp/templates/node_library).

## License

Apache Version 2.0

See [LICENSE](https://github.com/googleapis/gce-images/blob/master/LICENSE)

[client-docs]: https://googleapis.dev/nodejs/gce-images/latest
[product-docs]: https://cloud.google.com/compute/docs/images
[shell_img]: https://gstatic.com/cloudssh/images/open-btn.png
[projects]: https://console.cloud.google.com/project
[billing]: https://support.google.com/cloud/answer/6293499#enable-billing

[auth]: https://cloud.google.com/docs/authentication/getting-started
