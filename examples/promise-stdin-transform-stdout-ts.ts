import { Transform } from 'stream'

import { PromisePiping } from '../lib/promise-piping'

class MyTransform extends Transform {
  _transform (chunk: string | Buffer, encoding: string, callback: (err: Error | null, chunk: string | Buffer) => void): void {
    callback(null, chunk)
  }
  _flush (callback: () => void) {
    callback()
  }
}

const streams = {
  stdin: process.stdin,
  stdout: process.stdout,
  transform1: new MyTransform(),
  transform2: new MyTransform()
}

for (const stream of Object.keys(streams)) {
  for (const event of ['close', 'data', 'drain', 'end', 'error', 'finish', 'pipe', 'readable', 'unpipe']) {
    if (stream === 'stdout' && ['data', 'readable'].includes(event)) continue
    (streams as any)[stream].on(event, (arg: any) => console.log(`${stream} emitted ${event}:`, typeof arg === 'object' ? arg.constructor.name : arg))
  }
}

async function main (): Promise<void> {
  const pipe = new PromisePiping(streams.stdin, streams.transform1, streams.stdout)
  await pipe.once('unpipe')
  console.log('END')
}

main().catch(console.error)
