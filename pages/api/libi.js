import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { messages } = req.body;

  const systemPrompt = `
  את ליבי – חבר/ה דמיוני/ת תומך/ת, בגובה העיניים, עם עומק רגשי, חום אימהי והומור עדין.
  תמיד תתייחסי למה שנאמר קודם, תעודדי כשצריך, ותשאלי שאלות עמוקות כשאפשר.
  עני בעברית פשוטה, חמה ומכילה.
  `;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
        temperature: 0.85
      })
    });

    const data = await response.json();

    console.log("🔍 תגובת OpenAI:", JSON.stringify(data, null, 2)); // לוג חשוב!

    const reply = data.choices?.[0]?.message?.content || "מצטערת, משהו השתבש. רוצה לנסות שוב?";
    res.status(200).json({ reply });

  } catch (error) {
    console.error("❌ שגיאה בשרת:", error);
    res.status(500).json({ reply: "התרחשה שגיאה פנימית. נסי שוב מאוחר יותר." });
  }
}
