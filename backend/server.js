// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();

const corsOptions = {
  origin: 'https://genevis.org', 
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
const PORT = 4000;

let visitorCount = 0;

// Load visitor count from a file
try {
  const data = fs.readFileSync('visitorCount.json', 'utf8');
  visitorCount = JSON.parse(data).count || 0;
} catch (error) {
  console.log('No visitorCount.json found, starting from 0.');
}

// Endpoint to get visitor count
app.get('/api/visitor-count', (req, res) => {
  res.json({ count: visitorCount });
});

// Endpoint to increment visitor count
app.post('/api/visitor-count', (req, res) => {
  visitorCount++;
  fs.writeFileSync('visitorCount.json', JSON.stringify({ count: visitorCount }));
  res.json({ count: visitorCount });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
