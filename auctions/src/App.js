import React  from 'react'
import {AuthProvider} from './context/AuthContext'
import {NavComp} from './components/authentication/NavComp'
import {AuctionBody} from './components/auctions/Body'
import { StateContextProvider } from './context/ContractContext'
import './App.css'

function App() {
  return (
      <div className="App">
        <AuthProvider>
          <StateContextProvider>
          <NavComp />
          <AuctionBody />
          </StateContextProvider>
        </AuthProvider>
      </div>
    
  )
}

export default App