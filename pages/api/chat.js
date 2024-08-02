import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { message } = req.body;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
      model: 'llama3-8b-8192',
    });

    res.status(200).json({ response: chatCompletion.choices[0]?.message?.content || "" });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching chat completion' });
  }
}
