import { useState } from 'react'

import LenisProvider from './components/LenisProvider';
import Content from './components/Content';
import './App.css'

function App() {

  return (
    <LenisProvider>
      <Content/>

    </LenisProvider>
  )
}

export default App
