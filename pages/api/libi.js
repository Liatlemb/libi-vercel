export default async function handler(req, res) {
  const { messages } = req.body;

  try {
    console.log("📡 שליחת הודעה ל־OpenAI:", JSON.stringify(messages, null, 2));

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

    console.log("✅ תשובה מ־OpenAI:", JSON.stringify(data, null, 2));

    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      throw new Error("לא התקבלה תשובה תקינה מהשרת");
    }

    res.status(200).json({ reply });
  } catch (error) {
    console.error("❌ שגיאה בשיחה עם OpenAI:", error.message || error);
    res.status(500).json({ reply: "ליבי: מצטערת, משהו השתבש. רוצה לנסות שוב?" });
  }
}
