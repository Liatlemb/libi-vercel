import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { messages } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0.7
      })
    });

    const data = await response.json();

    const reply = data?.choices?.[0]?.message?.content || "מצטערת, לא הצלחתי להבין. רוצה לנסח שוב?";
    res.status(200).json({ reply });
  } catch (error) {
    console.error("שגיאה בתקשורת עם OpenAI:", error);
    res.status(500).json({ reply: "מצטערת, משהו השתבש. רוצה לנסות שוב?" });
  }
}
