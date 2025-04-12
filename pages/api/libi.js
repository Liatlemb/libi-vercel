export default async function handler(req, res) {
  const { messages } = req.body;
  const userMessage = messages[messages.length - 1].content;

  const response = await fetch("https://api-inference.huggingface.co/models/google/flan-t5-small", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: userMessage
    }),
  });

  const data = await response.json();

  // 🟡 הדפסת התוצאה בלוגים של Vercel
  console.log("🔍 HuggingFace Response:", data);

  const reply = data?.[0]?.generated_text || "מצטערת, לא הצלחתי להבין...";

  res.status(200).json({ reply });
}
