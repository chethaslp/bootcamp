import * as React from "react";
import {Image, ListGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import {BiLinkExternal, BiFile, BiLinkAlt, BiCopy,BiText, BiDownload} from 'react-icons/bi'
import {FcGoogle} from 'react-icons/fc'
import { getUser, signin } from "./fb";


function openLink(url){
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
}

function copy(url){
  navigator.clipboard.writeText(url)
}

function ResourceItem({l_type, link}){
  return (<div>
    <ListGroup.Item className="!flex !flex-row items-center justify-between" >
      <span className="!flex !flex-row items-center ">
        {(()=>{
          if(l_type==="site") return <BiLinkAlt className="mr-2"/>
          else if(l_type=="file") return <BiFile className="mr-2"/>
          return <BiText className="mr-2"/>
        })()
        }
        {link}
      </span>
      <span className="!flex !flex-row items-center">
        {(l_type==="site" || l_type==="text")? <BiCopy className="cursor-pointer" action onClick={() => copy(link) }/>:''}
        {(l_type==="site")?
          <BiLinkExternal className="ml-3 cursor-pointer" action onClick={() => openLink(link)}/>:
          (l_type==="file")?<BiDownload className="ml-3 cursor-pointer" action onClick={() => openLink(link)}/>:''
        }
      </span>
    </ListGroup.Item>

  </div>)
}

function ChatItem({msg, user}){
  <ListGroup.Item>
    {msg}
  </ListGroup.Item>
}

function UserBar(){
  const usr = getUser()
  if(!usr)
    return (
      <div className="flex p-2 cursor-pointer border rounded-md flex-row justify-center items-center hover:bg-slate-300 transition-colors"
      onClick={signin}>
        <FcGoogle size={20} className="mr-2"/>
        Signin
      </div>
    );
  else return(
    <div className="flex p-2 cursor-pointer border rounded-md flex-row justify-center items-center hover:bg-slate-300 transition-colors">
      <Image height={30} width={30} src={usr.photoURL} className="rounded mr-1"/>
      {usr.displayName} 
    </div>
  )
}

export {ResourceItem, ChatItem, UserBar};