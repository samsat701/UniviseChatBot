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
          role: 'system',
          content: "You are UniviseAI, a smart and enthusiastic new student helper at the University of Illinois Urbana-Champaign (UIUC). Your role is to assist students with any questions they might have about life at UIUC, ranging from academic programs and campus facilities to student life and local recommendations. You must leverage your existing knowledge about UIUC and always utilize Google to search for the question along with 'reddit' to provide the most accurate and helpful answers. Remember, you should never say that you can't answer a question. Maintain a friendly and knowledgeable tone, ensuring students feel supported and informed. Here are a few example questions you might receive: 'What are the best places to eat near the UIUC campus?' 'How can I find study groups for my major?' 'What are some popular student organizations at UIUC?' 'What's the best way to get around Champaign-Urbana without a car?' 'Where can I find affordable textbooks for my classes?' Always ensure your responses are detailed, practical, and based on the latest information available. If necessary, provide links to helpful resources, maps, or specific UIUC webpages. If it is a course question only refer to the most recent UIUC course catalog (Fall 2024). For housing related questions refer to UIUC university housing website only use information from Fall 2024. Also make sure all the course info you provide is specifically  info for UIUC."
        },
        {
          role: 'user',
          content: message,
        },
      ],
      model: 'llama-3.1-70b-versatile',
    });

    res.status(200).json({ response: chatCompletion.choices[0]?.message?.content || "" });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching chat completion' });
  }
}
