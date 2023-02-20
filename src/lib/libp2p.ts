import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { noise } from '@chainsafe/libp2p-noise'
import type { PeerId } from '@libp2p/interface-peer-id'
import { mplex } from '@libp2p/mplex'
import { webRTCStar } from '@libp2p/webrtc-star'
import { webSockets } from '@libp2p/websockets'
import type { Libp2p } from 'libp2p'
import { createLibp2p } from 'libp2p'
import { createEffect, createMemo, createSignal } from 'solid-js'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'

export const defaultTopic = 'news'

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

export const [myPeer, setMyPeer] = createSignal<Libp2p>()
export const [bob, setBob] = createSignal<Libp2p>()

export const isPeerReady = createMemo(() => Boolean(myPeer()))

createEffect(() => {
  if (myPeer() && bob()) {
    console.log('alice and bob are loaded')
    console.log(myPeer())
    myPeer()?.pubsub.subscribe(defaultTopic)
    bob()?.pubsub.subscribe(defaultTopic)
    myPeer()?.pubsub.addEventListener('message', (evt) => {
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

  setMyPeer(alice)
  setBob(bob)
}

// a trick to only run in the browser
createEffect(() => initPeers())

interface Message {
  peer?: Libp2p
  topic?: typeof defaultTopic
  message: string
}

export const sendMessage = ({
  peer = myPeer(),
  topic = defaultTopic,
  message,
}: Message) => {
  if (peer) {
    peer.pubsub.publish(topic, uint8ArrayFromString(message))
  }
}

export const Dial = async (
  peerId: PeerId,
  multiaddr: ReturnType<Libp2p['getMultiaddrs']>,
) => {
  if (myPeer()) {
    // add target to the peerStore and then Dial
    await myPeer()!.peerStore.addressBook.set(peerId, multiaddr)
    await myPeer()!.dial(peerId)

    // subscribes target to the topic.
    // in the near future this will be removed
    // when I use another computer to test the other end
    //target.pubsub.subscribe(defaultTopic)

    // subscribe to messages sent to me
    myPeer()?.pubsub.addEventListener('message', (evt) => {
      console.log(
        `alice received: ${uint8ArrayToString(evt.detail.data)} on topic ${
          evt.detail.topic
        }`,
      )
    })

    // subscribe to messages sent to target. Will be removed in the future
    //target.pubsub.addEventListener('message', (evt) => {
    //console.log(
    //`bob received: ${uint8ArrayToString(evt.detail.data)} on topic ${
    //evt.detail.topic
    //}`,
    //)
    //})
  }
}
