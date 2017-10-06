/// <reference types="node" />

import * as stream from 'stream'

import { PromiseDuplex } from 'promise-duplex'
import { PromiseReadable } from 'promise-readable'
import { PromiseWritable } from 'promise-writable'

export { PromiseReadablePiping } from './promise-readable-piping'
export { PromiseWritablePiping } from './promise-writable-piping'

export class PromisePiping {
  readonly promiseReadable: PromiseReadable<NodeJS.ReadableStream>
  readonly promiseWritable: PromiseWritable<NodeJS.WritableStream>

  readonly duplex: stream.Duplex[]

  constructor (readable: NodeJS.ReadableStream | PromiseReadable<NodeJS.ReadableStream>, duplex1: stream.Duplex | PromiseDuplex<stream.Duplex>, duplex2: stream.Duplex | PromiseDuplex<stream.Duplex>, writable: NodeJS.WritableStream | PromiseWritable<NodeJS.WritableStream>)
  constructor (readable: NodeJS.ReadableStream | PromiseReadable<NodeJS.ReadableStream>, duplex: stream.Duplex | PromiseDuplex<stream.Duplex>, writable: NodeJS.WritableStream | PromiseWritable<NodeJS.WritableStream>)
  constructor (readable: NodeJS.ReadableStream | PromiseReadable<NodeJS.ReadableStream>, writable: NodeJS.WritableStream | PromiseWritable<NodeJS.WritableStream>)

  once (event: 'close'): Promise<void>
  once (event: 'end'): Promise<void>
  once (event: 'error'): Promise<void>
  once (event: 'finish'): Promise<void>
  once (event: 'open'): Promise<number>
  once (event: 'pipe'): Promise<NodeJS.ReadableStream>
  once (event: 'unpipe'): Promise<NodeJS.ReadableStream>
}

export default PromisePiping
