# Mobile Vue Automation: Sidebet
# Overview
This Cypress test suite is designed to automate the testing of a mobile Vue application's Sidebet feature. The test suite ensures that users can successfully place side bets on various games provided by the application.

# Prerequisites
Before running the test suite, ensure you have the following:

Node.js installed on your machine
Cypress installed globally or locally within your project
Access to the Vue application's environment with valid credentials
# Setup
Clone this repository to your local machine.
Install dependencies by running npm install in the project directory.
Set up environment variables required for the test. You can set environment variables in Cypress using cypress.json or by exporting them in your terminal before running Cypress. Required environment variables:
host: Host URL of the Vue application.
OP_NAME, OP_VALUE: Headers required for authentication.
T_NAME, T_VALUE: Additional headers for authentication.
gamekey: Key for accessing the game.
gameurl: URL of the game.
Run the Cypress test suite using npx cypress open or npx cypress run.
