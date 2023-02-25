import { multiaddr as createMultiAddr } from '@multiformats/multiaddr'
import type { Libp2p } from 'libp2p'

import {
  ParentComponent,
  createContext,
  createEffect,
  useContext,
} from 'solid-js'
import { createStore } from 'solid-js/store'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'

import { createNode } from '~/lib'
import type { Message, SendMessage } from '~/lib'

export type ContextState = {
  messages: Message[]
  myPeer: Libp2p | undefined
}

export type ContextValue = [
  state: ContextState,
  actions: {
    createNode: () => Promise<Libp2p> | undefined
    sendMessage: (args: SendMessage) => Promise<void> | undefined
    dial: (peerId: string, topic: string) => Promise<void> | undefined
  },
]

const defaultState = {
  messages: [],
  myPeer: undefined,
}

export const LibP2PContext = createContext<ContextValue>([
  defaultState,
  {
    createNode: () => undefined,
    sendMessage: () => undefined,
    dial: () => undefined,
  },
])

export const LibP2PProvider: ParentComponent = (props) => {
  const [state, setState] = createStore<ContextState>({
    messages: [],
    myPeer: undefined,
  })

  const sendMessage = async ({
    peer = state?.myPeer,
    topic,
    message,
    callback,
  }: SendMessage) => {
    if (peer) {
      setState('messages', (messages) => [
        ...messages,
        {
          from: 'me',
          value: message,
          timestamp: Date.now(),
        },
      ])
      await peer.pubsub.publish(topic, uint8ArrayFromString(message))
      if (callback) callback()
    }
  }

  const dial = async (peerId: string, topic: string) => {
    if (state?.myPeer) {
      const multiAddr = createMultiAddr(
        [
          '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/',
          `wss/p2p-webrtc-star/p2p/${peerId}`,
        ].join(''),
      )
      state?.myPeer.pubsub.subscribe(topic)
      state?.myPeer.pubsub.addEventListener('message', (e) => {
        setState('messages', (messages) => [
          ...messages,
          {
            from: peerId,
            value: uint8ArrayToString(e.detail.data),
            timestamp: Date.now(),
          },
        ])
      })
      // not working (yet) but it needs to be here
      state?.myPeer.handle('/chat/1.0.0', async () => {
        console.log('received msg on /chat/')
      })
      await state?.myPeer.dialProtocol(multiAddr, '/chat/1.0.0')
      console.log('dialed with success')
    }
  }

  createEffect(() => {
    createNode().then((node) => setState('myPeer', node))
  })

  return (
    <LibP2PContext.Provider value={[state, { createNode, sendMessage, dial }]}>
      {props.children}
    </LibP2PContext.Provider>
  )
}

export const useLibP2P = () => useContext(LibP2PContext)
