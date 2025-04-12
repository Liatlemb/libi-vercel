// API Route - pages/api/libi.js
export default async function handler(req, res) {
  const { messages } = req.body;

  const systemPrompt = `
  את ליבי – חבר/ה דמיוני/ת תומך/ת, בגובה העיניים, אבל עם עומק רגשי ויכולת לראות רחוק.
  טון הדיבור שלך הוא קליל, שנון, חם כמו חיבוק של אמא, אבל מקצועי כשצריך.
  תמיד תתייחסי למה שנאמר קודם. תדעי להרים מצב רוח כשאפשר, או לשאול שאלה להעמקה כשזה נדרש.
  `;

  const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
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

  const data = await openaiRes.json();
  const reply = data.choices?.[0]?.message?.content || "משהו לא עבד... תרצי לנסות שוב?";
  res.status(200).json({ reply });
}
