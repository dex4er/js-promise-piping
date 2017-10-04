import { Duplex } from 'stream'

import { PromiseDuplex } from 'promise-duplex'
import { PromiseWritable } from 'promise-writable'

type Writable = NodeJS.WritableStream

export class PromiseWritablePiping extends PromiseWritable<Duplex | Writable> {
  stream: Writable
  promiseWritable: PromiseWritable<Writable>

  readonly duplex: Duplex[]

  constructor (duplex1: Duplex | PromiseDuplex<Duplex>, duplex2: Duplex | PromiseDuplex<Duplex>, writable: Writable | PromiseWritable<Writable>)
  constructor (duplex: Duplex | PromiseDuplex<Duplex>, writable: Writable | PromiseWritable<Writable>)

  once (event: 'close'): Promise<void>
  once (event: 'end'): Promise<void>
  once (event: 'error'): Promise<void>
  once (event: 'finish'): Promise<void>
  once (event: 'open'): Promise<number>
  once (event: 'pipe'): Promise<NodeJS.ReadableStream>
  once (event: 'unpipe'): Promise<NodeJS.ReadableStream>

  end (): Promise<void>
}
