import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { messages } = req.body;
  const userMessage = messages[messages.length - 1]?.content || "היי";

  try {
    const hfResponse = await fetch(
      'https://api-inference.huggingface.co/models/avichr/heBERT-finetuned-sentiment',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: userMessage }),
      }
    );

    const result = await hfResponse.json();
    const label = result?.[0]?.label;

    let reply;
    switch (label) {
      case 'LABEL_0':
        reply = "נשמע שעובר עלייך משהו לא פשוט... אני פה איתך ❤️";
        break;
      case 'LABEL_1':
        reply = "תודה ששיתפת. רוצה להעמיק בזה קצת?";
        break;
      case 'LABEL_2':
        reply = "זה נשמע נהדר! הלב שלי מחייך יחד איתך ☀️";
        break;
      default:
        reply = "לא הצלחתי להבין. רוצה לנסח שוב?";
    }

    res.status(200).json({ reply });
  } catch (error) {
    console.error("HuggingFace Error:", error);
    res.status(500).json({ reply: "מצטערת, קרתה תקלה. רוצה לנסות שוב?" });
  }
}
