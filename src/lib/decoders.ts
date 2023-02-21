import type { Stream } from '@libp2p/interface-connection'
import * as lp from 'it-length-prefixed'
import map from 'it-map'
import { pipe } from 'it-pipe'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'

export async function streamToString(stream: Stream) {
  const data = pipe(
    // Read from the stream (the source)
    stream.source,
    // Decode length-prefixed data
    lp.decode(),
    // Turn buffers into strings
    (source) => map(source, (buf) => uint8ArrayToString(buf.subarray())),
    // Sink function
    async function (source) {
      // For each chunk of data
      for await (const msg of source) {
        console.log('i am on msg ', msg, msg.toString())
        // Return the data as a utf8 string
        return msg.toString().replace('\n', '')
      }
    },
  )
  return data
}
