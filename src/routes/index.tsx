import { createSignal } from 'solid-js'

import { Button, Card } from '~/components'
import { useLibP2P } from '~/contexts'

export default function Home() {
  const [libp2p] = useLibP2P()
  const [peerId, setPeerId] = createSignal<string>('')
  const [topic, setTopic] = createSignal<string>('')

  return (
    <main class="container flex justify-center h-full">
      <Card class="flex flex-col m-auto w-full gap-3 max-w-[450px]">
        <h1 class="text-2xl m-0">Messalid</h1>
        <p class="text-slate-500">
          To create a room, you only need a topic. To join a room, you need a
          topic and also the PeerID of the person you want to talk to.
        </p>
        <p>
          Your PeerID is: {libp2p?.myPeer?.peerId.toString() || 'loading...'}
        </p>
        <div class="flex flex-col gap-3">
          <div class="flex flex-col gap-3">
            <h1 class="text-xl">Topic</h1>
            <input
              class="w-full bg-crust"
              value={topic()}
              onKeyUp={(e: any) => setTopic(e.target.value)}
              placeholder="i.e: Cat breeds"
            />
          </div>
          <div class="flex flex-col gap-3">
            <h1 class="text-xl">PeerID</h1>
            <input
              class="w-full bg-crust"
              value={peerId()}
              onKeyUp={(e: any) => setPeerId(e.target.value)}
              placeholder="PeerId of your friend"
            />
          </div>
          <div class="flex flex-col gap-3 mt-3">
            <Button
              isFluid
              isLoading={() => !libp2p.myPeer}
              isDisabled={() => !topic() || !libp2p.myPeer}
              href={`/dial/${topic()}/${libp2p.myPeer?.peerId}`}
            >
              Create Room
            </Button>
            <Button
              isFluid
              isLoading={() => !libp2p.myPeer}
              isDisabled={() => !peerId() || !topic()}
              href={`/dial/${topic()}/${peerId()}`}
            >
              Join Room
            </Button>
          </div>
        </div>
      </Card>
    </main>
  )
}
