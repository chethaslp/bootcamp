"use client"
import { Button, Card, Col, InputGroup, ListGroup, Row } from 'react-bootstrap';
import { PiChatsDuotone, PiFoldersDuotone, PiUsersDuotone } from 'react-icons/pi';
import { ChatItem, Nav, ParticipantItem, ResourceItem } from '../../util';
import { useEffect, useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { GridLayout, LiveKitRoom, ParticipantTile, RoomAudioRenderer, useTracks } from '@livekit/components-react';
import Loading from '@/app/loading';
import { Track } from 'livekit-client';


function VideoGrid({token}){
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  return (
    <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
      <ParticipantTile />
    </GridLayout>)
}


export default function Home({roomId}) {

  const { user } = useAuthContext()
  const [token, setToken] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(
          `/api/client/get-token?room=${roomId}&uid=${user.uid}`
        );
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);


  return ((token === "")?(
    <Loading msg={"Connecting to Room..."}/>
  ):
    <div className='flex bg flex-col h-screen w-screen'>
      <Nav/>
      <div  className='flex p-3 h-full gap-2 overflow-auto'>
        {/* PARTICIPANTS BAR */}
        <div className='h-full w-1/5 md:flex hidden'>
          <Card className='shadow-md !h-full w-full'>
            <Card.Header className='flex flex-row justify-center align-middle'><span className='flex flex-row justify-center items-center'> <PiUsersDuotone className={"mr-2.5"} /> Participants </span></Card.Header>
            <Card.Body className='overflow-auto'>
              Hosts
            <ListGroup className='mb-2 mt-1'>
              {new Array(2).fill("H").map((t) => (
                <ParticipantItem user={{me:true, n:"Chethas L Pramod",img:"https://lh3.googleusercontent.com/a/ACg8ocIf5k5ENLdGCUloPSGBpItIisnG9tp6rf0dedP0pIU_dUA=s331-c-no"}}/>
              ))}
                {/* <ParticipantItem user={{me:true, n:"Chethas L Pramod",img:"https://lh3.googleusercontent.com/a/ACg8ocIf5k5ENLdGCUloPSGBpItIisnG9tp6rf0dedP0pIU_dUA=s331-c-no"}}/>
                <ParticipantItem user={{me:true, n:"User",img:"https://lh3.googleusercontent.com/a/ACg8ocIf5k5ENLdGCUloPSGBpItIisnG9tp6rf0dedP0pIU_dUA=s331-c-no"}}/> */}
              </ListGroup>
              Participants
              <ListGroup className='mt-1'>
              {new Array(200).fill("H").map((t) => (
                <ParticipantItem user={{me:true, n:"Chethas L Pramod",img:"https://lh3.googleusercontent.com/a/ACg8ocIf5k5ENLdGCUloPSGBpItIisnG9tp6rf0dedP0pIU_dUA=s331-c-no"}}/>
              ))}
                {/* <ParticipantItem user={{me:true, n:"Chethas L Pramod",img:"https://lh3.googleusercontent.com/a/ACg8ocIf5k5ENLdGCUloPSGBpItIisnG9tp6rf0dedP0pIU_dUA=s331-c-no"}}/>
                <ParticipantItem user={{me:true, n:"User",img:"https://lh3.googleusercontent.com/a/ACg8ocIf5k5ENLdGCUloPSGBpItIisnG9tp6rf0dedP0pIU_dUA=s331-c-no"}}/> */}
              </ListGroup>
            </Card.Body>
          </Card>
        </div>

        <div className='h-full pb-2 w-full md:w-4/5'>
          {/* STREAM VIEW */}
          <div className='mb-2 h-1/2'>
            <Card className='shadow-md !h-full !bg-slate-800'>
            <LiveKitRoom
                video={true}
                audio={true}
                token={token}
                connectOptions={{ autoSubscribe: true }}
                serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
                data-lk-theme="default"
                style={{ height: '100%' }}>
                  <RoomAudioRenderer/>
                  <VideoGrid token={token}/>
             </LiveKitRoom>
            </Card>
          </div>
          <div className='h-1/2 grid grid-flow-row md:grid-cols-2 gap-2 grid-cols-1'>
            {/* CHAT BAR */}
            <Card className='shadow-md !h-full'>
              <Card.Header className='flex flex-row justify-center align-middle'><span className='flex flex-row justify-center items-center'><PiChatsDuotone className="mr-2"/>Chat</span></Card.Header>
              <Card.Body className='gap-1 overflow-auto'>
                <ChatItem e={"userJoined"} user={{n:"Chethas L Pramod",img:"https://lh3.googleusercontent.com/a/ACg8ocIf5k5ENLdGCUloPSGBpItIisnG9tp6rf0dedP0pIU_dUA=s331-c-no"}} />
                <ChatItem e={"gtr"} msg={"hi"} user={{me:true, n:"Chethas L Pramod",img:"https://lh3.googleusercontent.com/a/ACg8ocIf5k5ENLdGCUloPSGBpItIisnG9tp6rf0dedP0pIU_dUA=s331-c-no"}} />
                <ChatItem e={"gtr"} msg={"<script>console.log('hi')</script> hnmghnghnghnghngngngng \n fbfdbdfbdfbdfb\ndggyy"} user={{me:true,n:"Chethas L Pramod",img:"https://lh3.googleusercontent.com/a/ACg8ocIf5k5ENLdGCUloPSGBpItIisnG9tp6rf0dedP0pIU_dUA=s331-c-no"}} />
              </Card.Body>
              <Card.Footer className='flex'>
                <InputGroup className=' justify-around'>
                  <input type="text" className='p-2 grow border' placeholder='Send a message'></input>
                  <Button>Send</Button>
                </InputGroup>
              </Card.Footer>
            </Card>

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
      </div>
  );
}
