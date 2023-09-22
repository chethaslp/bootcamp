"use client"
import { Button, Card, Col, Dropdown, Form, InputGroup, ListGroup, Modal, Row } from 'react-bootstrap';
import {HiUserGroup} from 'react-icons/hi2';
import {MdGroupAdd, MdGroupOff} from 'react-icons/md'
import {Nav, ResourceItem} from '@/app/util';
import { useEffect, useState } from 'react';
import { createUserRoom, getUserRooms } from '@/components/fb/db';
import { getUser } from '@/components/fb/auth';

export default function Home() {
  const [room,setRooms] = useState(null)

  const [roomName, setRoomName] = useState()
  const [roomDesc, setRoomDesc] = useState()
  const [btnDisabled, setDisbled] = useState(false)

  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  function createRoom(){
    const key = (Math.random() + 1).toString(36).substring(7)

    setDisbled(true)
    createUserRoom({
        user: getUser().uid,
        name: roomName,
        desc: roomDesc
    },()=>{
      setShowModal(false)
    });
  }

  useEffect(()=>{
    setRooms(getUserRooms())
  });
  return (
    <div className='flex bg flex-col h-screen w-screen'>
      <Modal centered show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title className='flex-row flex gap-2 items-center'><MdGroupAdd/> Create Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className='gap-3'>
            <Form.Group controlId="room-name">
              <Form.Label>Room Name</Form.Label>
              <Form.Control onChange={(e)=>{setRoomName(e.target.value)}} type="text" autoFocus placeholder="Random Bootcamp" />
            </Form.Group>
            <Form.Group className="mt-2" controlId="room-desc">
              <Form.Label>Room Description</Form.Label>
              <Form.Control as="textarea" onChange={(e)=>{setRoomDesc(e.target.value)}} rows={3} />
            </Form.Group>
          </Form>

        </Modal.Body>
        <Modal.Footer>
        <Button variant="primary" disabled={btnDisabled} onClick={createRoom}>
            Create
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      
      <Nav/>
      <div  className='flex p-3 h-full flex-col'>
          <Row className='h-1/2'>
            <Col>
              <Card className='shadow-md !h-full'>
                <Card.Header className='flex flex-row justify-center align-middle'><span className='flex flex-row justify-center items-center'><HiUserGroup className="mr-2"/>Rooms</span></Card.Header>
                <Card.Body className='flex justify-center items-center'>
                    {(room)? (
                      room.map((item,i)=>{
                        <Card>
                          <Card.Header>item.name</Card.Header>
                          <Card.Body>
                            <Card.Text>
                              item.desc
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      })
                    ):(
                        <Card>
                          <Card.Body className='flex flex-col justify-center items-center'>
                            <MdGroupOff size={50}/>
                              No Rooms created yet.
                          </Card.Body>
                          <Card.Footer className='flex justify-center'>
                             <Button onClick={handleShowModal}>Create Room</Button>
                          </Card.Footer>
                        </Card>
                      )}
                </Card.Body>
              </Card>
            </Col>
            
          </Row>
          <Row className='h-1/2'>
            
          </Row>
        
        </div>
      </div>
  );
}
