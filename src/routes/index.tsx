import { Button, Card } from '~/components'

export default function Home() {
  return (
    <main class="p-4 mx-auto text-center text-gray-700">
      <p class="text-pink">this will be in pink</p>
      <Card>
        <p>Card aaa</p>
      </Card>
      <Card variant="filled" isFluid>
        I am a card!!!
      </Card>
      <Button>I am a humble button</Button>
      <Button variant="outlined">I am a humble button</Button>
    </main>
  )
}
