import { For, createEffect, createSignal } from 'solid-js'
import { A, useParams } from 'solid-start'

import { Button, Card, Loading } from '~/components'

import {
  dial,
  initPeers,
  isPeerReady,
  messages,
  myPeer,
  sendMessage,
} from '~/lib'

export default function Chat() {
  const params = useParams()
  const [msg, setMsg] = createSignal<string>('')

  const handleSendMessage = (e: any) => {
    e.preventDefault()
    if (myPeer() && msg()) {
      sendMessage({
        message: msg()!,
        topic: params.topic,
        callback: () => setMsg(''),
      })
    }
  }

  createEffect(() => {
    if (!myPeer()) {
      initPeers()
    }
    dial(params.peerId, params.topic)
  })

  return (
    <main class="container pt-2 pb-32 mx-auto h-full sm:pb-20 max-w-[450px]">
      <div class="w-full h-full">
        <A href="/" class="mb-3">
          {'<-'} Go Back
        </A>
        <div class="flex overflow-y-auto flex-col gap-3 h-[inherit]">
          <For each={messages()} fallback={<Loading />}>
            {({ from, value, timestamp }) => (
              <Card
                variant={from === 'me' ? 'filled' : 'base'}
                class={`${
                  from === 'me' ? 'ml-auto text-right' : ''
                } flex flex-col`}
              >
                <small class="">
                  {from === 'me' ? from : from.slice(0, 7).concat('...')}
                </small>
                <p class="font-bolder">{value}</p>
                <time class="text-xs text-gray-300">
                  {new Date(timestamp).toLocaleTimeString()}
                </time>
              </Card>
            )}
          </For>
        </div>
      </div>
      <form
        onSubmit={handleSendMessage}
        class="flex flex-col gap-3 pt-5 w-full sm:flex-row"
      >
        <input
          class="w-full"
          value={msg()}
          onKeyUp={(e: any) => setMsg(e.target.value)}
          placeholder="Type your message..."
        />
        <Button
          type="submit"
          class="w-full sm:w-[auto]"
          isDisabled={() => !isPeerReady() || !msg()}
          onClick={handleSendMessage}
        >
          Send
        </Button>
      </form>
    </main>
  )
}
