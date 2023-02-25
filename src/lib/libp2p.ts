import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { noise } from '@chainsafe/libp2p-noise'
import { mplex } from '@libp2p/mplex'
import { webRTCStar } from '@libp2p/webrtc-star'
import { webSockets } from '@libp2p/websockets'
import type { Libp2p } from 'libp2p'
import { createLibp2p } from 'libp2p'

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

export interface SendMessage {
  peer?: Libp2p
  callback?: () => void
  topic: string
  message: string
}
