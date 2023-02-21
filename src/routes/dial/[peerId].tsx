import { createEffect, createSignal } from 'solid-js'
import { useParams } from 'solid-start'

import { Button } from '~/components'

import { dial, isPeerReady, myPeer, sendMessage } from '~/lib'

export default function Chat() {
  const params = useParams()
  const [msg, setMsg] = createSignal<string>('')

  const handleSendMessage = async () => {
    if (myPeer() && msg()) {
      sendMessage({ message: msg()! })
    }
  }

  createEffect(() => {
    dial(params.peerId)
  })

  return (
    <main class="p-4 mx-auto text-center">
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
    </main>
  )
}
