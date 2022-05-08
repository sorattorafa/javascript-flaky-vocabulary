// https://github.com/influxdata/influxdb/blob/f37ea3bfb8684ebdfa066ddf4d1cc1663a1e64cc/ui/cypress/e2e/buckets.test.ts 

// blob: f37ea3bfb8684ebdfa066ddf4d1cc1663a1e64cc 

// project_name: influxdata/influxdb 

// flaky_file: /ui/cypress/e2e/buckets.test.ts 

// test_affected: https://github.com/influxdata/influxdb/blob/f37ea3bfb8684ebdfa066ddf4d1cc1663a1e64cc/ui/cypress/e2e/buckets.test.ts 
// start_line:  63 
// end_line:  66 
it('Searching buckets', () => {
  cy.getByTestID('search-widget').type('tasks')
  cy.getByTestID('bucket-card').should('have.length', 1)
})
// start_line:  80 
// end_line:  90 
it('Sorting by Retention', () => {
  cy.getByTestID('retention-sorter').click()
  cy.getByTestID('bucket-card')
    .first()
    .contains('_tasks')

  cy.getByTestID('retention-sorter').click()
  cy.getByTestID('bucket-card')
    .first()
    .contains('defbuck')
})
