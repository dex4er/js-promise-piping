const Writable = require('stream').Writable

class MyWritable extends Writable {
  constructor (options) {
    // options.highWaterMark = 5
    super(options)
    this.options = options || {}
    this.lines = []
  }
  _write (chunk, encoding, callback) {
    // console.log(this.options.name, String(chunk))
    this.lines.push(String(chunk))
    if (this.options.withError) {
      process.nextTick(() => this.emit('error', new Error(this.options.name)))
    } else {
      callback()
    }
  }
}

module.exports = { MyWritable: MyWritable }
