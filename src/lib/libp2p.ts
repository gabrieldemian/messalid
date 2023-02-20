import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { noise } from '@chainsafe/libp2p-noise'
import { mplex } from '@libp2p/mplex'
import { webRTCStar } from '@libp2p/webrtc-star'
import { webSockets } from '@libp2p/websockets'
import { Libp2p, createLibp2p } from 'libp2p'
import { createEffect, createSignal } from 'solid-js'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'

export const topic = 'news'

const wrtcStar = webRTCStar()
// create a Peer/Node on the network
export const createNode = async () => {
  const node = await createLibp2p({
    addresses: {
      listen: [
        //'/ip4/0.0.0.0/tcp/0',
        '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
        '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
      ],
    },
    transports: [webSockets(), wrtcStar.transport],
    streamMuxers: [mplex()],
    connectionEncryption: [noise()],
    pubsub: gossipsub({ allowPublishToZeroPeers: true }),
    peerDiscovery: [wrtcStar.discovery],
  })

  return node
}

export const [alice, setAlice] = createSignal<Libp2p>()
export const [bob, setBob] = createSignal<Libp2p>()

createEffect(() => {
  if (alice() && bob()) {
    console.log('alice and bob are loaded')
    console.log(alice())
    alice()?.pubsub.subscribe(topic)
    bob()?.pubsub.subscribe(topic)
    alice()?.pubsub.addEventListener('message', (evt) => {
      console.log(
        `alice received: ${uint8ArrayToString(evt.detail.data)} on topic ${
          evt.detail.topic
        }`,
      )
    })
    bob()?.pubsub.addEventListener('message', (evt) => {
      console.log(
        `bob received: ${uint8ArrayToString(evt.detail.data)} on topic ${
          evt.detail.topic
        }`,
      )
    })
  }
})

export const initPeers = async () => {
  const [alice, bob] = await Promise.all([createNode(), createNode()])

  await alice.peerStore.addressBook.set(bob.peerId, bob.getMultiaddrs())
  await alice.dial(bob.peerId)

  setAlice(alice)
  setBob(bob)
}

// a trick to only run in the browser
createEffect(() => initPeers())

export const sendMessage = (
  peer: Libp2p,
  topic_: typeof topic,
  message: string,
) => {
  peer.pubsub.publish(topic_, uint8ArrayFromString(message))
}
