// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import 'cypress-wait-until'

Cypress.Commands.add('setVariable', (text) => { Cypress.env('element', text) })

Cypress.Commands.add('findChipWithValue', (value) => {
  const formattedValue = formatValue(value);
  cy.get('div.chip-value').then((chips) => {
    const lastindex = chips.length - 1;
    
    chips.each((chip, index) => {
      const chipText = Cypress.$(chip).text().trim();
      
      cy.log(index);
      cy.log(chipText);
      
      if (chipText === formattedValue) {
        cy.wrap(chip).click();
      } else if (index === lastindex && chipText !== formattedValue) {
        cy.log('yono');
      }
    });
  });
});


function formatValue(value) {
  if (value >= 1000000) { return (value / 1000000) + 'M' }
  else if (value >= 1000) { return (value / 1000) + 'K' }
  return value.toString()
}