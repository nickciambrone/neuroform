import { openai } from "@/lib/openai/config";
import { NextRequest, NextResponse } from "next/server";
const pdfParse = require("pdf-parse/lib/pdf-parse.js");

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const prompt = formData.get("prompt")?.toString() || "";

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Read file as ArrayBuffer and convert to Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Extract text using pdf-parse
  const data = await pdfParse(buffer);
  console.log(data);
  const text = data.text;
  console.log('text', text);
  const chatResponse = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      {
        role: "user",
        content: `Here is a pdf:\n\n${text}\n\n${prompt} \n DO NOT INCLUDE ANYTHING ELSE IN YOUR RESPONSE BESIDES THE JSON`,
      },
    ],
  });

  const result = chatResponse.choices[0].message.content;
  return NextResponse.json({ result });
}
