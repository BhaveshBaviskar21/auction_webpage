import React  from 'react'
import {AuthProvider} from './context/AuthContext'
import {NavComp} from './components/authentication/NavComp'
import {AuctionBody} from './components/auctions/Body'
import './App.css'

function App() {
  return (
      <div className="App">
        <AuthProvider>
          <NavComp />
          <AuctionBody />
        </AuthProvider>
      </div>
    
  )
}

export default App
