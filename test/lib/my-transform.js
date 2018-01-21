const Transform = require('stream').Transform

class MyTransform extends Transform {
  constructor (options) {
    // options.highWaterMark = 5
    super(options)
    this.options = options || {}
  }
  _transform (chunk, encoding, callback) {
    // console.log(this.options.name, String(chunk))
    if (this.options.withError) {
      process.nextTick(() => this.emit('error', new Error(this.options.name)))
    } else {
      callback(null, `> ${String(chunk)}`)
    }
  }
}

module.exports = { MyTransform: MyTransform }
