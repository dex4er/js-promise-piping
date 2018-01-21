/// <reference types="node" />

import { Readable, Duplex } from 'stream'

import { PromiseDuplex } from 'promise-duplex'
import { PromiseReadable } from 'promise-readable'

export class PromiseReadablePiping extends PromiseReadable<Readable | Duplex> {
  readonly stream: Readable
  readonly promiseReadable: PromiseReadable<Readable>

  readonly duplexStreams: Duplex[]

  constructor (readable: Readable | PromiseReadable<Readable>, duplex1: Duplex | PromiseDuplex<Duplex>, duplex2: Duplex | PromiseDuplex<Duplex>, duplex3: Duplex | PromiseDuplex<Duplex>, duplex4: Duplex | PromiseDuplex<Duplex>, duplex5: Duplex | PromiseDuplex<Duplex>, duplex6: Duplex | PromiseDuplex<Duplex>, duplex7: Duplex | PromiseDuplex<Duplex>, duplex8: Duplex | PromiseDuplex<Duplex>, duplex9: Duplex | PromiseDuplex<Duplex>)
  constructor (readable: Readable | PromiseReadable<Readable>, duplex1: Duplex | PromiseDuplex<Duplex>, duplex2: Duplex | PromiseDuplex<Duplex>, duplex3: Duplex | PromiseDuplex<Duplex>, duplex4: Duplex | PromiseDuplex<Duplex>, duplex5: Duplex | PromiseDuplex<Duplex>, duplex6: Duplex | PromiseDuplex<Duplex>, duplex7: Duplex | PromiseDuplex<Duplex>, duplex8: Duplex | PromiseDuplex<Duplex>)
  constructor (readable: Readable | PromiseReadable<Readable>, duplex1: Duplex | PromiseDuplex<Duplex>, duplex2: Duplex | PromiseDuplex<Duplex>, duplex3: Duplex | PromiseDuplex<Duplex>, duplex4: Duplex | PromiseDuplex<Duplex>, duplex5: Duplex | PromiseDuplex<Duplex>, duplex6: Duplex | PromiseDuplex<Duplex>, duplex7: Duplex | PromiseDuplex<Duplex>)
  constructor (readable: Readable | PromiseReadable<Readable>, duplex1: Duplex | PromiseDuplex<Duplex>, duplex2: Duplex | PromiseDuplex<Duplex>, duplex3: Duplex | PromiseDuplex<Duplex>, duplex4: Duplex | PromiseDuplex<Duplex>, duplex5: Duplex | PromiseDuplex<Duplex>, duplex6: Duplex | PromiseDuplex<Duplex>)
  constructor (readable: Readable | PromiseReadable<Readable>, duplex1: Duplex | PromiseDuplex<Duplex>, duplex2: Duplex | PromiseDuplex<Duplex>, duplex3: Duplex | PromiseDuplex<Duplex>, duplex4: Duplex | PromiseDuplex<Duplex>, duplex5: Duplex | PromiseDuplex<Duplex>)
  constructor (readable: Readable | PromiseReadable<Readable>, duplex1: Duplex | PromiseDuplex<Duplex>, duplex2: Duplex | PromiseDuplex<Duplex>, duplex3: Duplex | PromiseDuplex<Duplex>, duplex4: Duplex | PromiseDuplex<Duplex>)
  constructor (readable: Readable | PromiseReadable<Readable>, duplex1: Duplex | PromiseDuplex<Duplex>, duplex2: Duplex | PromiseDuplex<Duplex>, duplex3: Duplex | PromiseDuplex<Duplex>)
  constructor (readable: Readable | PromiseReadable<Readable>, duplex1: Duplex | PromiseDuplex<Duplex>, duplex2: Duplex | PromiseDuplex<Duplex>)
  constructor (readable: Readable | PromiseReadable<Readable>, duplex: Duplex | PromiseDuplex<Duplex>)

  once (event: 'close' | 'end' | 'error'): Promise<void>
  once (event: 'open'): Promise<number>
}

export default PromiseReadablePiping
