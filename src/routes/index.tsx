import { createSignal } from 'solid-js'

import { Button, Card } from '~/components'
import { alice, bob, sendMessage, topic } from '~/lib'

export default function Home() {
  const [msg, setMsg] = createSignal('')

  const handleSendMessage = async () => {
    if (alice() && bob()) {
      sendMessage(bob()!, topic, msg())
    }
  }

  return (
    <main class="p-4 mx-auto text-center text-gray-700">
      <p class="text-pink">this will be in pink</p>
      <Card>
        <p>Card aaa</p>
      </Card>
      <Card variant="filled" isFluid>
        I am a card!!!
      </Card>
      <input
        value={msg()}
        onKeyUp={(e: any) => setMsg(e.target.value)}
        placeholder="Type your message..."
      />
      <Button onClick={handleSendMessage}>Send</Button>
    </main>
  )
}
