import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000; 

// Middleware
app.use(cors({ origin: '*' })); 
app.use(express.json());

// POST API for processing data
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

// GET API
app.get('/bfhl', (req, res) => {
    res.json({ operation_code: 1 });
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));