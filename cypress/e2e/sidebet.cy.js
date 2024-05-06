/// <reference types="cypress" />

context('Mobile Vue Automation: Sidebet', () => {
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
                    username: 'QAUSERTEST1128',
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
                    cy.viewport('samsung-s10');
                    cy.intercept('GET', gameurl, (req) => {
                        req.headers['user-agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148';
                    }).as('gamePage');

                    cy.visit(gameurl, {timeout: 60000});
                    cy.document().then((doc) => {
                        const style = doc.createElement('style');
                        style.innerHTML = `::-webkit-scrollbar {display: none;}`
                        doc.head.appendChild(style);
                    });
                    cy.wait('@gamePage');
                    cy.get('div#pre-loading').should('be.visible')
                });
            });
        });
    });

    beforeEach('Bet Ingame First', () => {
        cy.get('div#lobby', { timeout: 10000 }).should('be.visible')
        cy.get('div#game-menu').should('be.visible')

        cy.get('div.table-card').eq(0).click()
        cy.get('div#game-content', { timeout: 30000 }).should('be.visible')
    
        cy.get('span.timer').invoke('text').then((timer) => {
            if(timer == 'CLOSED' || timer < 10){
                cy.contains('Please Place Your Bet!', {timeout: 60000}).should('exist')
            }
            cy.get('div.bet-table.b').should('not.be.disabled', {timeout: 60000}).click({timeout: 60000})
            cy.get('div.Confirm').click()
        })
        cy.get('div#btn-tips').click('center')
        cy.get('div#sidebar>.container', {timeout: 10000}).should('be.visible')
        cy.get('div.v-tabs__wrapper div:nth-child(3)').click('center')
    })

    it('Sidebet Automation: Single Bet', () => {
        cy.fixture('games').then((games) => {
            games.BACCARAT.forEach((value) => {
                cy.get('div.mini-table-card')
                .contains(value)
                .parents('div.mini-table-card')
                .should('not.contain', 'SHUFFLING', {timeout: 120000})
                .scrollIntoView()   
                .should('be.visible')

                cy.get('div.mini-table-card')
                .contains(value)
                .parents('.mini-table-card')
                .find('div.card-bottom button:nth-child(2)')
                .click({ timeout: 60000 })

                cy.get('div.mini-table-card')
                .contains(value)
                .parents('.mini-table-card')
                .find('div.bet-table-bottom', {timeout: 10000})
                .eq(1)
                .click()

                cy.get('div.mini-table-card')
                .contains(value)
                .parents('.mini-table-card')
                .find('div.offset-item0 > div', {timeout: 60000})
                .click({ timeout: 60000 })

                cy.get('div.mini-table-card')
                .contains(value)
                .parents('div.mini-table-card')
                .find('div.sidebar-msg')
                .should('contain.text', 'Bet Successful')
                .scrollIntoView()

                cy.get('div.mini-table-card')
                .contains(value)
                .parents('.mini-table-card')
                .find('div.card-bottom button:nth-child(2)', { timeout: 60000 })
            })
        })
    })
});
