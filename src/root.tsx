// @refresh reload
import { Suspense } from 'solid-js'
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from 'solid-start'

import './assets/main.css'
import { LibP2PProvider } from './contexts'

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>Messalid</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>
        <LibP2PProvider>
          <Suspense>
            <ErrorBoundary>
              <Routes>
                <FileRoutes />
              </Routes>
            </ErrorBoundary>
          </Suspense>
        </LibP2PProvider>
        <Scripts />
      </Body>
    </Html>
  )
}
