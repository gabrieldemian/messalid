import { createSignal } from 'solid-js'

import { Button, Card } from '~/components'
import { isPeerReady, myPeer } from '~/lib'

export default function Home() {
  const [peerId, setPeerId] = createSignal<string>('')
  const [topic, setTopic] = createSignal<string>('')

  return (
    <main class="container flex justify-center h-full">
      <Card class="flex flex-col gap-10 m-auto w-full max-w-[450px]">
        <div class="flex flex-col gap-3">
          <h1 class="text-2xl">Create Room</h1>
          <h2 class="text-xl">Topic</h2>
          <input
            class="w-full"
            value={topic()}
            onKeyUp={(e: any) => setTopic(e.target.value)}
            placeholder="i.e: Cat breeds"
          />
          <Button
            isFluid
            isLoading={() => !isPeerReady()}
            isDisabled={() => !topic() || !isPeerReady()}
            href={`/dial/${topic()}/${myPeer()?.peerId}`}
          >
            Create
          </Button>
        </div>
        <div class="flex flex-col gap-3">
          <h1 class="text-2xl">Join Room</h1>
          <h2 class="text-xl">PeerID</h2>
          <input
            class="w-full"
            value={peerId()}
            onKeyUp={(e: any) => setPeerId(e.target.value)}
            placeholder="PeerId of your friend"
          />
          <Button
            isFluid
            isLoading={() => !isPeerReady()}
            isDisabled={() => !peerId() || !topic()}
            href={`/dial/${topic()}/${peerId()}`}
          >
            Join
          </Button>
        </div>
      </Card>
    </main>
  )
}
