import { Button, Form, Modal, Alert, Row, Col } from 'react-bootstrap';
import React, { useContext, useRef, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getDocs,getDoc, doc, collection , updateDoc} from 'firebase/firestore';
import { firestoreApp } from '../../config/firebase';

export const PaymentRequests = () => {

    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState('');
    const [auctionDocs, setAuctionDocs] = useState([])
    const { currentUser, removeFromCart } = useContext(AuthContext);
    const [totalAmt, settotalAmt] = useState(0)


    async function fetchDocs() {
    const querySnapshot = await getDocs(collection(firestoreApp, 'user', currentUser.uid, 'cart'));
    let documents = []
    let total = 0
    querySnapshot.forEach(async (docs) => {
        if(docs.data().paymentCompleted == 'false'){
            const docInfo = await getDoc(doc(firestoreApp, 'user', currentUser.uid, 'winAuctions', docs.id))
            documents.push({ id: docs.id, ...docInfo.data() });
            total += docInfo.data().curPrice
            settotalAmt(total)
        }
        
    });
    setAuctionDocs(documents);
    }

    const firstname = useRef();
    const lastname = useRef();
    const email = useRef();
    const address = useRef();
    const town = useRef();
    const country = useRef();
    const postalCode = useRef();

    const openForm = () => setShowForm(true);
    const closeForm = () => setShowForm(false);

    const removeItem = async (id) => {
        await removeFromCart(id);
        window.location.reload();
    }

    const submitForm = async (e) => {
        e.preventDefault();
        setError('');

        let newInfo= {
            firstname: firstname.current.value,
            lastname: lastname.current.value,
            email: email.current.value,
            address: address.current.value,
            town: town.current.value,
            country: country.current.value,
            postalCode: postalCode.current.value,
        };

        try {
            auctionDocs.map(async (docs)=>{
                await updateDoc(doc(firestoreApp, 'user', currentUser.uid, 'cart', docs.id),{...newInfo,paymentCompleted:'true',amt:docs.curPrice})
                await updateDoc(doc(firestoreApp, 'auctions',docs.id),{paymentCompleted:'true'})
            })
            closeForm();
            window.location.reload()
        } catch (error) {
            setError('Invalid Information');
        }
    };

    useEffect(()=>{
        fetchDocs()
    }, [])
    

    return (
        <>
            <div onClick={openForm} className="btn btn-outline-secondary mx-2">
                Payment
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
                                    <Form.Label>First name</Form.Label>
                                    <Form.Control type="text" required ref={firstname} />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Last name</Form.Label>
                                    <Form.Control type="text" required ref={lastname} />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="text" required ref={email} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control type="text" required ref={address} />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Town/City</Form.Label>
                                    <Form.Control type="text" required ref={town} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Country</Form.Label>
                                    <Form.Control type="text" required ref={country} />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Postal Code</Form.Label>
                                    <Form.Control type="text" required ref={postalCode} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label></Form.Label>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label></Form.Label>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Item</Form.Label>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Price</Form.Label>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label></Form.Label>
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
                                        <Form.Group className="d-flex align-items-center">
                                            <Button size="sm" variant="outline-primary" onClick={() => removeItem(doc.id)}>Remove</Button>
                                            <Form.Label className="me-2">{doc.title}</Form.Label>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{doc.curPrice}</Form.Label>
                                        </Form.Group>
                                    </Col>
                                </Row>)
                            }
                            
                        })}
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label></Form.Label>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label></Form.Label>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Total</Form.Label>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    {totalAmt && < Form.Label>{totalAmt} </Form.Label>}
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeForm}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" id="submitButton">
                            Confirm
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    );
}