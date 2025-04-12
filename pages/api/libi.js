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
        inputs: `Translate this message to Hebrew and answer warmly like a close friend: "${prompt}"`,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.9,
          top_p: 0.95
        }
      })
    });

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const errorText = await response.text();
      console.error("❌ Non-JSON response from Hugging Face:", errorText);
      return res.status(500).json({ reply: "ליבי: קרתה תקלה מול השרת. אפשר לנסות שוב?" });
    }

    const data = await response.json();
    const rawText = data?.[0]?.generated_text?.trim();

    const reply = rawText && rawText.length > 3
      ? rawText
      : "ליבי: לא הצלחתי להבין. רוצה לנסח שוב?";

    res.status(200).json({ reply });

  } catch (error) {
    console.error("🔥 HuggingFace error:", error);
    res.status(500).json({ reply: "ליבי: נתקלה בבעיה כללית. ננסה שוב?" });
  }
}
