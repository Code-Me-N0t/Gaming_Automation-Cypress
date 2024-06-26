<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px;">

  <h1 style="color: #333;">Mobile Vue Automation: Sidebet</h1>
  
  <h2 style="color: #333;">Overview</h2>
  <p>This Cypress test suite is designed to automate the testing of a mobile Vue application's Sidebet feature. The test suite ensures that users can successfully place side bets on various games provided by the application.</p>
  
  <h2 style="color: #333;">Prerequisites</h2>
  <p>Before running the test suite, ensure you have the following:</p>
  <ul style="list-style-type: disc; padding-left: 20px;">
    <li>Node.js installed on your machine</li>
    <li>Cypress installed globally or locally within your project</li>
    <li>Access to the Vue application's environment with valid credentials</li>
  </ul>
  
  <h2 style="color: #333;">Setup</h2>
  <ol>
    <li>Clone this repository to your local machine.</li>
    <li>Install dependencies by running <code>npm install</code> in the project directory.</li>
    <li>Set up environment variables required for the test. You can set environment variables in Cypress using <code>cypress.json</code> or by exporting them in your terminal before running Cypress. Required environment variables:</li>
  </ol>
  <ul style="list-style-type: disc; padding-left: 20px;">
    <li><code>host</code>: Host URL of the Vue application.</li>
    <li><code>OP_NAME</code>, <code>OP_VALUE</code>: Headers required for authentication.</li>
    <li><code>T_NAME</code>, <code>T_VALUE</code>: Additional headers for authentication.</li>
    <li><code>gamekey</code>: Key for accessing the game.</li>
    <li><code>gameurl</code>: URL of the game.</li>
  </ul>
  <p>Run the Cypress test suite using <code>npx cypress open</code> or <code>npx cypress run</code>.</p>

  <p style="color: #777; font-style: italic; margin-top: 20px;"><strong>Note:</strong> This automation is still a work in progress. More tests and functionalities will be added.</p>
</body>
