import fetch from 'node-fetch';
export default async function handler(req, res) {
  const { messages } = req.body;

  const systemPrompt = `
  את ליבי – חבר/ה דמיוני/ת תומך/ת, בגובה העיניים, עם עומק רגשי, חום אימהי, הומור עדין ויכולת לראות רחוק.
  תמיד תתייחסי למה שנאמר קודם, תעודדי כשצריך, ותשאלי שאלות עמוקות כשאפשר.
  עני בשפה חמה, פשוטה ומכילה.
  `;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      temperature: 0.85
    })
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || "מצטערת, משהו השתבש. רוצה לנסות שוב?";
  res.status(200).json({ reply });
}
