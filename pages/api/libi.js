import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { messages } = req.body;
  const prompt = messages[messages.length - 1]?.content || "שלום";
  const token = process.env.HUGGINGFACE_API_KEY;

  if (!token) {
    console.error("❌ Missing Hugging Face API token.");
    return res.status(500).json({ reply: "❌ חסר טוקן Hugging Face." });
  }

  try {
    const hfResponse = await fetch("https://api-inference.huggingface.co/models/google/flan-t5-small", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `ענה בעברית, בטון תומך כמו חבר טוב: ${prompt}`
      })
    });

    const data = await hfResponse.json();
    console.log("🧠 HuggingFace response:", JSON.stringify(data));

    let reply = data?.[0]?.generated_text?.trim();

    if (!reply) {
      reply = "מצטערת, לא הצלחתי להבין. רוצה לנסח שוב?";
    }

    res.status(200).json({ reply });

  } catch (error) {
    console.error("🔥 HuggingFace API error:", error);
    res.status(500).json({ reply: "מצטערת, קרתה תקלה טכנית. רוצה לנסות שוב?" });
  }
}
