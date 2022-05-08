// https://github.com/influxdata/influxdb/blob/4f5ff962d69a84f7a6970b02f9e79b09dbad21fe/ui/cypress/e2e/queryBuilder.test.ts 

// blob: 4f5ff962d69a84f7a6970b02f9e79b09dbad21fe 

// project_name: influxdata/influxdb 

// flaky_file: /ui/cypress/e2e/queryBuilder.test.ts 

// test_affected: https://github.com/influxdata/influxdb/blob/4f5ff962d69a84f7a6970b02f9e79b09dbad21fe/ui/cypress/e2e/queryBuilder.test.ts 
// start_line:  91 
// end_line:  146 
describe('from the Dashboard view', () => {
  beforeEach(() => {
    cy.get('@org').then((org: Organization) => {
      cy.createDashboard(org.id).then(({ body }) => {
        cy.createCell(body.id).then(cellResp => {
          const dbID = body.id
          const orgID = org.id
          const cellID = cellResp.body.id
          cy.createView(dbID, cellID)
          cy.wrap({ orgID, dbID, cellID }).as('resourceIDs')
        })
      })
    })
  })

  it("creates a query, edits the query, edits the cell's default name, edits it again, submits with the keyboard, then chills", () => {
    cy.get<ResourceIDs>('@resourceIDs').then(({ orgID, dbID, cellID }) => {
      cy.visit(`orgs/${orgID}/dashboards/${dbID}/cells/${cellID}/edit`)
    })

    // build query
    cy.contains('mem').click('topLeft') // users sometimes click in random spots
    cy.contains('cached').click('bottomLeft')
    cy.contains('thrillbo-swaggins').click('left')
    cy.contains('sum').click()

    cy.getByTestID('empty-graph--no-queries').should('exist')
    cy.contains('Submit').click()
    cy.getByTestID('giraffe-layer-line').should('exist')
    cy.getByTestID('overlay')
      .contains('Name this Cell')
      .click()
    cy.get('[placeholder="Name this Cell"]').type('A better name!')
    cy.get('.veo-contents').click() // click out of inline editor
    cy.getByTestID('save-cell--button').click()

    // A race condition exists between saving the cell's updated name and re-opening the cell.
    // Will replace this with a cy.wait(@updateCell) when Cypress supports
    // waiting on window.fetch responses: https://github.com/cypress-io/cypress/issues/95
    // resolves: https://github.com/influxdata/influxdb/issues/16141

    cy.get<ResourceIDs>('@resourceIDs').then(({ orgID, dbID, cellID }) => {
      cy.visit(`orgs/${orgID}/dashboards/${dbID}/cells/${cellID}/edit`)
    })

    cy.getByTestID('giraffe-layer-line').should('exist')
    cy.getByTestID('overlay')
      .contains('A better name!')
      .click()

    cy.get('[placeholder="Name this Cell"]').type(
      "Uncle Moe's Family Feedbag{enter}"
    )
    cy.getByTestID('save-cell--button').click()
  })
})
