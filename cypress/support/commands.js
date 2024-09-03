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

Cypress.Commands.add('highlight', { prevSubject: 'element' }, (subject) => {
  cy.wrap(subject).then($el => {
    const origColor = $el.css('background-color');
    $el.css('background-color', 'yellow');
    setTimeout(() => {
      $el.css('background-color', origColor);
    }, 200);
  });
});
  
Cypress.Commands.add('setVariable', (text) => { Cypress.env('element', text) })

Cypress.Commands.add('editChip', (value) => {
  const desiredAmount = formatValue(value);

  cy.get('div.chip-value').should('be.visible').then((chips) => {
    let chipFound = false;
    const lastindex = chips.length - 1;

    chips.each((index, chip) => {
      const chipText = Cypress.$(chip).text().trim();

      cy.log(`Index: ${index}`);
      cy.log(`Chip Text: ${chipText}`);

      if (chipText === desiredAmount) {
        chipFound = true;
        cy.wrap(chip)
          .highlight()
          .click();
        return false;
      } else if (index === lastindex && !chipFound) {
        cy.get('div.chip-edit')
          .should('be.visible')
          .highlight()
          .click();

        cy.get('div.amonut').should('be.visible').then((innerChips) => {
          let innerChipFound = false;
          const innerLastIndex = innerChips.length - 1;

          innerChips.each((innerIndex, innerChip) => {
            const innerChipText = Cypress.$(innerChip).text().trim();

            cy.log(`Inner Index: ${innerIndex}`);
            cy.log(`Inner Chip Text: ${innerChipText}`);

            if (innerChipText === desiredAmount) {
              innerChipFound = true;
              cy.wrap(innerChip)
                .highlight()
                .click();
              return false;
            } else if (innerIndex === innerLastIndex && !innerChipFound) {
              cy.get('button.edit-btn')
              .should('be.visible')
              .highlight()
              .click()
              
              cy.get("input[aria-label='Edit Chips']")
              .should('be.visible')
              .highlight()
              .clear()
              .type(desiredAmount)

              cy.get('button.edit-btn')
              .eq(0)
              .should('be.visible')
              .highlight()
              .click()

              cy.get('div.amount-format > span')
              .highlight()
              .invoke('text')
              .then((msg_validation) => {
                cy.log(msg_validation)
                expect(msg_validation).to.equal('Successfully change the chip amount')
              })

              cy.get('div.close-wrap')
              .highlight()
              .click()
            }
          })
        })
      }
    })
  })
})

function formatValue(value) {
  if (value >= 1000000) {
    return (value / 1000000) + 'M';
  } else if (value >= 1000) {
    return (value / 1000) + 'K';
  }
  return value.toString();
}

Cypress.Commands.add('navigateSidebet', () => {
  cy.get('div#btn-tips')
    .highlight()
    .click('center')

  cy.get('div#sidebar>.container', {timeout: 10000})
    .should('be.visible')
  
  cy.get('div.v-tabs__wrapper div:nth-child(3)')
    .highlight()
    .click('center')
})

Cypress.Commands.add('showToast', (message) => {
  cy.window().then((win) => {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%) translateY(-100%)';
    toast.style.backgroundColor = 'rgba(250, 250, 250, 0.9)';
    toast.style.color = 'green';
    toast.style.padding = '10px 5px';
    toast.style.borderRadius = '3px';
    toast.style.borderLeft = '10px solid green';
    toast.style.zIndex = '9999';
    toast.style.fontWeight = 'bold';
    toast.style.fontFamily = 'Arial, sans-serif';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.5s, transform 0.5s';
    toast.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
    toast.style.display = 'flex';
    toast.style.minWidth = 'fit-content';
    toast.style.maxWidth = '250px';
    toast.style.textAlign = 'left';
    win.document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 10);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(-100%)';
      toast.addEventListener('transitionend', () => {
        toast.remove();
      });
    }, 3000);
  });
});

Cypress.Commands.add('getBalance', () => {
  cy.get('div.balance')
    .invoke('text')
    .then((balance) => {
        cy.setVariable(balance)
    })
})

Cypress.Commands.add('betIngame', () => {
  cy.get('#sidebar > .close')
  .should('be.visible')
  .highlight()
  .click()

  cy.get('div#game-content')
  .should('be.visible', {timeout: 3000})
  
  cy.get('div#bet-msg-toast', { timeout: 30000 })
  .should('not.contain', 'Shuffling', {timeout: 120000})

  cy.get('div.Repeat', {timeout: 60000})
  .should('be.visible', {timeout: 60000})
  .highlight()
  .click()

  cy.get('div.Confirm')
  .highlight()
  .click()
  
  cy.get('div#bet-msg-toast', {timeout: 20000})
  .should('contain.text', 'No More Bets!', {timeout: 20000})
  
  cy.get('div#bet-msg-toast', {timeout: 150000})
  .should('contain.text', 'Please Place Your Bet!')
})

Cypress.Commands.add('waitForTimer', (selector) => {
  const checkTimerEqualsZero = ($el) => {
    const timerValue = parseInt($el.text().trim(), 10);

    if (timerValue === 0) {
      cy.log(`Timer value is ${timerValue}, now waiting for it to be greater than zero...`);
      checkTimerGreaterThanZero($el);
    } else {
      cy.log(`Timer value is ${timerValue}, waiting for it to be zero...`);
      cy.wait(1000).then(() => {
        cy.get(selector).then(checkTimerEqualsZero);
      });
    }
  };

  const checkTimerGreaterThanZero = ($el) => {
    const timerValue = parseInt($el.text().trim(), 10);

    if (timerValue > 0) {
      cy.log(`Timer value is now greater than zero: ${timerValue}`);
      return;
    } else {
      cy.log(`Timer value is ${timerValue}, waiting for it to be greater than zero...`);
      cy.wait(500).then(() => {
        cy.get(selector).then(checkTimerGreaterThanZero);
      });
    }
  };

  cy.get(selector).then(checkTimerEqualsZero);
});
