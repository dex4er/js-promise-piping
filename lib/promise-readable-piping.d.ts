/// <reference types="node" />

import * as stream from 'stream'

import { PromiseDuplex } from 'promise-duplex'
import { PromiseReadable } from 'promise-readable'

export class PromiseReadablePiping extends PromiseReadable<NodeJS.ReadableStream | stream.Duplex> {
  stream: NodeJS.ReadableStream
  promiseReadable: PromiseReadable<NodeJS.ReadableStream>

  readonly duplex: stream.Duplex[]

  constructor (readable: NodeJS.ReadableStream | PromiseReadable<NodeJS.ReadableStream>, duplex1: stream.Duplex | PromiseDuplex<stream.Duplex>, duplex2: stream.Duplex | PromiseDuplex<stream.Duplex>)
  constructor (readable: NodeJS.ReadableStream | PromiseReadable<NodeJS.ReadableStream>, duplex: stream.Duplex | PromiseDuplex<stream.Duplex>)

  once (event: 'close'): Promise<void>
  once (event: 'end'): Promise<void>
  once (event: 'error'): Promise<void>
  once (event: 'open'): Promise<number>
}

export default PromiseReadablePiping
