import { createContext, useEffect, useState } from 'react';
import { authApp, firestoreApp } from '../config/firebase';
import { collection, doc, updateDoc, deleteDoc, getDoc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword , signInWithEmailAndPassword, signOut, onAuthStateChanged} from 'firebase/auth';

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [globalMsg, setGlobalMsg] = useState('');
  const [ getRole , setRole] = useState(null);

  const register = (email, password) => {
    return createUserWithEmailAndPassword(authApp,email, password);
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(authApp, email, password);
  };

  const logout = () => {
    return signOut(authApp);
  };

  const bidAuction = (auctionId, price) => {
    if (!currentUser) {
      return setGlobalMsg('Please login first');
    }

    const db = collection(firestoreApp,'auctions');

    return updateDoc(doc(db,auctionId),{
      curPrice: price,
      curWinner: currentUser.email,
      curWinnerUid: currentUser.uid,
    });
  };

  const endAuction = (auctionId) => {
    const db = collection(firestoreApp,'auctions');

    return deleteDoc(doc(db,auctionId));
  };

  const addToCart = async (auctionId) => {
    const db = collection(firestoreApp,'user', currentUser.uid ,'cart')
    const cartState = await getDoc(doc(db,auctionId))
    if(!cartState.exists()){
      return setDoc(doc(db,auctionId),{paymentCompleted : 'false'})
    }
  }
  
  const removeFromCart = (auctionId) => {
    const db = collection(firestoreApp,'user', currentUser.uid ,'cart')
    return deleteDoc(doc(db,auctionId))
  }

  

  useEffect(() => {
    const subscribe = onAuthStateChanged(authApp, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return subscribe;
  }, []);

  useEffect(() => {
    onAuthStateChanged(authApp,async (user) => {
      if (user) {
        if (user.uid === "V5InpFeRSZgyd8eCXfxwxjvu9jo2"){
          setRole('Admin');
        } else {
          setRole(null);
        }
      //  const docref = doc(firestoreApp,"user",user.uid)
      
      //  const userDoc = await getDoc(docref);
      //  if (userDoc.exists() && userDoc.data().role) {
   //       setRole('Admin');
    //    } else {
    //    setRole(null);
    //    }
      }
    });
  })

  useEffect(() => {
    const interval = setTimeout(() => setGlobalMsg(''), 5000);
    return () => clearTimeout(interval);
  }, [globalMsg]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        register,
        login,
        logout,
        bidAuction,
        endAuction,
        globalMsg,
        getRole,
        addToCart,
        removeFromCart,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
