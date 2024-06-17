import React, { useContext, useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import { AuctionCard } from './AuctionCard';
import { CreateAuction } from './CreateAuction'
import UploadProgress from './UploadProgress';
import { getDocs, collection } from 'firebase/firestore';
import { firestoreApp } from '../../config/firebase';
import { UserDetails } from './UserDetails';




export const AuctionBody = () => {
  const [progress, setProgress] = useState(0);
  const { currentUser, globalMsg, getRole } = useContext(AuthContext);
  const [auctionDocs, setAuctionDocs] = useState([]);

  const fetchDocs = async () => {
    try {
      let documents = [];
      const querySnapshot = await getDocs(collection(firestoreApp, 'auctions'));
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      setAuctionDocs(documents);
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  };

  useEffect(() => {
    fetchDocs();

    const intervalId = setInterval(fetchDocs, 60000); // fetch every 10 seconds

    return () => clearInterval(intervalId); // cleanup on unmount
  }, []);

  return (
    <div className="py-5">
      <div className="container">
        {progress > 0 && <UploadProgress progress={progress} />}

        {globalMsg && <Alert variant="info">{globalMsg}</Alert>}

        {getRole === 'Admin' && currentUser && <CreateAuction setProgress={setProgress}/>}

        {getRole === 'Admin' && currentUser && <UserDetails />}

        {auctionDocs && (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {auctionDocs.map((doc) => {
              return <AuctionCard item={doc} key={doc.id} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
};
