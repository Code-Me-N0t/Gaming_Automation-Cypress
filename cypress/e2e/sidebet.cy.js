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

        cy.get('div.table-card').eq(0).click()
        cy.get('div#bet-msg-toast', { timeout: 30000 })
        .should('not.contain', 'Shuffling', {timeout: 120000})
    
        cy.get('div.bet-table.b')
        .click({timeout: 60000})
        cy.get('div.Confirm').click()
        cy.get('div#bet-msg-toast', {timeout: 20000})
        .should('contain.text', 'No More Bets!', {timeout: 20000})
        
        cy.get('div#bet-msg-toast', {timeout: 150000})
        .should('contain.text', 'Please Place Your Bet!')

        cy.get('div.balance')
        .invoke('text')
        .then((balance) => {
            cy.setVariable(balance)
        })

        cy.findChipWithValue(4)

        cy.get('div#btn-tips').click('center')
        cy.get('div#sidebar>.container', {timeout: 10000}).should('be.visible')
        cy.get('div.v-tabs__wrapper div:nth-child(3)').click('center')
    })

    // it('Edit Chip', () => {
        
    // })

    it('Sidebet Automation: Single Bet', () => {
        const balance = Cypress.env('element')
        cy.log(balance)

        cy.fixture('games').then((games) => {
            games.DT.forEach((value) => {
                cy.get('div.mini-table-card')
                .contains(value)
                .scrollIntoView()
                .should('not.contain', 'Shuffling', {timeout: 120000})
                .scrollIntoView()

                cy.get('div.mini-table-card')
                .contains(value)
                .parents('.mini-table-card')
                .find('div.card-bottom button:nth-child(2)', {timeout: 120000})
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
                .find('div.bet-action.offset-item0 > div', {timeout: 60000})
                .click({ timeout: 60000 })

                cy.get('div.mini-table-card')
                .contains(value)
                .parents('div.mini-table-card')
                .find('div.sidebar-msg')
                .should('contain.text', 'Bet Successful')
                .scrollIntoView()


                cy.get('div.close').click('left')

                cy.get('div.balance')
                .invoke('text')
                .then((newbalance) => {
                    expect(balance).to.not.equal(newbalance)
                })

            })
        })
    })
});
