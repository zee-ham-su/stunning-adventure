import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Helper functions
function isArmstrong(num) {
  const digits = String(Math.abs(num)).split('');
  const power = digits.length;
  const sum = digits.reduce((acc, digit) => acc + Math.pow(Number(digit), power), 0);
  return sum === Math.abs(num);
}

function isPrime(num) {
  if (Math.abs(num) <= 1) return false;
  for (let i = 2; i <= Math.sqrt(Math.abs(num)); i++) {
    if (Math.abs(num) % i === 0) return false;
  }
  return true;
}

function isPerfect(num) {
  if (num <= 0) return false; // Perfect numbers are always positive
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
    .split("")
    .reduce((acc, digit) => acc + Number(digit), 0);
}

function getProperties(num) {
  const properties = [];
  if (isArmstrong(num)) properties.push("armstrong");
  if (isPrime(num)) properties.push("prime");
  if (isPerfect(num)) properties.push("perfect");
  properties.push(num % 2 === 0 ? "even" : "odd");
  return properties;
}

// Main endpoint
app.get('/api/classify-number', async (req, res) => {
  const numberStr = req.query.number;
  const number = Number(numberStr);

  // Input validation: Only accept integers, reject decimals
  if (!numberStr || isNaN(number) || !Number.isInteger(number)) {
    return res.status(400).json({
      number: numberStr,
      error: true,
    });
  }

  try {
    // Fetch fun fact (only for positive numbers)
    let funFact = "Fun facts are only available for positive numbers.";
    if (number >= 0) {
      const response = await axios.get(`http://numbersapi.com/${number}/math`);
      funFact = response.data;
    }

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
    console.error('Error fetching fun fact:', error.message);
    res.status(500).json({
      number,
      error: true,
      message: 'Internal server error. Could not retrieve fun fact.'
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

export default app; // For testing purposes
