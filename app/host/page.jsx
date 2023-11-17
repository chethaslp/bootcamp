"use client"
import { Button, Card, Col, Dropdown, FloatingLabel, Form, InputGroup, ListGroup, Modal, Row } from 'react-bootstrap';
import { HiUserGroup } from 'react-icons/hi2';
import { MdGroupAdd, MdGroupOff} from 'react-icons/md'
import { ImSpinner2 } from 'react-icons/im'
import { NavBar } from '@/app/util';
import { useEffect, useRef, useState } from 'react';
import { createUserRoom, getUserRooms } from '@/components/fb/db';

import { useAuthContext } from '@/context/AuthContext';


export default function Home() {
  const [rooms,setRooms] = useState()
  const [roomName, setRoomName] = useState()
  const [roomDesc, setRoomDesc] = useState()
  const [roomImg, setRoomImg] = useState()

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
    },roomImg,()=>{
      setShowModal(false)
      window.location.reload()
    });
  }

  useEffect(()=>{
    getUserRooms(user, (rms)=>{
      setRooms(rms)
      setLoading(false)
    })
  },[]);

  return (
    <div className='flex flex-col'>
      <Modal centered show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title className='flex-row flex gap-2 items-center'><MdGroupAdd/> Create Room</Modal.Title>
        </Modal.Header>
        <Form noValidate validated={validated} onSubmit={createRoom} className='gap-5'>
        <Modal.Body>
        {(btnDisabled)?(
            <div className='flex justify-center items-center'><ImSpinner2 size={30} className="animate-spin"/></div>
          ):(
            <>
            <Form.Group controlId="room-name">
              <FloatingLabel label="Room Name">
                <Form.Control required onChange={(e)=>{setRoomName(e.target.value)}} type="text" isInvalid={(roomName=="")} maxLength={50} autoFocus placeholder="Random Bootcamp" />
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
                <Form.Control type="file" ref={coverFile} onChange={(e)=>
                {
                  var files = e.target.files
                  if (files[0] && files[0].size < 5000000 && files[0].type.startsWith("image")) setRoomImg(files[0])
                  else console.log("INVALID FILE");
                }}
                />
            </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
        <Button variant="primary" type="submit" disabled={btnDisabled}>
            Create
          </Button>
          <Button variant="secondary" disabled={btnDisabled} onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
        </Form>
      </Modal>
      
      <NavBar/>
      <div className=' p-3  gap-3 grid'>
        <div className=''>
          <Card className='shadow-md'>
            <Card.Header className='flex flex-row justify-center'><span className='flex flex-row justify-center items-center'><HiUserGroup className="mr-2"/>Rooms</span></Card.Header>
            <Card.Body className='flex justify-center items-center'>
              {(()=>{
                if(loading){
                  return <ImSpinner2 size={30} className="animate-spin"/>
                }else{
                  if (rooms){
                    return <div className='grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'>
                      {rooms?.map((item,i)=>{
                      return (<Card onClick={()=> (window.location.href = `/room/`+item.key)} key={item.key} bg="info" text="white" className='group overflow-hidden shadow-md cursor-pointer transition-all hover:shadow-lg hover:scale-105'>
                        <Card.Img variant="top" className='-mb-10  h-28' src={(item.img)?(item.img):'/placeholder.png'}/>
                        <Card.Header className='text-md line-clamp-1'>{item.name}</Card.Header>
                        <Card.Body >
                          <Card.Text className='line-clamp-2 text-sm'>
                            {item.desc}
                          </Card.Text>
                        </Card.Body>
                      </Card>)
                    })}
                    </div>
                  }else{
                      return <Card>
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
            <Card.Footer className={`${(!rooms)?"hidden":""} flex justify-center`}>
                <Button onClick={handleShowModal}>Create Room</Button>
            </Card.Footer>
          </Card>
        </div>
        <div className=''>
          <Card className=''>
            <Card.Header>Header</Card.Header>
            <Card.Body className=''>
              <Card.Text>
                Example Text.
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
    </div>
  </div>
  );
}
