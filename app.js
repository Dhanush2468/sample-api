const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs'); // Import the fs module for file operations
const app = express();

app.use(bodyParser.json());

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
app.get('/data', (req, res) => {
  const data = readData();
  res.json(data);
});

// POST method to add data
app.post('/data', (req, res) => {
  const newItem = req.body;
  const data = readData();
  data.push(newItem);
  writeData(data); // Write updated data to the JSON file
  res.json({ message: 'Data added successfully' });
});

// DELETE method to remove data
app.delete('/data/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const data = readData();
  if (index >= 0 && index < data.length) {
    const deletedItem = data.splice(index, 1);
    writeData(data); // Write updated data to the JSON file
    res.json({ message: `Item at index ${index} deleted`, deletedItem });
  } else {
    res.status(400).json({ error: 'Index out of range' });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
