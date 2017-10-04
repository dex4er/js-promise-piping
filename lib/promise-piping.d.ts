import { Duplex } from 'stream'

import { PromiseDuplex } from 'promise-duplex'
import { PromiseReadable } from 'promise-readable'
import { PromiseWritable } from 'promise-writable'

type Readable = NodeJS.ReadableStream
type Writable = NodeJS.WritableStream

export class PromisePiping {
  readonly promiseReadable: PromiseReadable<Readable>
  readonly promiseWritable: PromiseWritable<Writable>

  readonly duplex: Duplex[]

  constructor (readable: Readable | PromiseReadable<Readable>, duplex1: Duplex | PromiseDuplex<Duplex>, duplex2: Duplex | PromiseDuplex<Duplex>, writable: Writable | PromiseWritable<Writable>)
  constructor (readable: Readable | PromiseReadable<Readable>, duplex: Duplex | PromiseDuplex<Duplex>, writable: Writable | PromiseWritable<Writable>)
  constructor (readable: Readable | PromiseReadable<Readable>, writable: Writable | PromiseWritable<Writable>)

  once (event: 'close'): Promise<void>
  once (event: 'end'): Promise<void>
  once (event: 'error'): Promise<void>
  once (event: 'finish'): Promise<void>
  once (event: 'open'): Promise<number>
  once (event: 'pipe'): Promise<NodeJS.ReadableStream>
  once (event: 'unpipe'): Promise<NodeJS.ReadableStream>
}
