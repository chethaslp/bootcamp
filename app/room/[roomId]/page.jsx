"use client"
import { Button, Card, Col, FloatingLabel, Form, InputGroup, ListGroup, Modal, Row } from 'react-bootstrap';
import { PiChatsDuotone, PiFoldersDuotone, PiUsersDuotone } from 'react-icons/pi';
import { FaSpinner, FaUsersSlash } from "react-icons/fa";
import { ChatItem, Nav, ParticipantItem, ResourceItem } from '../../util';
import { usePathname } from "next/navigation";
import { useEffect, useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { GridLayout, LiveKitRoom, ParticipantTile, RoomAudioRenderer, useTracks, useChat, useRoomContext, ParticipantLoop, ParticipantName, useParticipants, useDataChannel, VideoTrack } from '@livekit/components-react';
import Loading from '@/app/loading';
import { DataPacket_Kind, Participant, RoomEvent, Track } from 'livekit-client';
import Link from 'next/link';


function VideoGrid({token}){
const cameraTracks = useTracks([Track.Source.Camera], {onlySubscribed: true});
return (
  <div className='h-full'>
    {cameraTracks.map((trackReference,i) => {
      return (
        <VideoTrack {...trackReference} key={`view-${i}`}/>
      )
    })}
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
  
  if (participants.size == 1) return <FaSpinner className='animate-spin'/>
  return <ListGroup>
    {participants.map((prts)=>{
      const mtd = JSON.parse(prts.metadata || '{"img":""}')
      return <ParticipantItem user={{me:prts.isLocal, n:prts.name, img:mtd.img, host:mtd.host}}/>
    })}
  </ListGroup>
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
    //   ["qna", HOST ID, QUESTION TYPE, "Question", [Options]?]
    room.localParticipant.publishData(encoder.encode(JSON.stringify(["qna",room.localParticipant.identity,1,"Sample Question",["o1","o2","o3","o4"]])), DataPacket_Kind.LOSSY,{topic:"qna"})
  }
  return <>
  <button onClick={()=>send()}>ok</button>
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

function ChatBar({user}){
  const [msg, setMsg] = useState("");
  const {send, chatMessages, isSending} = useChat()

  return <Card className='shadow-md !h-full'>
            <Card.Header className='flex flex-row justify-center align-middle'><span className='flex flex-row justify-center items-center'><PiChatsDuotone className="mr-2"/>Chat</span></Card.Header>
            <Card.Body className='gap-1 overflow-auto'>
              <center><small className='text-muted bg-slate-400 rounded p-2'>Messaged sent here is visible to all participants in the room.</small></center>
              {chatMessages.map((msg,i)=>{
                return <ChatItem e={"msg"} user={{ n: msg.from?.name, img: JSON.parse(msg.from?.metadata).img, me: msg.from.isLocal}} msg={msg.message} key={msg.from?.identity+i.toString()} />
              })}
              {/* <ChatItem e={"gtr"} msg={"hi"} user={{me:true, n:"Chethas L Pramod",img:"https://lh3.googleusercontent.com/a/ACg8ocIf5k5ENLdGCUloPSGBpItIisnG9tp6rf0dedP0pIU_dUA=s331-c-no"}} />
              <ChatItem e={"gtr"} msg={"<script>console.log('hi')</script> hnmghnghnghnghngngngng \n fbfdbdfbdfbdfb\ndggyy"} user={{me:true,n:"Chethas L Pramod",img:"https://lh3.googleusercontent.com/a/ACg8ocIf5k5ENLdGCUloPSGBpItIisnG9tp6rf0dedP0pIU_dUA=s331-c-no"}} /> */}
            </Card.Body>
            <Card.Footer className='flex'>
              <InputGroup className=' justify-around'>
                <input type="text" className='p-2 grow border' placeholder='Send a message' value={msg} onChange={(e)=> setMsg(e.target.value)} onKeyDown={(e)=>{if (e.key === 'Enter' && msg != "") {send(msg); setMsg("")}}}></input>
                <Button onClick={()=>{
                  if(msg == "") return
                  send(msg)
                  setMsg("")
                }}>Send</Button>
              </InputGroup>
            </Card.Footer>
          </Card>
}

export default function Home({ params }) {

  const { user } = useAuthContext()
  const roomId = params.roomId
  const path = usePathname()
  const [token, setToken] = useState("");
  
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
      <span className='ml-3 border-l-2 pl-3'> This Room doesn&apos;t exist :/</span>
    </div>
    <div className='h-[5%]'>
      <Link href='/host' className='no-underline'>Go Back</Link>
    </div>
  
  </div>
  </>:
    <div className='flex bg flex-col h-screen w-screen'>
      <Nav/>
      <LiveKitRoom
                video={true}
                audio={true}
                token={token}
                connectOptions={{ autoSubscribe: true }}
                serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
                data-lk-theme="default"
                style={{ height: '100%', overflow:"auto" }}
      >
        <QnaDialog/>
        <div  className='flex p-3 h-full gap-2 overflow-auto'>
        {/* PARTICIPANTS BAR */}
        <div className='h-full w-1/5 md:flex hidden'>
          <Card className='shadow-md !h-full w-full'>
            <Card.Header className='flex flex-row justify-center align-middle'><span className='flex flex-row justify-center items-center'> <PiUsersDuotone className={"mr-2.5"} /> Participants </span></Card.Header>
            <Card.Body className='overflow-auto'>
              {/* Hosts
            <ListGroup className='mb-2 mt-1'>
              
              {new Array(2).fill("H").map((t) => (
                <ParticipantItem user={{me:true, n:"Chethas L Pramod",img:"https://lh3.googleusercontent.com/a/ACg8ocIf5k5ENLdGCUloPSGBpItIisnG9tp6rf0dedP0pIU_dUA=s331-c-no"}}/>
              ))}
                
              </ListGroup>
              Participants
              <ListGroup className='mt-1'>
              {new Array(10).fill("H").map((t) => (
                <ParticipantItem user={{me:true, n:"Chethas L Pramod",img:"https://lh3.googleusercontent.com/a/ACg8ocIf5k5ENLdGCUloPSGBpItIisnG9tp6rf0dedP0pIU_dUA=s331-c-no"}}/>
              ))}
                
              </ListGroup> */}
              <ParticipantBar/>
            </Card.Body>
          </Card>
        </div>

        <div className='h-full pb-2 w-full md:w-4/5'>
          {/* STREAM VIEW */}
          <div className='mb-2 h-1/2'>
            <Card className='shadow-md !h-full !flex flex-col !bg-slate-800'>
                  <RoomAudioRenderer/>
                  <VideoGrid  token={token}/>
            </Card>
          </div>
          <div className='h-1/2 grid grid-flow-row md:grid-cols-2 gap-2 grid-cols-1'>
            {/* CHAT BAR */}
            <ChatBar user={user}/>

            {/* RESOURCES BAR */}
              <Card className='shadow-md !h-full'>
                <Card.Header className='flex flex-row justify-center align-middle'><span className='flex flex-row justify-center items-center'><PiFoldersDuotone className="mr-2"/>Resources</span></Card.Header>
                <Card.Body>
                  <ListGroup>
                    <ResourceItem l_type="file" link="dccsc" className={undefined} ></ResourceItem>
                    <ResourceItem l_type="text" link="dbytjndn" className={undefined}></ResourceItem>
                    <ResourceItem l_type="site" link="dbytjndn" className={undefined}></ResourceItem>
                  </ListGroup>
                </Card.Body>
              </Card>
          </div>
          </div>
          </div>
        </LiveKitRoom>
        </div>
  );
}
