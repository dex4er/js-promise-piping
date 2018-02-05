/// <reference types="node" />

import { Readable, Writable, Duplex } from 'stream'

import PromiseDuplex from 'promise-duplex'
import PromiseReadable from 'promise-readable'
import PromiseWritable from 'promise-writable'

export { PromiseReadablePiping } from './promise-readable-piping'
export { PromiseWritablePiping } from './promise-writable-piping'

export class PromisePiping {
  readonly promiseReadable: PromiseReadable<Readable>
  readonly promiseWritable: PromiseWritable<Writable>

  readonly duplexStreams: Duplex[]

  constructor (readable: Readable | PromiseReadable<Readable>, duplex1: Duplex | PromiseDuplex<Duplex>, duplex2: Duplex | PromiseDuplex<Duplex>, duplex3: Duplex | PromiseDuplex<Duplex>, duplex4: Duplex | PromiseDuplex<Duplex>, duplex5: Duplex | PromiseDuplex<Duplex>, duplex6: Duplex | PromiseDuplex<Duplex>, duplex7: Duplex | PromiseDuplex<Duplex>, duplex8: Duplex | PromiseDuplex<Duplex>, writable: Writable | PromiseWritable<Writable>)
  constructor (readable: Readable | PromiseReadable<Readable>, duplex1: Duplex | PromiseDuplex<Duplex>, duplex2: Duplex | PromiseDuplex<Duplex>, duplex3: Duplex | PromiseDuplex<Duplex>, duplex4: Duplex | PromiseDuplex<Duplex>, duplex5: Duplex | PromiseDuplex<Duplex>, duplex6: Duplex | PromiseDuplex<Duplex>, duplex7: Duplex | PromiseDuplex<Duplex>, writable: Writable | PromiseWritable<Writable>)
  constructor (readable: Readable | PromiseReadable<Readable>, duplex1: Duplex | PromiseDuplex<Duplex>, duplex2: Duplex | PromiseDuplex<Duplex>, duplex3: Duplex | PromiseDuplex<Duplex>, duplex4: Duplex | PromiseDuplex<Duplex>, duplex5: Duplex | PromiseDuplex<Duplex>, duplex6: Duplex | PromiseDuplex<Duplex>, writable: Writable | PromiseWritable<Writable>)
  constructor (readable: Readable | PromiseReadable<Readable>, duplex1: Duplex | PromiseDuplex<Duplex>, duplex2: Duplex | PromiseDuplex<Duplex>, duplex3: Duplex | PromiseDuplex<Duplex>, duplex4: Duplex | PromiseDuplex<Duplex>, duplex5: Duplex | PromiseDuplex<Duplex>, writable: Writable | PromiseWritable<Writable>)
  constructor (readable: Readable | PromiseReadable<Readable>, duplex1: Duplex | PromiseDuplex<Duplex>, duplex2: Duplex | PromiseDuplex<Duplex>, duplex3: Duplex | PromiseDuplex<Duplex>, duplex4: Duplex | PromiseDuplex<Duplex>, writable: Writable | PromiseWritable<Writable>)
  constructor (readable: Readable | PromiseReadable<Readable>, duplex1: Duplex | PromiseDuplex<Duplex>, duplex2: Duplex | PromiseDuplex<Duplex>, duplex3: Duplex | PromiseDuplex<Duplex>, writable: Writable | PromiseWritable<Writable>)
  constructor (readable: Readable | PromiseReadable<Readable>, duplex1: Duplex | PromiseDuplex<Duplex>, duplex2: Duplex | PromiseDuplex<Duplex>, writable: Writable | PromiseWritable<Writable>)
  constructor (readable: Readable | PromiseReadable<Readable>, duplex: Duplex | PromiseDuplex<Duplex>, writable: Writable | PromiseWritable<Writable>)
  constructor (readable: Readable | PromiseReadable<Readable>, writable: Writable | PromiseWritable<Writable>)

  once (event: 'close' | 'end' | 'error' | 'finish'): Promise<void>
  once (event: 'open'): Promise<number>
  once (event: 'pipe' | 'unpipe'): Promise<Readable>

  destroy (): void
}

export default PromisePiping
