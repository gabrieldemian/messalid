import { For, createEffect, createSignal } from 'solid-js'
import { A, useParams } from 'solid-start'

import { Button, Card, Loading } from '~/components'
import { useLibP2P } from '~/contexts'

export default function Chat() {
  const params = useParams()
  const [msg, setMsg] = createSignal<string>('')

  const [libp2p, { sendMessage, dial }] = useLibP2P()

  createEffect(() => {
    dial(params.peerId, params.topic)
  })

  const handleSendMessage = (e: any) => {
    e.preventDefault()

    if (libp2p.myPeer && msg()) {
      sendMessage({
        message: msg()!,
        topic: params.topic,
        callback: () => setMsg(''),
      })
    }
  }

  return (
    <main class="container pt-2 pb-32 mx-auto h-full sm:pb-20 max-w-[450px]">
      <div class="w-full h-full">
        <A href="/" class="mb-3">
          {'<-'} Go Back
        </A>
        {/* eslint-disable-next-line */}
        <div class="flex overflow-y-auto flex-col gap-3 h-[inherit] pb-5 px-3 pt-3">
          <For each={libp2p.messages} fallback={<Loading />}>
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
          autofocus
          class="w-full"
          value={msg()}
          onKeyUp={(e: any) => setMsg(e.target.value)}
          placeholder="Type your message..."
        />
        <Button
          type="submit"
          class="w-full sm:w-[auto]"
          isDisabled={() => !libp2p.myPeer || !msg()}
          onClick={handleSendMessage}
        >
          Send
        </Button>
      </form>
    </main>
  )
}
