import { useEffect, useState } from 'react';
import { firestoreApp } from '../config/firebase';
import { getDocs, collection  } from 'firebase/firestore';

export const useFirestore =  (coll) => {
  const [docs, setDocs] = useState([]);

  useEffect(() => {

    const fetchDocuments = async () => {
      try {
        let documents = [];
        const querySnapshot = await getDocs(collection(firestoreApp, coll));
        querySnapshot.forEach((doc) => {
          documents.push({ id: doc.id, ...doc.data() });
        });
        setDocs(documents);
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    };

    fetchDocuments();
  }, [coll]);

  return { docs};
};
