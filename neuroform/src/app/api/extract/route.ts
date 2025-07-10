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
        content: `Here is a pdf:\n\n${text}\n\n${prompt} \n DO NOT INCLUDE ANYTHING ELSE IN YOUR RESPONSE BESIDES THE JSON, NO ADDITIONAL TEXT OR EXPLANATION, OR ELSE MY APP WILL CRASH! EVEN IF YOU CAN'T DO WHAT I ASK, YOU STILL NEED TO RETURN A JSON WITH NO ADDITIONAL TEXT OR EXPLANATION. YOU KEEP FUCKING SENDING ADDITIONAL TEXT AND IT BREAKS THE APP. JSON ONLY DUDE. also, please only return values for the search targets, not the descriptions! the descriptions are simply to give more information on what the search target is asking for. so the format should be search_target: value_found_in_pdf only. `,
      },
    ],
  });

  const result = chatResponse.choices[0].message.content;
  return NextResponse.json({ result });
}
