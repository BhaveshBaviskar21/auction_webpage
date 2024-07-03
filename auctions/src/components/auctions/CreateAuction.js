import { Button, Form, Modal, Alert, Row, Col } from 'react-bootstrap';
import React, { useContext, useRef, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import UploadStorage from '../../context/UploadStorage';
import { useStateContext } from '../../context/ContractContext';


export const CreateAuction = ({setProgress}) => {

    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState('');

    const itemTitle = useRef();
    const itemDesc = useRef();
    const startPrice = useRef();
    const itemDuration = useRef();
    const itemImage = useRef();

    const { currentUser } = useContext(AuthContext);
    const { createAuctionContract } = useStateContext();

    const imgTypes = ['image/png', 'image/jpeg', 'image/jpg'];

    const openForm = () => setShowForm(true);
    const closeForm = () => setShowForm(false);

    const submitForm = async (e) => {
        e.preventDefault();
        setError('');

        if (!imgTypes.includes(itemImage.current.files[0].type)) {
            return setError('Please use a valid image');
        }
    
        let currentDate = new Date();
        let dueDate = currentDate.setHours(
            currentDate.getHours() + parseInt(itemDuration.current.value)
        );
    
        let newAuction = {
            email: currentUser.email,
            title: itemTitle.current.value,
            desc: itemDesc.current.value,
            curPrice: parseFloat(startPrice.current.value),
            duration: dueDate,
            itemImage: itemImage.current.files[0],
        };
        
        UploadStorage(newAuction, setProgress, createAuctionContract);
        closeForm();
    }   

    return (
        <>
            <div className="col d-flex justify-content-center my-3">
                <div onClick={openForm} className="btn btn-outline-secondary mx-2">
                Create Auction
                </div>
            </div>
            <Modal centered show={showForm} onHide={closeForm}>
                <form onSubmit={submitForm}>
                <Modal.Header>
                    <Modal.Title>Create Auction</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Row>
                    <Col>
                        <Form.Group>
                        <Form.Label>Item Title</Form.Label>
                        <Form.Control type="text" required ref={itemTitle} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                        <Form.Label>Item Description</Form.Label>
                        <Form.Control type="text" required ref={itemDesc} />
                        </Form.Group>
                    </Col>
                    </Row>
                    <Row>
                    <Col>
                        <Form.Group>
                        <Form.Label>Start Price</Form.Label>
                        <Form.Control type="number" required ref={startPrice} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                        <Form.Label>Item Duration in hours</Form.Label>
                        <Form.Control type="number" required ref={itemDuration} />
                        </Form.Group>
                    </Col>
                    </Row>
                    <Row>
                    <Col>
                        <Form.Group>
                        <Form.Label>Seller</Form.Label>
                        <Form.Control
                            type="text"
                            value={currentUser.email}
                            readOnly
                        />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                        <Form.Label>Item Image</Form.Label>
                        <Form.Control
                            label="Select Item Image"
                            type='file'
                            required
                            ref={itemImage}
                        />
                        </Form.Group>
                    </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeForm}>
                    Cancel
                    </Button>
                    <Button variant="primary" type="submit" id="submitButton">
                    Submit
                    </Button>
                </Modal.Footer>
                </form>
            </Modal>
        </>
    );
}

export default CreateAuction;