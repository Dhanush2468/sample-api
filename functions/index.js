const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const router = express.Router();

let records = [];

// Function to read data from the JSON file
const readData = () => {
  try {
    const data = fs.readFileSync('data.json');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return [];
  }
};

// Function to write data to the JSON file
const writeData = (data) => {
  try {
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing data:', error);
  }
};

// GET method to retrieve data
router.get('/data', (req, res) => {
  const data = readData();
  res.json(data);
});

// POST method to add data
router.post('/data', (req, res) => {
  const newItem = req.body;
  const data = readData();
  data.push(newItem);
  writeData(data);
  res.json({ message: 'Data added successfully' });
});

// DELETE method to remove data
router.delete('/data/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const data = readData();
  if (index >= 0 && index < data.length) {
    const deletedItem = data.splice(index, 1);
    writeData(data);
    res.json({ message: `Item at index ${index} deleted`, deletedItem });
  } else {
    res.status(400).json({ error: 'Index out of range' });
  }
});

// Use the router for all routes
app.use('/.netlify/functions/api', router);

// Export the server as a serverless function
module.exports.handler = serverless(app);

// Listen for requests if not running in a serverless environment
if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
