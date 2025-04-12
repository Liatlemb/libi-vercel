import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      console.error("לא התקבל מערך הודעות תקין.");
      return res.status(400).json({ error: "Invalid request format." });
    }

    console.log("💬 הודעות נכנסות:", JSON.stringify(messages, null, 2));

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
      temperature: 0.75,
    });

    const reply = response.data.choices[0].message.content;

    console.log("🤖 תשובת GPT:", reply);

    res.status(200).json({ reply });
  } catch (error) {
    console.error("❌ שגיאה:", error?.response?.data || error.message);
    res.status(500).json({ error: "שגיאה בשיחה. נסי שוב מאוחר יותר." });
  }
}
