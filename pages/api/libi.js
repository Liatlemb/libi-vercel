import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { messages } = req.body;
  const userMessage = messages[messages.length - 1]?.content || "Hi";

  const response = await fetch("https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: `<human>: ${userMessage}\n<assistant>:`,
      parameters: {
        max_new_tokens: 100,
        return_full_text: false
      }
    })
  });

  const data = await response.json();
  const reply = data?.[0]?.generated_text?.trim();

  res.status(200).json({
    reply: reply || "ליבי: מצטערת, לא הצלחתי להבין. רוצה לנסח שוב?"
  });
}
