/// <reference types="node" />

import * as stream from 'stream'

import { PromiseDuplex } from 'promise-duplex'
import { PromiseWritable } from 'promise-writable'

export class PromiseWritablePiping extends PromiseWritable<stream.Duplex | NodeJS.WritableStream> {
  stream: NodeJS.WritableStream
  promiseWritable: PromiseWritable<NodeJS.WritableStream>

  readonly duplex: stream.Duplex[]

  constructor (duplex1: stream.Duplex | PromiseDuplex<stream.Duplex>, duplex2: stream.Duplex | PromiseDuplex<stream.Duplex>, writable: NodeJS.WritableStream | PromiseWritable<NodeJS.WritableStream>)
  constructor (duplex: stream.Duplex | PromiseDuplex<stream.Duplex>, writable: NodeJS.WritableStream | PromiseWritable<NodeJS.WritableStream>)

  once (event: 'close'): Promise<void>
  once (event: 'end'): Promise<void>
  once (event: 'error'): Promise<void>
  once (event: 'finish'): Promise<void>
  once (event: 'open'): Promise<number>
  once (event: 'pipe'): Promise<NodeJS.ReadableStream>
  once (event: 'unpipe'): Promise<NodeJS.ReadableStream>

  end (): Promise<void>
}

export default PromiseWritablePiping
