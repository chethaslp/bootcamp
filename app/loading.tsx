"use client"
import { motion } from "framer-motion";
import { Comfortaa } from "next/font/google";


const f = Comfortaa({ subsets: ['latin'] })

export default function Loading() {
    return (
        <div className={`${f.className} flex text-white text-4xl justify-center items-center h-screen w-screen   z-50`} >
            <b>Bootcamp.</b>
        </div> 
    )
  }

  