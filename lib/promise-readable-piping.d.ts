import { Duplex } from 'stream'

import { PromiseDuplex } from 'promise-duplex'
import { PromiseReadable } from 'promise-readable'

type Readable = NodeJS.ReadableStream

export class PromiseReadablePiping extends PromiseReadable<Readable | Duplex> {
  stream: Readable
  promiseReadable: PromiseReadable<Readable>

  readonly duplex: Duplex[]

  constructor (readable: Readable | PromiseReadable<Readable>, duplex1: Duplex | PromiseDuplex<Duplex>, duplex2: Duplex | PromiseDuplex<Duplex>)
  constructor (readable: Readable | PromiseReadable<Readable>, duplex: Duplex | PromiseDuplex<Duplex>)

  once (event: 'close'): Promise<void>
  once (event: 'end'): Promise<void>
  once (event: 'error'): Promise<void>
  once (event: 'open'): Promise<number>
}

export default PromiseReadablePiping
