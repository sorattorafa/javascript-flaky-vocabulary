// https://github.com/influxdata/influxdb/blob/63b81291887f87e821ba6e8c250f1efaf920d57b/ui/cypress/e2e/explorer.test.ts 

// blob: 63b81291887f87e821ba6e8c250f1efaf920d57b 

// project_name: influxdata/influxdb 

// flaky_file: /ui/cypress/e2e/explorer.test.ts 

// test_affected: https://github.com/influxdata/influxdb/blob/63b81291887f87e821ba6e8c250f1efaf920d57b/ui/cypress/e2e/explorer.test.ts 
// start_line:  553 
// end_line:  633 
describe('visualize with 360 lines', () => {
  const numLines = 360
  beforeEach(() => {
    // POST 360 lines to the server
    cy.writeData(lines(numLines))
  })

  it('can view time-series data', () => {
    // build the query to return data from beforeEach
    cy.getByTestID(`selector-list m`).click()
    cy.getByTestID('selector-list v').click()
    cy.getByTestID(`selector-list tv1`).click()
    cy.getByTestID('selector-list max').click()

    cy.getByTestID('time-machine-submit-button').click()

    // cycle through all the visualizations of the data
    VIS_TYPES.forEach(({ type }) => {
      cy.getByTestID('view-type--dropdown').click()
      cy.getByTestID(`view-type--${type}`).click()
      cy.getByTestID(`vis-graphic--${type}`).should('exist')
      if (type.includes('single-stat')) {
        cy.getByTestID('single-stat--text').should('contain', `${numLines}`)
      }
    })

    // view raw data table
    cy.getByTestID('raw-data--toggle').click()
    cy.getByTestID('raw-data-table').should('exist')
    cy.getByTestID('raw-data--toggle').click()
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
    cy.getByTestID('_value-table-header').then(el => {
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
  })
// start_line:  653 
// end_line:  679 
it('should set the default bucket in the dropdown to the selected bucket', () => {
  cy.get('.cf-overlay--dismiss').click()
  cy.getByTestID('selector-list defbuck').click()
  cy.getByTestID('delete-data-predicate')
    .click()
    .then(() => {
      cy.getByTestID('dropdown--button').contains('defbuck')
      cy.get('.cf-overlay--dismiss').click()
    })
    .then(() => {
      cy.getByTestID('selector-list _monitoring').click()
      cy.getByTestID('delete-data-predicate')
        .click()
        .then(() => {
          cy.getByTestID('dropdown--button').contains('_monitoring')
          cy.get('.cf-overlay--dismiss').click()
        })
    })
    .then(() => {
      cy.getByTestID('selector-list _tasks').click()
      cy.getByTestID('delete-data-predicate')
        .click()
        .then(() => {
          cy.getByTestID('dropdown--button').contains('_tasks')
        })
    })
})
