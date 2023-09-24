"use client"
import { Button, Card, Col, Dropdown, FloatingLabel, Form, InputGroup, ListGroup, Modal, Row } from 'react-bootstrap';
import {HiUserGroup} from 'react-icons/hi2';
import {MdGroupAdd, MdGroupOff} from 'react-icons/md'
import {ImSpinner5} from 'react-icons/im'
import {Nav} from '@/app/util';
import { useEffect, useRef, useState } from 'react';
import { createUserRoom, getUserRooms } from '@/components/fb/db';

import { useAuthContext } from '@/context/AuthContext';
import { redirect } from 'next/navigation';


export default function Home() {
  const [rooms,setRooms] = useState(null)
  const [roomName, setRoomName] = useState<string>()
  const [roomDesc, setRoomDesc] = useState<string>()
  const [roomImg, setRoomImg] = useState<File>()

  const [btnDisabled, setDisbled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [validated, setValidated] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const coverFile = useRef(null)

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  const { user } = useAuthContext()

  function createRoom(event){
    event.preventDefault();
    if (!roomName || roomName=='') {
      setRoomName('')
      return
    }
    if(!roomDesc || roomDesc==''){
      setRoomDesc('')
      return
    }
    const key = (Math.random() + 1).toString(36).substring(7)

    setDisbled(true)
    createUserRoom({
        user: user.uid,
        name: roomName,
        desc: roomDesc
    },()=>{
      setShowModal(false)
    });
  }

  useEffect(()=>{
    if(!user) redirect("/signin")
    getUserRooms(user, (rms)=>{
      setRooms(rms)
      setLoading(false)
    })
  },[]);

  return (
    <div className='flex bg flex-col h-screen w-screen'>
      <Modal centered show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title className='flex-row flex gap-2 items-center'><MdGroupAdd/> Create Room</Modal.Title>
        </Modal.Header>
        <Form noValidate validated={validated} onSubmit={createRoom} className='gap-5'>
        <Modal.Body>
            <Form.Group controlId="room-name">
              <FloatingLabel label="Room Name">
                <Form.Control required onChange={(e)=>{setRoomName(e.target.value)}} type="text" isInvalid={(roomName=="")} autoFocus placeholder="Random Bootcamp" />
                <Form.Control.Feedback type="invalid">
                    Please enter a room name.
                 </Form.Control.Feedback>
              </FloatingLabel>
              
            </Form.Group>    
            <Form.Group className="mt-3" controlId="room-desc">
              <FloatingLabel label="Room Description">
                <Form.Control required as="textarea" isInvalid={(roomDesc=="")} placeholder='A few words about the room...' style={{height: '100px'}} onChange={(e)=>{setRoomDesc(e.target.value)}} />
                <Form.Control.Feedback type="invalid">
                  Please enter a room Description.
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
            <Form.Group controlId="formFile" className="mt-3">
              <Form.Label className='text-muted'>Cover Image</Form.Label>
                <Form.Control type="file" ref={coverFile}/>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="primary" type="submit" disabled={btnDisabled}>
            Create
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
        </Form>
      </Modal>
      
      <Nav/>
      <div  className='flex p-3 h-full flex-col'>
          <Row className='h-1/2'>
            <Col className='!w-1/3'>
            <Card>
              <Card.Header>Header</Card.Header>
              <Card.Body>
                <Card.Text>
                  Some quick example text to build the card out and make up the bulk of
                  the card's content.
                </Card.Text>
              </Card.Body>
            </Card>

            </Col>
            <Col className='!w-2/3'>
              <Card className='shadow-md !h-full'>
                <Card.Header className='flex flex-row justify-center'><span className='flex flex-row justify-center items-center'><HiUserGroup className="mr-2"/>Rooms</span></Card.Header>
                <Card.Body className='flex justify-center items-center'>
                  {(()=>{
                    if(loading){
                      return <ImSpinner5 size={20} className="animate-spin"/>
                    }else{
                      if (rooms){
                        return <div className='h-full w-full grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
                          {rooms?.map((item,i)=>{
                          return (<Card onClick={()=> (window.location.href = `/room/`+item.key)} key={item.key} bg="info" text="white" className='group overflow-hidden shadow-md cursor-pointer transition-all hover:shadow-lg hover:scale-105'>
                            <Card.Img variant="top" className='-mb-5 group-hover:scale-105' src='/placeholder.png'/>
                            <Card.Header >{item.name}</Card.Header>
                            <Card.Body >
                              <Card.Text>
                                {item.desc}
                              </Card.Text>
                            </Card.Body>
                          </Card>)
                        })}
                        </div>
                      }else{
                          <Card>
                            <Card.Body className='flex flex-col justify-center items-center'>
                              <MdGroupOff size={50}/>
                                No Rooms created yet.
                            </Card.Body>
                            <Card.Footer className='flex justify-center'>
                               <Button onClick={handleShowModal}>Create Room</Button>
                            </Card.Footer>
                          </Card>
                      }
                    }
                  })()}
                </Card.Body>
                <Card.Footer className='flex justify-center'>
                    <Button onClick={handleShowModal}>Create Room</Button>
                </Card.Footer>
              </Card>
            </Col>
            
          </Row>
          <Row className='h-1/2'>
            
          </Row>
        
        </div>
      </div>
  );
}
