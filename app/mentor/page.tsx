"use client"
import { Button, Card, Col, Container, Form, InputGroup, ListGroup, Navbar, Row } from 'react-bootstrap';
import {PiChatsDuotone, PiFoldersDuotone} from 'react-icons/pi';
import {ResourceItem} from './util';


export default function Home() {
  return (
    <div className='flex bg flex-col h-screen w-screen'>
      <Navbar expand="lg" bg="light" className=' !justify-between border-b-4 p-2 shadow-lg' variant="light">
        <Navbar.Brand>
            Bootcamp
        </Navbar.Brand> 
      </Navbar>
      <div  className='flex p-3 h-full flex-col'>
          
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
