import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { messages } = req.body;

  const prompt = messages[messages.length - 1]?.content || "שלום";

  const token = process.env.HUGGINGFACE_API_KEY;

  if (!token) {
    return res.status(500).json({ reply: "❌ טוקן Hugging Face חסר. נא לבדוק את ההגדרות." });
  }

  try {
    const hfResponse = await fetch("https://api-inference.huggingface.co/models/google/flan-t5-small", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `ענה בעברית, בטון חם, תומך, כמו חבר טוב: ${prompt}`
      })
    });

    const data = await hfResponse.json();

    if (!Array.isArray(data) || !data[0]?.generated_text) {
      return res.status(500).json({ reply: "מצטערת, משהו השתבש. רוצה לנסות שוב?" });
    }

    const reply = data[0].generated_text.trim();
    res.status(200).json({ reply });

  } catch (error) {
    console.error("HuggingFace API error:", error);
    res.status(500).json({ reply: "מצטערת, קרתה תקלה טכנית. רוצה לנסות שוב?" });
  }
}
