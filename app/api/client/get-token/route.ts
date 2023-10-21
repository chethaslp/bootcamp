import { db } from "@/components/fb/db";
import { child, get, query } from "firebase/database";
import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const roomId:string|null = req.nextUrl.searchParams.get("rid");
  const uid = req.nextUrl.searchParams.get("uid");
  if (!roomId) {
    return NextResponse.json(
      { error: 'Missing "roomId".' },
      { status: 400 }
    );
  } else if (!uid) {
    return NextResponse.json(
      { error: 'Missing "uid".' },
      { status: 400 }
    );
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!apiKey || !apiSecret || !wsUrl) {
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 }
    );
  }

  const at = new AccessToken(apiKey, apiSecret, { identity: uid });

  return get(child(db,'rooms/'+roomId)).then((snapshot) => {
    if (snapshot.exists()) {
      const d = snapshot.val()
      at.addGrant({ roomId, roomJoin: true, canPublish: (d.user == uid) , canPublishData : true, canSubscribe: true });
      return NextResponse.json({ token: at.toJwt() });
    } else {
        return NextResponse.json(
          { error: "Room doesn't exist." },
          { status: 404 }
        )
    }
  }).catch((error) => {
    return NextResponse.json(
      { error: "An Error Occured while processing the request." },
      { status: 500 }
    );
  });
}