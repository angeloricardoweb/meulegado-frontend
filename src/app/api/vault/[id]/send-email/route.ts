import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    error: false,
    messages: ["Email enviados aos destinatários com sucesso!"],
  });
}
