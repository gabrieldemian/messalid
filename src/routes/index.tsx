import { A } from '@solidjs/router'
import { createSignal } from 'solid-js'

import { Button } from '~/components'
import { isPeerReady, myPeer, sendMessage } from '~/lib'

export default function Home() {
  const [msg, setMsg] = createSignal<string>('')

  const handleSendMessage = async () => {
    if (myPeer() && msg()) {
      sendMessage({ message: msg()! })
    }
  }

  // todo: screen with 2 options:
  // 1 - create a room with a topic -> go to chat
  // 2 - paste peerid and topic -> go to chat

  return (
    <main class="text-center">
      <input
        value={msg()}
        onKeyUp={(e: any) => setMsg(e.target.value)}
        placeholder="Type your message..."
      />
      <Button
        isDisabled={() => !isPeerReady() || !msg()}
        onClick={handleSendMessage}
      >
        Send
      </Button>
      <p>{isPeerReady() ? 'peer is ready' : 'Loading...'}</p>
      <A href={`/dial/${myPeer()?.peerId.toString()}/nadaagui`}>Chat</A>
    </main>
  )
}
