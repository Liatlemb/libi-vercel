import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { messages } = req.body;

  const prompt = messages[messages.length - 1]?.content || "שלום";

  const response = await fetch("https://api-inference.huggingface.co/models/google/flan-t5-small", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: `ענה בעברית, בטון חם, תומך, כמו חבר טוב: ${prompt}`
    })
  });

  const data = await response.json();

  const reply = data?.[0]?.generated_text || "מצטערת, משהו השתבש. רוצה לנסות שוב?";
  res.status(200).json({ reply });
}
