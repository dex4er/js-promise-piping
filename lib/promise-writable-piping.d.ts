/// <reference types="node" />

import { Readable, Duplex, Writable } from 'stream'

import PromiseDuplex from 'promise-duplex'
import PromiseWritable from 'promise-writable'

export class PromiseWritablePiping extends PromiseWritable<Duplex | Writable> {
  readonly stream: Writable
  readonly promiseWritable: PromiseWritable<Writable>

  readonly duplexStreams: Duplex[]

  constructor (duplex1: Duplex | PromiseDuplex<Duplex>, duplex2: Duplex | PromiseDuplex<Duplex>, duplex3: Duplex | PromiseDuplex<Duplex>, duplex4: Duplex | PromiseDuplex<Duplex>, duplex5: Duplex | PromiseDuplex<Duplex>, duplex6: Duplex | PromiseDuplex<Duplex>, duplex7: Duplex | PromiseDuplex<Duplex>, duplex8: Duplex | PromiseDuplex<Duplex>, duplex9: Duplex | PromiseDuplex<Duplex>, writable: Writable | PromiseWritable<Writable>)
  constructor (duplex1: Duplex | PromiseDuplex<Duplex>, duplex2: Duplex | PromiseDuplex<Duplex>, duplex3: Duplex | PromiseDuplex<Duplex>, duplex4: Duplex | PromiseDuplex<Duplex>, duplex5: Duplex | PromiseDuplex<Duplex>, duplex6: Duplex | PromiseDuplex<Duplex>, duplex7: Duplex | PromiseDuplex<Duplex>, duplex8: Duplex | PromiseDuplex<Duplex>, writable: Writable | PromiseWritable<Writable>)
  constructor (duplex1: Duplex | PromiseDuplex<Duplex>, duplex2: Duplex | PromiseDuplex<Duplex>, duplex3: Duplex | PromiseDuplex<Duplex>, duplex4: Duplex | PromiseDuplex<Duplex>, duplex5: Duplex | PromiseDuplex<Duplex>, duplex6: Duplex | PromiseDuplex<Duplex>, duplex7: Duplex | PromiseDuplex<Duplex>, writable: Writable | PromiseWritable<Writable>)
  constructor (duplex1: Duplex | PromiseDuplex<Duplex>, duplex2: Duplex | PromiseDuplex<Duplex>, duplex3: Duplex | PromiseDuplex<Duplex>, duplex4: Duplex | PromiseDuplex<Duplex>, duplex5: Duplex | PromiseDuplex<Duplex>, duplex6: Duplex | PromiseDuplex<Duplex>, writable: Writable | PromiseWritable<Writable>)
  constructor (duplex1: Duplex | PromiseDuplex<Duplex>, duplex2: Duplex | PromiseDuplex<Duplex>, duplex3: Duplex | PromiseDuplex<Duplex>, duplex4: Duplex | PromiseDuplex<Duplex>, duplex5: Duplex | PromiseDuplex<Duplex>, writable: Writable | PromiseWritable<Writable>)
  constructor (duplex1: Duplex | PromiseDuplex<Duplex>, duplex2: Duplex | PromiseDuplex<Duplex>, duplex3: Duplex | PromiseDuplex<Duplex>, duplex4: Duplex | PromiseDuplex<Duplex>, writable: Writable | PromiseWritable<Writable>)
  constructor (duplex1: Duplex | PromiseDuplex<Duplex>, duplex2: Duplex | PromiseDuplex<Duplex>, duplex3: Duplex | PromiseDuplex<Duplex>, writable: Writable | PromiseWritable<Writable>)
  constructor (duplex1: Duplex | PromiseDuplex<Duplex>, duplex2: Duplex | PromiseDuplex<Duplex>, writable: Writable | PromiseWritable<Writable>)
  constructor (duplex: Duplex | PromiseDuplex<Duplex>, writable: Writable | PromiseWritable<Writable>)

  once (event: 'close' | 'end' | 'error' | 'finish'): Promise<void>
  once (event: 'open'): Promise<number>
  once (event: 'pipe' | 'unpipe'): Promise<Readable>

  end (): Promise<void>
}

export default PromiseWritablePiping
