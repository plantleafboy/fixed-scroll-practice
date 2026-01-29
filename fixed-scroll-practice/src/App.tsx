import { useState, useEffect } from 'react'

import LenisProvider from './components/LenisProvider';
import Content from './components/Content';
import './App.css'


function App() {

  useEffect(() => {
    const isLenisClassPresent = document.documentElement.classList.contains('lenis'); // X - checking by react component DNE as HTML tag 
    console.log('Smooth scroll active on <html> tag:', isLenisClassPresent);
  });


  return (
    <LenisProvider>
      <Content/>

    </LenisProvider>
  )
}

export default App
