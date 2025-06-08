import { openai } from "@/lib/openai";
import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

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
        content: `Here is a notice:\n\n${text}\n\nPlease grab the following info: tax liability, notice date, sender, and amount due?`,
      },
    ],
  });

  const result = chatResponse.choices[0].message.content;
  return NextResponse.json({ result });
}