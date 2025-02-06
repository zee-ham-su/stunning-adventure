import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

function isPrime(num) {
  if (num <= 1) return false;
  if (num <= 3) return true;

  if (num % 2 === 0 || num % 3 === 0) return false;

  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }

  return true;
}

function isPerfect(num) {
  let sum = 1;
  for (let i = 2; i * i <= num; i++) {
    if (num % i === 0) {
      if (i * i !== num) sum = sum + i + num / i;
      else sum = sum + i;
    }
  }
  return sum === num && num !== 1;
}

function isArmstrong(num) {
  let sum = 0;
  let temp = Math.abs(num);
  const digits = temp.toString().length;

  while (temp > 0) {
    const digit = temp % 10;
    sum += Math.pow(digit, digits);
    temp = Math.floor(temp / 10);
  }

  return sum === Math.abs(num);
}

function digitSum(num) {
  return Math.abs(num)
    .toString()
    .split('')
    .reduce((acc, curr) => acc + parseInt(curr), 0);
}

app.get('/api/classify-number', async (req, res) => {
  const { number } = req.query;

  if (!number || isNaN(number)) {
    return res.status(400).json({ number, error: true });
  }

  const num = parseInt(number, 10);

  const isPrimeNumber = isPrime(num);
  const isPerfectNumber = isPerfect(num);
  const isArmstrongNumber = isArmstrong(num);
  const isEven = num % 2 === 0;
  const properties = [];

  if (isArmstrongNumber) properties.push('armstrong');
  properties.push(isEven ? 'even' : 'odd');

  try {
    const funFactResponse = await axios.get(`http://numbersapi.com/${num}/math`);
    const funFact = funFactResponse.data;

    res.json({
      number: num,
      is_prime: isPrimeNumber,
      is_perfect: isPerfectNumber,
      properties,
      digit_sum: digitSum(num),
      fun_fact: funFact,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fun fact' });
  }
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});