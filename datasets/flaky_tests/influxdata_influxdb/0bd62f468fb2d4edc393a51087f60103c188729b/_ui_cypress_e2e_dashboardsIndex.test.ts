// https://github.com/influxdata/influxdb/blob/0bd62f468fb2d4edc393a51087f60103c188729b/ui/cypress/e2e/dashboardsIndex.test.ts 

// blob: 0bd62f468fb2d4edc393a51087f60103c188729b 

// project_name: influxdata/influxdb 

// flaky_file: /ui/cypress/e2e/dashboardsIndex.test.ts 

// test_affected: https://github.com/influxdata/influxdb/blob/0bd62f468fb2d4edc393a51087f60103c188729b/ui/cypress/e2e/dashboardsIndex.test.ts 
// start_line:  54 
// end_line:  73 
it('can create a dashboard from a Template', () => {
  cy.getByTestID('dashboard-card').should('have.length', 0)
  cy.get<Organization>('@org').then(({ id }) => {
    cy.createDashboardTemplate(id)
  })

  cy.get('.page-header--container')
    .contains('Create')
    .click()

  cy.getByTestID('dropdown--item From a Template').click()

  cy.getByTestID('card-select-Bashboard-Template').click()

  cy.getByTestID('template-panel').should('exist')

  cy.getByTestID('create-dashboard-button').click()

  cy.getByTestID('dashboard-card').should('have.length', 1)
})
