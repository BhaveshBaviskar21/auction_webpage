import { useState, useEffect } from 'react';
import { firestoreApp, storageApp } from '../config/firebase';
import { serverTimestamp, collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const useStorage = (data) => {
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const data_r = data;

  useEffect(() => {
    const storageRef = ref(storageApp, data.itemImage.name);
    const collectionRef = collection(firestoreApp, 'auctions');
    const uploadTask = uploadBytesResumable(storageRef, data.itemImage);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(percentage);
      },
      (err) => {
        console.log(err);
      },
      async () => {
        try {
          if(!isCompleted){
            const imgUrl = await getDownloadURL(uploadTask.snapshot.ref)
            delete data_r.itemImage;
            await addDoc(collectionRef, { ...data_r, createdAt:serverTimestamp(), imgUrl });
            setIsCompleted(true);
            console.log("t2")
          }
          else{
            console.log("t2.1")
          }
        }catch (error) {
          console.error('Error uploading data: ', error);
          alert('Error uploading data');
        }
      }
    );
  }, [data]);  // Only run the effect once when data changes

  return { progress, isCompleted};
};

export default useStorage;
