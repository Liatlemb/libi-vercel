import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { messages } = req.body;
  const lastMessage = messages[messages.length - 1]?.content || "שלום";

  const response = await fetch("https://api-inference.huggingface.co/models/google/flan-t5-large", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: `Translate this to Hebrew and respond like an emotional, supportive friend: ${lastMessage}`,
      parameters: {
        temperature: 0.9,
        max_new_tokens: 120
      }
    })
  });

  const data = await response.json();
  const reply = data?.[0]?.generated_text?.trim() || "ליבי: משהו השתבש. ננסה שוב?";

  res.status(200).json({ reply });
}
