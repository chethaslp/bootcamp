"use client"
import { Button, Card, Col, InputGroup, ListGroup, Row } from 'react-bootstrap';
import {PiChatsDuotone, PiFoldersDuotone} from 'react-icons/pi';
import {Nav, ResourceItem} from '../../util';
import { useEffect } from 'react';
import { PeerConnection } from '@/components/rtc/peer';


export default function Home() {

  useEffect(()=>{
    PeerConnection.startPeerSession().then((id)=>{
      console.log("Peer session started: ",id)
    })
  },[])

  return (
    <div className='flex bg flex-col h-screen w-screen'>
      <Nav/>
      <div  className='flex p-3 h-full flex-col'>
          <Row className='h-1/2'>
            <Col>
              <Card className='shadow-md !h-full'>
                <Card.Header className='flex flex-row justify-center align-middle'><span className='flex flex-row justify-center items-center'><PiChatsDuotone className="mr-2"/>Chat</span></Card.Header>
                <Card.Body className=''>
                  <Card.Text>
                    Some quick example text to build the card out and make up the bulk of
                    the card's content.
                  </Card.Text>
                </Card.Body>
                <Card.Footer className='flex'>
                  <InputGroup className=' justify-around'>
                    <input type="text" className='p-2 grow border' placeholder='Send a message'></input>
                    <Button>Send</Button>
                  </InputGroup>
                </Card.Footer>
              </Card>
            </Col>
            <Col>
              <Card className='shadow-md !h-full'>
              <Card.Header className='flex flex-row justify-center align-middle'><span className='flex flex-row justify-center items-center'><PiFoldersDuotone className="mr-2"/>Resources</span></Card.Header>
                <Card.Body>
                  <ListGroup>
                    <ResourceItem l_type="file" link="dccsc"></ResourceItem>
                    <ResourceItem l_type="text" link="dbytjndn"></ResourceItem>
                    <ResourceItem l_type="site" link="dbytjndn"></ResourceItem>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className='h-1/2'>
            <Col className='mt-3'>
              <Card className='shadow-md !h-full'>
                <Card.Header>Header</Card.Header>
                <Card.Body>
                  <Card.Text>
                    Some quick example text to build the card out and make up the bulk of
                    the card's content.
                  </Card.Text>
                </Card.Body>
             </Card>
            </Col>
          </Row>
        
        </div>
      </div>
  );
}
