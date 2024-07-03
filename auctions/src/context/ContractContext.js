import { createContext, useContext} from 'react';
import { useAddress, useContract, useContractWrite } from '@thirdweb-dev/react';



const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract('0xD7AB7554653DDD322b3596194aC4D77962036089');
  const { mutateAsync: addAuction } = useContractWrite(contract, 'addAuction');

  const address = useAddress();

  const createAuctionContract = async (id, name, desc, bid) => {
    try{
        await addAuction({args:[id,name,desc,bid]})
    }catch(error){
        console.log(error)
    }
  }

  const endAuctionContract = async (id) => {
    try {
        await contract.call('endAuction',[id])
        console.log("success")
    } catch (error) {
        console.log(error)
    }
  }

  const placebidContract = async (id, bid) => {
    try {
        await contract.call('placeBid',[id,bid])
        console.log("success")
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <StateContext.Provider
      value={{ 
        address,
        contract,
        createAuctionContract,
        endAuctionContract,
        placebidContract
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext)