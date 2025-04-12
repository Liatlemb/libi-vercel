import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { messages } = req.body;

  const lastUserMessage = messages[messages.length - 1]?.content || '';
  const input_text = `Act like an emotional support friend. Respond in Hebrew, in a warm and caring way, to the following message:\n"${lastUserMessage}"`;

  const hfResponse = await fetch('https://api-inference.huggingface.co/models/google/flan-t5-small', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: input_text
    }),
  });

  const hfData = await hfResponse.json();
  const reply = hfData?.[0]?.generated_text || 'מצטערת, משהו השתבש. רוצה לנסות שוב?';

  res.status(200).json({ reply });
}
