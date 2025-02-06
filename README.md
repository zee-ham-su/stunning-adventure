# Number Classification API

This API takes a number and returns interesting mathematical properties about it, along with a fun fact.

## Features

- Determines if a number is prime
- Determines if a number is perfect
- Identifies Armstrong numbers
- Calculates digit sum
- Fetches fun math facts from Numbers API
- Handles CORS
- Returns responses in JSON format

## API Specification

### Endpoint

```
GET /api/classify-number?number={number}
```

### Success Response (200 OK)

```json
{
    "number": 371,
    "is_prime": false,
    "is_perfect": false,
    "properties": ["armstrong", "odd"],
    "digit_sum": 11,
    "fun_fact": "371 is an Armstrong number because 3^3 + 7^3 + 1^3 = 371"
}
```

### Error Response (400 Bad Request)

```json
{
    "number": "alphabet",
    "error": true
}
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```

For development with auto-reload:
```bash
npm run dev
```


## Technical Details

- Built with Node.js and Express
- Uses Numbers API for fun facts
- CORS enabled
- Input validation and error handling
- Response time < 500ms

## Properties Combinations

The API returns the following possible combinations for the properties field:
- `["armstrong", "odd"]` - if the number is both an Armstrong number and odd
- `["armstrong", "even"]` - if the number is an Armstrong number and even
- `["odd"]` - if the number is not an Armstrong number but is odd
- `["even"]` - if the number is not an Armstrong number but is even