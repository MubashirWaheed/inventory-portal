import { NextResponse } from "next/server";

// import {Request}
export function GET(req: Request, res: Response) {
  // ...
  return NextResponse.json({ data: "hello" });
}
