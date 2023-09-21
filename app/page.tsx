"use client"
import { Button, Card, Col, Container, Form, InputGroup, ListGroup, Navbar, Row } from 'react-bootstrap';
import {PiChatsDuotone, PiFoldersDuotone} from 'react-icons/pi';
import {ResourceItem, UserBar} from './util';


export default function Home() {

  return (
    <div className='flex bg flex-col h-screen w-screen'>
      <Navbar expand="lg" bg="light" className='!justify-between border-b-4 p-2 shadow-lg' variant="light">
        <Navbar.Brand className='ml-5'>
            <b>Bootcamp.</b>
        </Navbar.Brand> 
        <UserBar/>
      </Navbar>
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
