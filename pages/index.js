// אפליקציית ווב בסיסית עם צ'אט של "ליבי – חבר מעולם אחר"
// רצה בדפדפן – מציגה שאלה יומית ומנהלת שיחה עם GPT בטון אימהי-חברי

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <Card>
        <CardContent className="space-y-2">
          {messages.map((m, i) => (
            <div key={i} className={`text-${m.role === 'user' ? 'right' : 'left'}`}>{m.content}</div>
          ))}
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="כתבי לי משהו מהלב..."
              disabled={loading}
            />
            <Button onClick={handleSend} disabled={loading}>שלח</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
