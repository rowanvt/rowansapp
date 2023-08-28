// Import the Express.js module
var express = require('express');
var axios = require('axios'); // Import the axios library

// Create an Express application
var app = express();

// Add the express.json() middleware to parse JSON payloads
app.use(express.json());

// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

// Define a route for the "/sample" page
app.get('/sample', (req, res) => {
  res.send('This is a sample page.');
});

// Define a route for handling webhook data
app.post('/webhook/:customerId', async (req, res) => {
  const customerId = req.params.customerId;
  const requestBody = req.body;

  console.log('Received webhook data:', requestBody); // Log incoming data

  // Destructure specific fields from the initial payload
  const { ResourcePermaKey, ResourceType, ActionType } = requestBody;

  // Construct the response body with the extracted fields and CustomerID
  const responseBody = {
    ResourcePermaKey,
    ResourceType,
    ActionType,
    CustomerID: customerId
  };

  console.log('Constructed response body:', responseBody); // Log response body

  // Process the webhook data for the specified customer
  // ...

  // Send the modified response back to the webhook
  res.json(responseBody);

  try {
    // Send the modified response to a specific URL
    const response = await axios.post('https://hooks.zapier.com/hooks/catch/5990666/351hlu5/', responseBody);
    console.log('Response sent to the specific URL:', response.data);
  } catch (error) {
    console.error('Error sending response to the specific URL:', error.message);
  }
});

// Define a 404 error handler
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Define the port to listen on
var PORT = 3000;

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
