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
  const limit = Math.sqrt(num);
  for (let i = 2; i <= limit; i++) {
    if (num % i === 0) return false;
  }
  return true;
}

function isPerfect(num) {
  if (num <= 1) return false;
  const limit = Math.sqrt(num);
  let sum = 1;
  for (let i = 2; i <= limit; i++) {
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
  timeout: 2000, // Increased to 2 seconds
  headers: {
    'Accept': 'text/plain'
  }
});

// Main endpoint
app.get('/api/classify-number', async (req, res) => {
  const numberStr = req.query.number;
  const number = parseInt(numberStr);

  // Input validation
  if (!numberStr || isNaN(number) || number > Number.MAX_SAFE_INTEGER || number < Number.MIN_SAFE_INTEGER) {
    return res.status(400).json({
      number: numberStr,
      error: true
    });
  }
  try {
    // Calculate all properties first
    const result = {
      number,
      is_prime: isPrime(number),
      is_perfect: isPerfect(number),
      properties: getProperties(number),
      digit_sum: digitSum(number)
    };

    try {
      // Fetch fun fact from Numbers API with timeout
      const response = await numbersApi.get(`http://numbersapi.com/${number}/math`);
      result.fun_fact = response.data;
    } catch (apiError) {
      // Use a fallback fun fact if the API request fails
      result.fun_fact = `${number} is an interesting number in mathematics.`;
    }

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

export default app;