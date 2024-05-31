import { NextRequest, NextResponse } from "next/server";

export async function POST() {
  console.log(NextRequest);
  return NextResponse.json({
    message: "Yoyo",
  });
}
