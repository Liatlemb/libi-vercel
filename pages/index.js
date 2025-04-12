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
    { role: 'system', content: 'ברוכים הבאים לליבי – חבר מעולם אחר 💛\nהאפליקציה נוצרה על ידי ליאת למברגר, ומיועדת בדיוק לך.\nמאחלת לך מסע נעים ומרפא עם החבר החדש שלך – ליבי.' },
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

    const response = await fetch('/api/libi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages })
    });

    const data = await response.json();
    setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ border: '1px solid #ccc', borderRadius: '12px', padding: '16px', backgroundColor: '#f9f9f9' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.role === 'user' ? 'right' : 'left', marginBottom: '8px' }}>
            {m.content}
          </div>
        ))}
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="כתבי לי משהו מהלב..."
            disabled={loading}
            style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <button onClick={handleSend} disabled={loading} style={{ padding: '8px 16px', borderRadius: '6px', backgroundColor: '#ffd700', border: 'none' }}>
            שלח
          </button>
        </div>
      </div>
    </div>
  );
}
