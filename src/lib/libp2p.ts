import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { noise } from '@chainsafe/libp2p-noise'
import { mplex } from '@libp2p/mplex'
import { webRTCStar } from '@libp2p/webrtc-star'
import { webSockets } from '@libp2p/websockets'
import { multiaddr as createMultiAddr } from '@multiformats/multiaddr'
import type { Libp2p } from 'libp2p'
import { createLibp2p } from 'libp2p'
import { createEffect, createMemo, createSignal } from 'solid-js'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'

import { streamToString } from './decoders'

export const defaultTopic = 'messalid'

const wrtcStar = webRTCStar()

// create a Peer/Node on the network
export const createNode = async () => {
  const node = await createLibp2p({
    addresses: {
      listen: [
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

export const isPeerReady = createMemo(() => Boolean(myPeer()))

createEffect(() => {
  if (myPeer()) {
    myPeer()?.pubsub.subscribe(defaultTopic)
    myPeer()?.pubsub.addEventListener('message', (e) => {
      console.log(
        `Received: ${uint8ArrayToString(e.detail.data)} on topic ${
          e.detail.topic
        } when ${new Date(e.timeStamp).toLocaleTimeString()}`,
      )
    })
    //myPeer()?.addEventListener('peer:connect', (e) => {
    //const connection = e.detail
    //console.log('connected to: ', connection.remotePeer.toString())
    //console.log('on my list ', myPeer()?.getPeers())
    //})
    myPeer()?.handle('/chat/1.0.0', async ({ stream }) => {
      console.log('received msg on /chat/')
      const msg = await streamToString(stream)
      console.log('Received msg from /chat/: ', msg)
    })
  }
})

export const initPeers = async () => {
  const myPeer = await createNode()
  console.log('peerId: ', myPeer.peerId.toString())
  setMyPeer(myPeer)
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

export const dial = async (peerId: string) => {
  if (myPeer()) {
    const multiAddr = createMultiAddr(
      [
        '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/',
        `wss/p2p-webrtc-star/p2p/${peerId}`,
      ].join(''),
    )
    await myPeer()!.dialProtocol(multiAddr, '/chat/1.0.0')
    console.log('dialed with success')
  }
}
