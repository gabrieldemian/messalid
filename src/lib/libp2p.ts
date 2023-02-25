import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { noise } from '@chainsafe/libp2p-noise'
import { mplex } from '@libp2p/mplex'
import { webRTCStar } from '@libp2p/webrtc-star'
import { webSockets } from '@libp2p/websockets'
import { multiaddr as createMultiAddr } from '@multiformats/multiaddr'
import type { Libp2p } from 'libp2p'
import { createLibp2p } from 'libp2p'
import { createMemo, createSignal } from 'solid-js'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'

// create a Peer/Node on the network
export const createNode = async () => {
  const wrtcStar = webRTCStar()
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

export interface Message {
  from: string
  value: string
  timestamp: number
}

export const [messages, setMessages] = createSignal<Message[]>([])
export const [myPeer, setMyPeer] = createSignal<Libp2p>()

export const isPeerReady = createMemo(() => Boolean(myPeer()))

export const initPeers = async () => {
  const peer = await createNode()
  setMyPeer(peer)
  console.log('peerId: ', peer.peerId.toString())
}

interface SendMessage {
  peer?: Libp2p
  callback?: () => void
  topic: string
  message: string
}

export const sendMessage = async ({
  peer = myPeer(),
  topic,
  message,
  callback,
}: SendMessage) => {
  if (peer) {
    setMessages((messages) => [
      ...messages,
      { from: 'me', value: message, timestamp: Date.now() },
    ])
    await peer.pubsub.publish(topic, uint8ArrayFromString(message))
    if (callback) callback()
  }
}

export const dial = async (peerId: string, topic: string) => {
  if (myPeer()) {
    const multiAddr = createMultiAddr(
      [
        '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/',
        `wss/p2p-webrtc-star/p2p/${peerId}`,
      ].join(''),
    )
    myPeer()?.pubsub.subscribe(topic)
    myPeer()?.pubsub.addEventListener('message', (e) => {
      setMessages((messages) => [
        ...messages,
        {
          timestamp: e.timeStamp,
          value: uint8ArrayToString(e.detail.data),
          from: peerId,
        },
      ])
    })
    // not working (yet) but it needs to be here
    myPeer()?.handle('/chat/1.0.0', async () => {
      console.log('received msg on /chat/')
    })
    await myPeer()!.dialProtocol(multiAddr, '/chat/1.0.0')
    console.log('dialed with success')
  }
}
