## promise-piping

[![Build Status](https://secure.travis-ci.org/dex4er/js-promise-piping.svg)](http://travis-ci.org/dex4er/js-promise-piping) [![Coverage Status](https://coveralls.io/repos/github/dex4er/js-promise-piping/badge.svg)](https://coveralls.io/github/dex4er/js-promise-piping) [![npm](https://img.shields.io/npm/v/promise-piping.svg)](https://www.npmjs.com/package/promise-piping)

This module allows to convert stacked streams into one
[`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
object.

The piping object can be open-ended
[`PromiseReadable`](https://www.npmjs.com/package/promise-readable) object or
[`PromiseWritable`](https://www.npmjs.com/package/promise-writable) object or
close-ended.

The piping object can be build from streams: standard objects or promisified
versions or another piping objects.

### Requirements

This module requires Node >= 4. For Node < 6 `--harmony` flag is required.

### Installation

```shell
npm install promise-piping
```

### Usage

```js
const {
  PromiseReadablePiping,
  PromiseWritablePiping,
  PromisePiping
} = require('promise-piping')
```

_Typescript:_

```js
import {
  PromiseReadablePiping,
  PromiseWritablePiping,
  PromisePiping
} from 'promise-piping'
```

#### constructor

```js
const readablePiping = new PromiseReadablePiping(readable, duplex...)
const writablePiping = new PromiseWritablePiping(duplex..., writable)
const piping = new PromisePiping(readable, duplex..., writable)
```

_Example:_

```js
const fs = require('fs')
const zlib = require('zlib')

const filein = fs.createReadStream('/etc/hosts')
const fileout = fs.createWriteStream('/tmp/hosts.gz')
const gzip = zlib.createGzip()
const gunzip = zlib.createGunzip()

const readablePiping = new PromiseReadablePiping(filein, gzip, gunzip)
const writablePiping = new PromiseWritablePiping(gzip, fileout)
const piping = new PromisePiping(filein, gzip, fileout)
```

#### once

```js
const result = await piping.once(event)
```

This method returns `Promise` which is fulfilled when last stream (first
stream for `end` event) emits event. The result of this event is returned
or `undefined` value if stream is already ended.

The promise will reject on error. Errors in piping are propagated from
intermediate streams to the first stream and the last stream. It means that
operation on piping will be rejected if an error occurs in any of its streams.

_Example:_

```js
await piping.once('finish')
```

### See also

[`PromiseReadable`](https://www.npmjs.com/package/promise-readable),
[`PromiseWritable`](https://www.npmjs.com/package/promise-writable),
[`PromiseDuplex`](https://www.npmjs.com/package/promise-duplex),
[`PromiseSocket`](https://www.npmjs.com/package/promise-socket).

### License

Copyright (c) 2017-2018 Piotr Roszatycki <piotr.roszatycki@gmail.com>

[MIT](https://opensource.org/licenses/MIT)
