import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Kurukshetra from './components/SudarshanChakra_Game' 
import CarGame from './components/Cargame'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>


      {/* <Kurukshetra></Kurukshetra>    */}
      <CarGame></CarGame>
    
      </>
  )
}

export default App
