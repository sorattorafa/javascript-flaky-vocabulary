// https://github.com/influxdata/influxdb/blob/bba04e20b44dd0f8fd049d80f270424eb266533f/ui/cypress/e2e/explorer.test.ts 

// blob: bba04e20b44dd0f8fd049d80f270424eb266533f 

// project_name: influxdata/influxdb 

// flaky_file: /ui/cypress/e2e/explorer.test.ts 

// test_affected: https://github.com/influxdata/influxdb/blob/bba04e20b44dd0f8fd049d80f270424eb266533f/ui/cypress/e2e/explorer.test.ts 
// start_line:  604 
// end_line:  677 
describe.skip('visualize tables', () => {
  const numLines = 360

  beforeEach(() => {
    cy.flush()

    cy.signin().then(({ body }) => {
      const {
        org: { id },
        bucket,
      } = body
      cy.wrap(body.org).as('org')
      cy.wrap(bucket).as('bucket')

      // POST 360 lines to the server
      cy.writeData(lines(numLines))

      // start at the data explorer
      cy.fixture('routes').then(({ orgs, explorer }) => {
        cy.visit(`${orgs}/${id}${explorer}`)
      })
    })
  })

  it('can view table data & sort values numerically', () => {
    // build the query to return data from beforeEach
    cy.getByTestID(`selector-list m`).click()
    cy.getByTestID('selector-list v').click()
    cy.getByTestID(`selector-list tv1`).click()
    cy.getByTestID('selector-list sort').click()

    cy.getByTestID('time-machine-submit-button').click()

    cy.getByTestID('view-type--dropdown').click()
    cy.getByTestID(`view-type--table`).click()
    // check to see that the FE rows are NOT sorted with flux sort
    cy.get('.table-graph-cell__sort-asc').should('not.exist')
    cy.get('.table-graph-cell__sort-desc').should('not.exist')
    cy.getByTestID('_value-table-header')
      .should('exist')
      .then(el => {
        // get the column index
        const columnIndex = el[0].getAttribute('data-column-index')
        let prev = -Infinity
        // get all the column values for that one and see if they are in order
        cy.get(`[data-column-index="${columnIndex}"]`).each(val => {
          const num = Number(val.text())
          if (isNaN(num) === false) {
            expect(num > prev).to.equal(true)
            prev = num
          }
        })
      })
    cy.getByTestID('_value-table-header').click()
    cy.get('.table-graph-cell__sort-asc').should('exist')
    cy.getByTestID('_value-table-header').click()
    cy.get('.table-graph-cell__sort-desc').should('exist')
    cy.getByTestID('_value-table-header')
      .should('exist')
      .then(el => {
        // get the column index
        const columnIndex = el[0].getAttribute('data-column-index')
        let prev = Infinity
        // get all the column values for that one and see if they are in order
        cy.get(`[data-column-index="${columnIndex}"]`).each(val => {
          const num = Number(val.text())
          if (isNaN(num) === false) {
            expect(num < prev).to.equal(true)
            prev = num
          }
        })
      })
  })
})
