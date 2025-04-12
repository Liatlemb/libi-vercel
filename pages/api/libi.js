import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  try {
    const { messages } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      temperature: 0.75
    });

    const reply = response.choices[0]?.message?.content || "מצטערת, לא הצלחתי להבין. רוצה לנסח שוב?";
    res.status(200).json({ reply });

  } catch (error) {
    console.error("שגיאה בשיחה עם OpenAI:", error.message);
    res.status(500).json({ reply: "מצטערת, משהו השתבש. רוצה לנסות שוב?" });
  }
}
