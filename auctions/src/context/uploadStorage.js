import { firestoreApp, storageApp } from '../config/firebase';
import { serverTimestamp, collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';


const UploadStorage = (data, setProgress, auctionContract) => {
    const data_r = data;
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
                const imgUrl = await getDownloadURL(uploadTask.snapshot.ref)
                delete data_r.itemImage;
                const dockref = await addDoc(collectionRef, { ...data_r, createdAt:serverTimestamp(), imgUrl });
                await auctionContract(dockref.id,data.title,data.desc,data.curPrice)
                window.location.reload();
            }catch (error) {
                console.error('Error uploading data: ', error);
                alert('Error uploading data');
        }
        }
    );
};

export default UploadStorage;
