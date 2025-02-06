import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Helper functions
function isArmstrong(num) {
  const digits = String(num).split('');
  const power = digits.length;
  const sum = digits.reduce((acc, digit) => acc + Math.pow(Number(digit), power), 0);
  return sum === num;
}

function isPrime(num) {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

function isPerfect(num) {
  if (num <= 1) return false;
  let sum = 1;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) {
      sum += i;
      if (i !== num / i) sum += num / i;
    }
  }
  return sum === num;
}

function digitSum(num) {
  return String(num).split('').reduce((acc, digit) => acc + Number(digit), 0);
}

function getProperties(num) {
  const properties = [];

  if (isArmstrong(num)) {
    properties.push('armstrong');
  }

  properties.push(num % 2 === 0 ? 'even' : 'odd');

  return properties;
}

// Main endpoint
app.get('/api/classify-number', async (req, res) => {
  const numberStr = req.query.number;
  const number = parseInt(numberStr);

  // Input validation
  if (!numberStr || isNaN(number)) {
    return res.status(400).json({
      number: numberStr,
      error: true
    });
  }

  try {
    // Fetch fun fact from Numbers API
    const response = await axios.get(`http://numbersapi.com/${number}/math`);
    const funFact = response.data;

    const result = {
      number,
      is_prime: isPrime(number),
      is_perfect: isPerfect(number),
      properties: getProperties(number),
      digit_sum: digitSum(number),
      fun_fact: funFact
    };

    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      number,
      error: true,
      message: 'Internal server error'
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app; // For testing purposes