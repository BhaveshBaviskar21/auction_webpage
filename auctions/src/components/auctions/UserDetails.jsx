import { Button, Form, Modal, Alert, Row, Col } from 'react-bootstrap';
import React, { useContext, useRef, useState, useEffect } from 'react';
import { getDocs,getDoc, doc, collection , updateDoc, Timestamp, query, where} from 'firebase/firestore';
import { firestoreApp } from '../../config/firebase';

export const UserDetails = () => {

    const [showForm, setShowForm] = useState(false);
    const [dForm, setdForm] = useState(false);
    const [UserData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const [auctionDocs, setAuctionDocs] = useState([])
    const currentTimestamp = Timestamp.now().toMillis()

    const openForm = () => setShowForm(true);
    const closeForm = () => setShowForm(false);
    const detailsForm = async (id) => {
        const usersSnapshot = await getDocs(collection(firestoreApp, 'user'));
        for (const userDoc of usersSnapshot.docs) {
            const userId = userDoc.id;
            const cartDocRef = doc(firestoreApp, 'user', userId, 'cart', id);
            const cartDoc = await getDoc(cartDocRef);
            if (cartDoc.exists()) {
                setUserData(cartDoc.data());
                break;
            }
        }
        setdForm(true);
    }
    const closedetailsForm = () => setdForm(false);


    const fetchDocs = async () =>{
        const df = query(collection(firestoreApp,'auctions'), where('duration', '<=', currentTimestamp))
        const data = await getDocs(df)
        let documents = []
        data.forEach((docs)=>{
            if(docs.data().paymentCompleted){
                documents.push({id: docs.id, ...docs.data()})
            }else{
                documents.push({id: docs.id, ...docs.data(), paymentCompleted:'false'})
            }
        })
        setAuctionDocs(documents)
    }

    fetchDocs()

    const submitForm = async (e) => {
        e.preventDefault();
        setError('');
        try{
            closeForm();
        }catch (error){
            setError('Invalid Information');
        }
    }

    return (
        <>
            <div className="col d-flex justify-content-center my-3">
                <div onClick={openForm} className="btn btn-outline-secondary mx-2">
                Payment Status
                </div>
            </div>
            <Modal centered show={showForm} onHide={closeForm}>
                <form onSubmit={submitForm}>
                    <Modal.Header>
                        <Modal.Title>Payment</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Title</Form.Label>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Amount</Form.Label>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Status</Form.Label>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label></Form.Label>
                                </Form.Group>
                            </Col>
                        </Row>
                        {auctionDocs && auctionDocs.map((doc)=>{
                            if(doc.id){
                                return(
                                <Row  key={doc.id}>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{doc.title}</Form.Label>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{doc.curPrice}</Form.Label>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>

                                            {doc.paymentCompleted == 'true' ? (
                                                <Form.Label>Done</Form.Label>
                                            ) : (
                                                <Form.Label>Pending</Form.Label>
                                            )
                                            }
                                                
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        {doc.paymentCompleted == 'true' ? (
                                                <Button size="sm" variant="outline-primary" onClick={() => detailsForm(doc.id)}>
                                                    Details
                                                </Button>
                                            ) : (
                                                <Form.Label>Pending</Form.Label>
                                            )
                                        }
                                        
                                    </Col>
                                </Row>
                                )
                            }
                            })
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeForm}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
            <Modal centered show={dForm} onHide={closedetailsForm}>
                <form onSubmit={submitForm}>
                    <Modal.Header>
                        <Modal.Title>Payment</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>First name</Form.Label>
                                    {UserData && <Form.Control type="text" value={UserData.firstname} readOnly />}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Last name</Form.Label>
                                    {UserData && <Form.Control type="text" value={UserData.lastname} readOnly />}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Email</Form.Label>
                                    {UserData && <Form.Control type="text" value={UserData.email} readOnly />}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Address</Form.Label>
                                    {UserData && <Form.Control type="text" value={UserData.address} readOnly />}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Town/City</Form.Label>
                                    {UserData && <Form.Control type="text" value={UserData.town} readOnly />}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Country</Form.Label>
                                    {UserData && <Form.Control type="text" value={UserData.country} readOnly />}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Postal Code</Form.Label>
                                    {UserData && <Form.Control type="text" value={UserData.postalCode} readOnly />}
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closedetailsForm}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    );
}