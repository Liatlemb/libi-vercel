import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { messages } = req.body;
  const prompt = messages[messages.length - 1]?.content || "שלום";

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/google/flan-t5-large", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `Translate this to Hebrew and respond like a warm, supportive friend: ${prompt}`,
        parameters: {
          max_new_tokens: 120,
          temperature: 0.8
        }
      })
    });

    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      const errorText = await response.text();
      console.error("❌ HuggingFace returned non-JSON:", errorText);
      return res.status(500).json({ reply: "ליבי: נתקלה בבעיה מול השרת. ננסה שוב?" });
    }

    const data = await response.json();
    const reply = data?.[0]?.generated_text?.trim() || "ליבי: לא הצלחתי להבין. רוצה לנסח שוב?";
    res.status(200).json({ reply });

  } catch (error) {
    console.error("🔥 Error talking to HuggingFace:", error);
    res.status(500).json({ reply: "ליבי: הייתה שגיאה כללית. רוצה לנסות שוב?" });
  }
}
