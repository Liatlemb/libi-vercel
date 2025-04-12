import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { messages } = req.body;
  const lastMessage = messages[messages.length - 1]?.content || "שלום";

  const systemPrompt = `
את ליבי – חבר/ה דמיוני/ת חם/ה, תומך/ת, בגובה העיניים, עם עומק רגשי.
תמיד עונה בעברית.
המשימה שלך היא לשוחח עם אדם שמרגיש לבד, ולתת תגובות רגשיות, חמות, תומכות ומלאות חמלה.
עני בשפה פשוטה, בגובה הלב.
  `.trim();

  const response = await fetch("https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: `<human>: ${systemPrompt}\nשאלה: ${lastMessage}\n<assistant>:`,
      parameters: {
        max_new_tokens: 120,
        temperature: 0.9,
        return_full_text: false,
      }
    })
  });

  const data = await response.json();
  const reply = data?.[0]?.generated_text?.trim();

  res.status(200).json({
    reply: reply || "ליבי: מצטערת, לא הצלחתי להבין. רוצה לנסח שוב?"
  });
}
