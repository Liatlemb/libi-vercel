import React, { useState } from 'react';

const questions = [
  "מה גרם לך לחייך היום?",
  "איזה זיכרון פתאום עלה לך בלי סיבה?",
  "מה הגוף שלך מרגיש עכשיו?",
  "מה היית רוצה שמישהו יגיד לך היום?",
  "מה היה רגע קטן שהרגשת בו חיים?"
];

export default function LibiChat() {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'ברוכים הבאים לליבי – חבר מעולם אחר 💛 האפליקציה נוצרה על ידי ליאת למברגר, ומיועדת בדיוק לך. מאחלת לך מסע נעים ומרפא עם החבר החדש שלך – ליבי.' },
    { role: 'system', content: '🛡️ כל מה שתכתבי כאן יישאר בינך לבין ליבי. זו שיחה פרטית, בטוחה, ואת לא צריכה להיות מושלמת. רק להיות את.' },
    { role: 'system', content: 'היי! אני ליבי 💛 חבר מעולם אחר. מה שלומך היום?' },
    { role: 'system', content: questions[Math.floor(Math.random() * questions.length)] }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/libi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });

      const data = await response.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      setMessages([...newMessages, { role: 'assistant', content: "מצטערת, קרתה תקלה. רוצה לנסות שוב?" }]);
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px", fontFamily: "sans-serif", direction: "rtl" }}>
      <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "16px", backgroundColor: "#f9f9f9" }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            textAlign: m.role === 'user' ? 'right' : 'left',
            margin: "8px 0",
            whiteSpace: "pre-wrap"
          }}>
            <strong>{m.role === 'user' ? 'את' : 'ליבי'}: </strong>{m.content}
          </div>
        ))}
        <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="כתבי לי משהו מהלב..."
            disabled={loading}
            style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            style={{
              padding: "8px 16px",
              backgroundColor: "#ffcc00",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            שלח
          </button>
        </div>
      </div>
    </div>
  );
}
