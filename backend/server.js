import express from 'express';
import cors from 'cors';

app.use(cors({ origin: '*' })); 
const app = express();
const PORT = 3000; 


app.use(cors());
app.use(express.json());


app.post('/bfhl', (req, res) => {
    const { data } = req.body;

    if (!data) {
        return res.status(400).json({ is_success: false, error: "Missing 'data' field" });
    }

    const numbers = data.filter(item => !isNaN(item));
    const alphabets = data.filter(item => /^[a-zA-Z]$/.test(item));
    const highest_alphabet = alphabets.length ? [alphabets.sort().reverse()[0]] : [];

    res.json({
        is_success: true,
        user_id: "john_doe_17091999",
        email: "john@xyz.com",
        roll_number: "ABCD123",
        numbers,
        alphabets,
        highest_alphabet
    });
});


app.get('/bfhl', (req, res) => {
    res.json({ operation_code: 1 });
});


app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));