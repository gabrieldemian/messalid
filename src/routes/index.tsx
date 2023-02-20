import { createSignal } from 'solid-js'

import { Button, Card } from '~/components'
import { bob, isPeerReady, myPeer, sendMessage } from '~/lib'

export default function Home() {
  const [msg, setMsg] = createSignal<string>('')

  const handleSendMessage = async () => {
    if (myPeer() && bob() && msg()) {
      sendMessage({ message: msg()! })
    }
  }

  return (
    <main class="p-4 mx-auto text-center text-gray-700">
      <Card>
        <p>Card aaa</p>
      </Card>
      <Card variant="filled">I am a card!!!</Card>
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
    </main>
  )
}
