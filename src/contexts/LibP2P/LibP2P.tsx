import { createContext } from 'solid-js'
import { createStore } from 'solid-js/store'

export const LibP2PContext = createContext([], {})

export function LibP2PProvider(props) {
  const [state, setState] createStore()

  const value = []

  return (
    <LibP2PContext.Provider value={value}>
      {props.children}
    </LibP2PContext.Provider>
  )
}
