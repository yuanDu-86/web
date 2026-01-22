export default async function handler(req, res) {
    const { question, guaName, guaMeaning } = req.body;
    const API_KEY = process.env.AI_API_KEY; // 从服务器环境变量读取，前端不可见

    const prompt = `你是一位易经大师。用户问：${question}。得卦：${guaName}。含义：${guaMeaning}。请给出150字以内的建议。`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });
        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        res.status(200).json({ answer: text });
    } catch (error) {
        res.status(500).json({ error: "AI 响应失败" });
    }
}