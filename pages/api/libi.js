import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { messages } = req.body;
  const prompt = messages[messages.length - 1]?.content || "How are you today?";

  const response = await fetch("https://api-inference.huggingface.co/models/google/flan-t5-small", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: `Translate to Hebrew: ${prompt}`
    })
  });

  const data = await response.json();

  const reply = data?.[0]?.generated_text?.trim();
  res.status(200).json({
    reply: reply || "ליבי: מצטערת, לא הצלחתי להבין. רוצה לנסח שוב?"
  });
}
