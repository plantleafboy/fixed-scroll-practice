import { useState, useEffect } from 'react'

import LenisProvider from './components/LenisProvider';
import Content from './components/Content';
import './App.css'

function App() {

  const lpCheck = document.getElementsByTagName("LenisProvider");

  useEffect(() => {
    console.log(lpCheck);
  });


  return (
    <LenisProvider>
      <Content/>

    </LenisProvider>
  )
}

export default App
