import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Helper functions
function isArmstrong(num) {
  const numStr = String(Math.abs(num));
  const power = numStr.length;
  const sum = numStr.split('').reduce((acc, digit) => acc + Math.pow(Number(digit), power), 0);
  return sum === Math.abs(num);
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
  return String(Math.abs(num))
    .split('')
    .reduce((acc, digit) => acc + Number(digit), 0);
}

function getProperties(num) {
  const properties = [];

  if (isArmstrong(num)) {
    properties.push('armstrong');
  }

  properties.push(num % 2 === 0 ? 'even' : 'odd');

  return properties;
}

// Create axios instance with timeout
const numbersApi = axios.create({
  timeout: 500 // 500ms timeout
});

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
    // Fetch fun fact from Numbers API with timeout
    const response = await numbersApi.get(`http://numbersapi.com/${number}/math`);
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
    // If it's a timeout error, return a generic fun fact
    if (error.code === 'ECONNABORTED') {
      return res.json({
        number,
        is_prime: isPrime(number),
        is_perfect: isPerfect(number),
        properties: getProperties(number),
        digit_sum: digitSum(number),
        fun_fact: `${number} is an interesting number in mathematics.`
      });
    }
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

export default app;