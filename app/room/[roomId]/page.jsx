"use client"
import { Button, Card, Col, FloatingLabel, Form, InputGroup, ListGroup, Modal, Row, Tab, Nav } from 'react-bootstrap';
import { PiChatsDuotone, PiFoldersDuotone, PiUsersDuotone, PiUserRectangleDuotone} from 'react-icons/pi';
import { FaSpinner, FaUsersSlash } from "react-icons/fa";
import { ImSpinner2 } from 'react-icons/im'
import '@livekit/components-styles';
import { ChatItem, NavBar, ParticipantItem, ResourceItem, redirect } from '../../util';

import { usePathname } from "next/navigation";
import { useEffect, useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { CarouselLayout, LiveKitRoom, ParticipantTile, RoomAudioRenderer, useTracks, useChat, useRoomContext,  useParticipants, useDataChannel, VideoTrack, FocusLayout, FocusLayoutContainer, ControlBar } from '@livekit/components-react';
import Loading from '@/app/loading';
import { DataPacket_Kind, Participant, RoomEvent, Track } from 'livekit-client';
import Link from 'next/link';


function VideoGrid({token, status}){
  const camTrack = useTracks([Track.Source.Camera], {onlySubscribed: true});
  const scrTrack = useTracks([Track.Source.ScreenShare], {onlySubscribed: true});
  
  if(!status) return <div className='text-white flex items-center justify-center'><ImSpinner2 className='animate-spin mr-3' size={25}/> Connecting.</div>
  else if(status == 'r') <div className='text-white flex items-center justify-center'><ImSpinner2 className='animate-spin mr-3' size={25}/> Reconnecting.</div>

  if(camTrack.length == 0) return <div className='text-white flex items-center justify-center'><PiUserRectangleDuotone size={30} className={"mr-3"}/>Waiting for Host to join.</div>
return (
  <div className='!h-full !w-full grid grid-flow-col'>
    {/* <div> */}
      {(scrTrack.length != 0)?<FocusLayoutContainer className='h-full w-full '>
      {scrTrack.map((trackReference,i) => {
        return (
          // <VideoTrack {...trackReference} key={`view-${i}`}/>
          <FocusLayout trackRef={trackReference} key={`scr-${i}`}/>
        )
      })}
      </FocusLayoutContainer>:null}
      <FocusLayoutContainer className='h-full w-full p-1 grid-flow-col'>
      {camTrack.map((trackReference,i) => {
        return (
          // <VideoTrack {...trackReference} key={`view-${i}`}/>
          <FocusLayout trackRef={trackReference} key={`cam-${i}`}/>
        )
      })}
      </FocusLayoutContainer>
    {/* </div> */}
    {/* <CarouselLayout tracks={camTrack}>
      <ParticipantTile />
    </CarouselLayout> */}
  </div>
)
  // const tracks = useTracks(
  //   [
  //     { source: Track.Source.Camera, withPlaceholder: true },
  //     { source: Track.Source.ScreenShare, withPlaceholder: false },
  //   ],
  //   { onlySubscribed: false },
  // );

  // return (
  //   <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
  //     <ParticipantTile />
  //   </GridLayout>)
}

function ParticipantBar() {
  // Render a list of all participants in the room.
  const participants = useParticipants();

  var prpts = [], hosts = [];
  participants.map((prts)=>{
    const mtd = JSON.parse(prts.metadata || '{"img":""}')
    if(mtd.host){
      hosts.push(<ParticipantItem user={{me:prts.isLocal, n:prts.name, img:mtd.img, host:mtd.host}} key={`pt-${prts.identity}`} />)
    }else{
      prpts.push(<ParticipantItem user={{me:prts.isLocal, n:prts.name, img:mtd.img, host:mtd.host}} key={`pt-${prts.identity}`} />)
    }
  })
  
  if (participants.length == 0) return <FaSpinner className='animate-spin'/>
  return <div className=''>
    <span className='mb-2 ml-1'>Hosts</span>
    {(hosts.length!=0)?<>
      <ListGroup className='p-1 mb-2'>{hosts.map((prt)=>prt)}</ListGroup>
    </>:<div className='flex justify-center'><small className='text-muted'>No Hosts joined so far.</small></div>}
    <hr/>
    <span className='mb-2 ml-1'>Partcipants</span>
    {(prpts.length!=0)?<>
      <ListGroup className='p-1'>{prpts.map((prt)=>prt)}</ListGroup>
    </>:<div className='flex justify-center'><small className='text-muted'>No Participants so far.</small></div>}
  </div>
}
function QnaDialog(){
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const room = useRoomContext()
  const [qna, setQna] = useState([])
  const [ans, setAns] = useState("")
  
  room.on(RoomEvent.DataReceived, (payload, participant, kind, topic) => {
    if(topic == "qna"){
      const strData = decoder.decode(payload)
      setQna(JSON.parse(strData))
      setAns("")
      handleShowModal()
    }
  })
  const send = () => {
    // QNA data string 
    //   ["qna", QUESTION ID, QUESTION TYPE, "Question", [Options]?]
    room.localParticipant.publishData(encoder.encode(JSON.stringify(["qna",room.localParticipant.identity,1,"Sample Question",["o1","o2","o3","o4"]])), DataPacket_Kind.LOSSY,{topic:"qna"})
  }
  return <>
  {/* <button onClick={()=>send()}>ok</button> */}
  <Modal centered show={showModal} onHide={handleCloseModal}>
  <Modal.Header closeButton>
      <Modal.Title>{qna[3]}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {(()=>{
      if(qna[2]==0){
        return <Form.Group controlId="room-name">
        <FloatingLabel label="Your Answer">
          {/* isInvalid={(roomName=="")} */}
          <Form.Control required onChange={(e)=>{setAns(e.target.value)}} type="text"  maxLength={100} autoFocus placeholder="Answer" />
          <Form.Control.Feedback type="invalid">
              Please enter a value.
           </Form.Control.Feedback>
        </FloatingLabel>
      </Form.Group> 
      }else if((qna[2]==1)){
        return <ListGroup>
          {qna[4].map((op,i)=>{
            return <ListGroup.Item key={`op-${i}`} active={ans==i.toString()} onClick={()=>{setAns(i.toString())}} className='cursor-pointer'>{op}</ListGroup.Item>
          })}
      </ListGroup>
      }
    })()}
  </Modal.Body>
  <Modal.Footer>
      <Button variant="secondary" onClick={handleCloseModal}>
          Cancel
      </Button>
      <Button variant='primary' >
        Submit
      </Button>
  </Modal.Footer>
</Modal>
</>

}
function ResoursesBar(){
  const room = useRoomContext()
  const [pinRes, setPinRes] = useState("")
  const [res , setRes] = useState([])
  const [loading, setLoading] = useState(true)

  room.on(RoomEvent.DataReceived, (payload, participant, kind, topic) => {
    if (JSON.parse(participant.metadata)['host']){
      if(topic == "rsc"){
        const d = JSON.parse(decoder.decode(payload))
        if(d[0]=="add"){
          setRes([...res, d[1]])
        } else if(d[0]=="pin"){
          setPinRes(d[1])
        }
      }
    }
})
  return (loading)?<ImSpinner2 className='animate-spin'/>:
  (res == [])?<div className='flex items-center justify-center'>No resources Shared.</div>:
  <ListGroup>
    {res.map((r)=>{
      <ResourceItem key={r[0]} l_type={r[1]} link={r[2]} className={`${(r[0]==pinRes)?"animate-pulse":""} active:animate-none`}></ResourceItem>
    })}
  </ListGroup>
}

function SideBar(){

    // CHATBAR: state vars
    const [msg, setMsg] = useState("");
    const {send, chatMessages, isSending} = useChat()

  return <Card className='shadow-md !h-full w-full'>
      <Tab.Container id="tab-container" defaultActiveKey="participants-bar">
      <Card.Header className='flex flex-row justify-center align-middle'>
        <Nav variant="tabs" className="flex-row">
            <Nav.Item>
              <Nav.Link eventKey="participants-bar" className='group/pr'>
                <div className='flex flex-row justify-center items-center'> 
                  <PiUsersDuotone size={25}/> 
                  <span className="group-aria-selected/pr:hidden flex relative items-center justify-center w-4 h-4 -top-2 -end-2 -ml-4 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">2</span>
                  <span className='hidden group-aria-selected/pr:block ml-2'>Participants</span>
                </div>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="chat-bar" className='group/ch'>
                <span className='flex flex-row justify-center items-center'>
                  <PiChatsDuotone size={25}/>
                  <span class="group-aria-selected/ch:hidden flex relative items-center justify-center w-4 h-4 -top-2 -end-2 -ml-4 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">2</span>
                  <span className='hidden group-aria-selected/ch:block ml-2'>Chats</span>
                </span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="resources-bar" className='group/re'>
                <span className='flex flex-row justify-center items-center'>
                  <PiFoldersDuotone size={25}/>
                  <span class="group-aria-selected/re:hidden flex relative items-center justify-center w-4 h-4 -top-2 -end-2 -ml-4 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">2</span>
                  <span className='hidden group-aria-selected/re:block ml-2'>Resourses</span>
                </span>
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
      <Card.Body className='overflow-auto'>
      <Tab.Content>
            <Tab.Pane eventKey="participants-bar">
                <ParticipantBar/>
            </Tab.Pane>
            <Tab.Pane eventKey="chat-bar">
              <center className='mb-2'><small className='text-muted p-2'>Messages sent here is visible to all participants in the room.</small></center>
              {chatMessages.map((msg,i)=>{
                return <ChatItem e={"msg"} user={{ n: msg.from?.name, img: JSON.parse(msg.from?.metadata).img, me: msg.from.isLocal}} msg={msg.message} key={msg.from?.identity+i.toString()} />
              })}
            </Tab.Pane>
            <Tab.Pane eventKey="resources-bar">
              <ResoursesBar/>
            </Tab.Pane>
          </Tab.Content>
        
      </Card.Body>
      <Card.Footer>
      <Tab.Content>
            <Tab.Pane  eventKey="participants-bar">
                <ControlBar variation='minimal'/>
            </Tab.Pane>
            <Tab.Pane eventKey="chat-bar">
              <InputGroup className=' justify-around'>
                <input type="text" className='p-2 grow border' placeholder='Send a message' value={msg} onChange={(e)=> setMsg(e.target.value)} onKeyDown={(e)=>{if (e.key === 'Enter' && msg != "") {send(msg); setMsg("")}}}></input>
                <Button onClick={()=>{
                  if(msg == "") return
                  send(msg)
                  setMsg("")
                }}>Send</Button>
              </InputGroup>
            </Tab.Pane>
            <Tab.Pane eventKey="resources-bar">
            
            </Tab.Pane>
          </Tab.Content>
      </Card.Footer>
    </Tab.Container>
    </Card>

}

function EventHandler({setStatus}){
  const room = useRoomContext()
  
  room.on(RoomEvent.Disconnected,() =>{
    redirect("/")
  })
  room.on(RoomEvent.Connected, ()=>{
    setStatus("c")
  })
  room.on(RoomEvent.Reconnecting,()=>{
    setStatus("r.")
  })
  room.on(RoomEvent.Reconnected, ()=>{
    setStatus("r")
  })
  return null
}

export default function Home({ params }) {

  const { user } = useAuthContext()
  const roomId = params.roomId
  const path = usePathname()

  const [status, setStatus] = useState()
  const [token, setToken] = useState("")
  const [roomData, setRoomData] = useState()
  
  if(!user) redirect("/signin?c="+path)
  
  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(
          `/api/client/get-token?rid=${roomId}&uid=${user.uid}&name=${user.displayName}&img=${user.photoURL}`
        );
        if (resp.ok){
          const data = await resp.json();
          setToken(data.token);
          setRoomData(data.room)
        }else{
          setToken("null")
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);


  return ((token === "")?(
    <Loading msg={"Connecting to Room..."}/>
  ):
  (token == "null")?<>
  <div className='flex bg flex-col h-screen w-screen items-center text-white'>
    <div className='flex flex-row items-center h-[95%] '>
      <FaUsersSlash size={30}/>
      <span className='ml-3 border-l-2 pl-3 '> This Room doesn&apos;t exist :/</span>
    </div>
    <div className='h-[5%]'>
      <Link href='/host' className='no-underline text-white hover:drop-shadow-lg hover:font-semibold transition-all'>Go Back</Link>
    </div>
  
  </div>
  </>:
    <div className='flex bg flex-col h-screen w-screen'>
      <NavBar title={(roomData)?roomData.name:null}/>
      <LiveKitRoom
                video={true}
                audio={true}
                token={token}
                connectOptions={{ autoSubscribe: true }}
                serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
                style={{ height: '100%' }}
      >
        <EventHandler setStatus={setStatus}/>
        <QnaDialog/>
        <div  className='grid lg:grid-flow-col-dense p-3 h-full gap-2 overflow-auto'>
        {/* SIDE BAR */}
        <div className='flex flex-col h-full order-1 lg:-order-1'>
          <SideBar/>
        </div>
        
        <div className='pb-2 h-full -order-1 lg:order-1'>
          {/* STREAM VIEW */}
            <Card className='group/view shadow-md !h-full flex flex-row justify-center !bg-slate-800'>
                  <RoomAudioRenderer/>
                  <VideoGrid  token={token} status={status}/>
                  <ControlBar className='z-[100] fixed !hidden lg:group-hover/view:!flex  rounded backdrop-blur-lg brightness-75 text-white align-self-end mb-5 transition-opacity '/>
            </Card>
        </div>

          </div>
        </LiveKitRoom>
        </div>
  );
}
