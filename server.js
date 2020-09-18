const express = require('express');

/** Initialize App variable with express */
const app = express();

/** Create single endpoint to test out
 * Take a get request to '/'
 * Callback function with parameter (req, res)
 * Send data to the Browser */
app.get('/', (req, res) => res.send(`API running`));

/** Store the port value in a Variable
 * Process will look for an environment variable called PORT when we deploy it on Heroku
 * But Locally we want our server to run on PORT No. 5000
 * If there is no environment variable then our server will run on Port No. 5000    */
const PORT = process.env.PORT || 5000;

/** We want our app to listen on PORT assigned
 * Once it connects, it displays message that server is started
 */
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
