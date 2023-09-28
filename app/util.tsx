"use client"
import {Dropdown, Image, ListGroup, Navbar } from "react-bootstrap";
import {BiLinkExternal, BiFile, BiLinkAlt, BiCopy,BiText, BiDownload} from 'react-icons/bi'
import {FcGoogle} from 'react-icons/fc'
import { Comfortaa } from "next/font/google";
import {signin} from "@/components/fb/auth";
import { Suspense } from "react";
import Loading from "./loading";
import { useAuthContext } from "@/context/AuthContext";
import { signout } from "@/components/fb/auth";
import { redirect, usePathname } from "next/navigation";

const f = Comfortaa({ subsets: ['latin'] })

function openLink(url:string){
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
}

function copy(url:string){
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
        {(l_type==="site" || l_type==="text")? <BiCopy className="cursor-pointer" onClick={() => copy(link) }/>:''}
        {(l_type==="site")?
          <BiLinkExternal className="ml-3 cursor-pointer" onClick={() => openLink(link)}/>:
          (l_type==="file")?<BiDownload className="ml-3 cursor-pointer" onClick={() => openLink(link)}/>:''
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
  const { user } = useAuthContext()
  if(!user) redirect("/signin?c="+usePathname())
  return(
    <Dropdown>
      <Dropdown.Toggle className="!flex p-2 cursor-pointer border rounded-md !text-black !flex-row justify-center items-center bg-white hover:!bg-slate-300 transition-all">
        <Image height={30} referrerPolicy="no-referrer" width={30} src={user.photoURL} className="rounded mr-2"/>
            <span className="hidden md:block">{user.displayName} </span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Header>Account</Dropdown.Header>
        <Dropdown.Item eventKey="1" onClick={signout}>Signout</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Header>Other</Dropdown.Header>
        <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
        <Dropdown.ItemText>Non-interactive text</Dropdown.ItemText>
      </Dropdown.Menu>
    </Dropdown>
  );
      // return (
      //   <div className="flex p-2 cursor-pointer border rounded-md flex-row justify-center items-center hover:bg-slate-300 transition-all"
      //   onClick={()=> (window.location.href="/signin") }>
      //     <FcGoogle size={20} className="mr-2"/>
      //     Signin
      //   </div>)   
}

function Logo({className}){
  return <b className={f.className+' '+className}> &lt;Bootcamp/&gt;</b>
}

function Nav(){
return(
      <Navbar expand="lg" bg="light" className='!justify-between border-b-4 p-2 shadow-lg' variant="light">
        <Navbar.Brand className={`ml-5`}>
          <Logo/>
        </Navbar.Brand> 
        <UserBar/>
      </Navbar> )
}

export {ResourceItem, ChatItem, Nav, Logo};