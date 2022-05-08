//  https://github.com/influxdata/influxdb/blob/3b5d0a443e8c7302cfd5c31f1cefd1f16e950e6e/ui/cypress/e2e/dashboardsIndex.test.ts  

// blob: 3b5d0a443e8c7302cfd5c31f1cefd1f16e950e6e 

// project_name: influxdata/influxdb 

// flaky_file: /ui/cypress/e2e/dashboardsIndex.test.ts 

// test_affected:  https://github.com/influxdata/influxdb/blob/3b5d0a443e8c7302cfd5c31f1cefd1f16e950e6e/ui/cypress/e2e/dashboardsIndex.test.ts  
// start_line: 22 
// end_line: 38 
it('can create a dashboard from empty state', () => {
  cy.getByTestID('empty-dashboards-list').within(() => {
    cy.getByTestID('add-resource-dropdown--button').click()
  })

  cy.getByTestID('add-resource-dropdown--new')
    .click()
    .then(() => {
      cy.fixture('routes').then(({ orgs }) => {
        cy.get('@org').then(({ id }: Organization) => {
          cy.visit(`${orgs}/${id}/dashboards`)
        })
      })

      cy.getByTestID('dashboard-card').should('have.length', 1)
    })
})
// start_line: 54 
// end_line: 71 
it('can create a dashboard from a Template', () => {
  cy.getByTestID('dashboard-card').should('have.length', 0)
  cy.get('@org').then(({ id }: Organization) => {
    cy.createDashboardTemplate(id)
  })

  cy.getByTestID('add-resource-dropdown--button').click()

  cy.getByTestID('add-resource-dropdown--template').click()

  cy.getByTestID('template--Bashboard-Template').click()

  cy.getByTestID('template-panel').should('exist')

  cy.getByTestID('create-dashboard-button').click()

  cy.getByTestID('dashboard-card').should('have.length', 1)
})
