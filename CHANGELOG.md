# Changelog

## v0.4.0 2018-01-20

  * Serious bug fixed when more than two streams are piped.
  * Errors in piping are propagated from intermediate streams to the first
    stream (writable piping) or the last stream (readable piping) or both (full
    piping).
  * `duplex` property is renamed to `duplexStreams`.
  * Requires `promise-readable` and `promise-writable` explicitely.

## v0.3.0 2017-10-17

  * Typescript: accept stream.Readable and stream.Writable as arguments.

## v0.2.1 2017-10-09

  * Bugfix for `PromiseWritablePiping` typings.

## v0.2.0 2017-10-06

  * Use native `Promise` rather than `any-event`.
  * Typescript: reference additional modules in our typings file.

## v0.1.0 2017-10-05

  * Wait for `end` event from first stream.

## v0.0.1 2017-10-04

  * Initial release
