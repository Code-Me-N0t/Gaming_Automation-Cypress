context('OG LIVE | MOBILE VUE: Sidebet', () => {
  beforeEach(() => {
    const host = Cypress.env("host")
        const op_name = Cypress.env("OP_NAME")
        const op_value = Cypress.env("OP_VALUE")
        const t_name = Cypress.env("T_NAME")
        const t_value = Cypress.env("T_VALUE")
        const game_key = Cypress.env("gamekey")
        const game_url = Cypress.env("gameurl")

        const header = {
            [op_name]: op_value,
            [t_name]: t_value,
        }

        cy.request({
            method: 'GET',
            url: `${host}token`,
            headers: header,
        }).then((response) => {
            const token = response.body.data.token;

            header['X-Token'] = token;
            cy.request({
                method: 'GET',
                url: `${host}${game_key}`,
                headers: header,
                body: {
                    username: 'QATESTER1199',
                    betlimit: '201',
                },
            }).then((response) => {
                const gameKey = response.body.data.key

                cy.request({
                    method: 'GET',
                    url: `${host}${game_url}`,
                    headers: header,
                    qs: { key: gameKey },
                }).then((response) => {
                    const gameurl = response.body.data.url
                    cy.viewport('samsung-s10')
                    cy.intercept('GET', gameurl, (req) => {
                        req.headers['user-agent'] = Cypress.env("emulator")
                    }).as('gamePage')

                    cy.visit(gameurl, {timeout: 60000})
                    cy.document().then((doc) => {
                        const style = doc.createElement('style')
                        style.innerHTML = `::-webkit-scrollbar {display: none}`
                        doc.head.appendChild(style)
                    })
                    cy.wait('@gamePage')
                    cy.get('div#pre-loading').should('be.visible')
                })
            })
        })
  })

  beforeEach('Bet Ingame First', () => {
    cy.get('div#lobby', { timeout: 10000 }).should('be.visible')
    cy.get('div#game-menu').should('be.visible')

    cy.get('div.table-card')
    .eq(0)
    .highlight()
    .click()
    cy.get('div#bet-msg-toast', { timeout: 30000 })
    .should('not.contain', 'Shuffling', {timeout: 120000})

    cy.get('div.bet-table.b')
    .highlight()
    .click({timeout: 60000})
    cy.get('div.Confirm')
    .highlight()
    .click()
    cy.get('div#bet-msg-toast', {timeout: 20000})
    .should('contain.text', 'No More Bets!', {timeout: 20000})
    
    cy.get('div#bet-msg-toast', {timeout: 150000})
    .should('contain.text', 'Please Place Your Bet!')

    cy.getBalance()
  })

  it('Test Empty Bet Area', () => {
    cy.showToast('Test: Empty Bet Area')
    cy.editChip(201)
    cy.navigateSidebet()

    const balance = Cypress.env('element')
    cy.log(balance)

    cy.fixture('gametables').then((game) => {
        const gameType = Cypress.env('gameType') || 'DT';
        cy.wrap(game[gameType]).as('gameData');
      });
      
      cy.fixture('betareas').then((betareas) => {
        const gameType = Cypress.env('gameType') || 'DT';
        cy.wrap(betareas[gameType.toUpperCase()]).as('betareas');
      });
      
      cy.get('@gameData').each((game, index, $list) => {
      
        // Get the betareas from the alias
        cy.get('@betareas').then((betareas) => {
          const betAreaKeys = Object.keys(betareas);
          const randomBetArea = betAreaKeys[Math.floor(Math.random() * betAreaKeys.length)];
          const selector = betareas[randomBetArea];
      
          cy.log(`Placing bet on ${randomBetArea} using selector ${selector}`);
      
          cy.get('div.mini-table-card')
            .contains(game)
            .scrollIntoView()
            .should('not.contain', 'Shuffling', { timeout: 120000 })
            .scrollIntoView();
      
          cy.get('div.mini-table-card')
            .contains(game)
            .parents('div.mini-table-card')
            .find('div.card-bottom button:nth-child(2)', { timeout: 120000 })
            .highlight()
            .click({ timeout: 60000 });
      
          cy.get(selector)
          .scrollIntoView()
          .should('be.visible')
          .click()
          
          // Test 1.1: Assert bet is placed before the round ends
          cy.get(selector)
          .should('be.visible')
          .find('div.user-bet-chip')
          .invoke('text')
          .then((bet) => {
            expect(bet.trim()).to.equal('201')
          })

          // Test 1.2: Assert bet was wiped after the round ends
          cy.get('div.mini-table-card')
          .contains(game)
          .parents('div.mini-table-card')
          .find('div.table-time')
          .scrollIntoView()
          .highlight()
          .as('timer')

          cy.waitForTimer('@timer')

          cy.get('div.mini-table-card')
          .contains(game)
          .parents('div.mini-table-card')
          .find('div.card-bottom button:nth-child(2)', { timeout: 120000 })
          .scrollIntoView()
          .highlight()
          .click({ timeout: 60000 });

          cy.get(selector)
          .scrollIntoView()
          .should('be.visible')
          .find('div.user-bet-chip')
          .invoke('text')
          .then((bet) => {
            expect(bet.trim()).to.not.equal('201')
          })          

          if (index === $list.length - 1) {
            cy.log('This is the last game');
        
            cy.get('#sidebar > .close')
              .should('be.visible')
              .highlight()
              .click();
        
            cy.get('div#btn-exit')
              .should('be.visible')
              .highlight()
              .click();
          } else {
            cy.betIngame();
            cy.navigateSidebet();
          }
        })
      })      
  })

})
//   it('Sidebet Automation: Single Bet', () => {
//     const balance = Cypress.env('element')
//     cy.log(balance)

//     cy.fixture('games').then((games) => {
//       games.DT.forEach((value) => {
//         cy.get('div.mini-table-card')
//         .contains(value)
//         .scrollIntoView()
//         .should('not.contain', 'Shuffling', {timeout: 120000})
//         .scrollIntoView()

//         cy.get('div.mini-table-card')
//         .contains(value)
//         .parents('.mini-table-card')
//         .find('div.card-bottom button:nth-child(2)', {timeout: 120000})
//         .highlight()
//         .click({ timeout: 60000 })

//         cy.get('div.mini-table-card')
//         .contains(value)
//         .parents('.mini-table-card')
//         .find('div.bet-table-bottom', {timeout: 10000})
//         .eq(1)
//         .highlight()
//         .click()

//         cy.get('div.mini-table-card')
//         .contains(value)
//         .parents('.mini-table-card')
//         .find('div.bet-action.offset-item0 > div', {timeout: 60000})
//         .highlight()
//         .click({ timeout: 60000 })

//         cy.get('div.mini-table-card')
//         .contains(value)
//         .parents('div.mini-table-card')
//         .find('div.sidebar-msg')
//         .should('contain.text', 'Bet Successful')
//         .scrollIntoView()


//         cy.get('div.close')
//         .highlight()
//         .click('left')

//         cy.get('div.balance')
//         .invoke('text')
//         .then((newbalance) => {
//             cy.log(balance)
//             cy.log(newbalance)
//             let expected_bet = balance - newbalance
//             cy.log(expected_bet)
//             expect(balance).to.not.equal(newbalance)
//         })
//       })
//     })
//   })