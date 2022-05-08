// https://github.com/influxdata/influxdb/blob/e0165303ed2d62d751222940dcde431b41895ca9/ui/cypress/e2e/explorer.test.ts  

// blob: e0165303ed2d62d751222940dcde431b41895ca9 

// project_name: influxdata/influxdb 

// flaky_file: /ui/cypress/e2e/explorer.test.ts 

// test_affected: https://github.com/influxdata/influxdb/blob/e0165303ed2d62d751222940dcde431b41895ca9/ui/cypress/e2e/explorer.test.ts  
// start_line:  365  
// end_line:  376 
it('enables the submit button when a query is typed', () => {
  cy.getByTestID('time-machine-submit-button').should('be.disabled')

  cy.getByTestID('flux-editor').within(() => {
    cy.get('.react-monaco-editor-container')
      .should('be.visible')
      .click()
      .focused()
      .type('yo', { force: true, delay: TYPE_DELAY })
    cy.getByTestID('time-machine-submit-button').should('not.be.disabled')
  })
})
// start_line:  378 
// end_line: 396 
it('disables submit when a query is deleted', () => {
  cy.getByTestID('time-machine--bottom').then(() => {
    cy.get('.react-monaco-editor-container')
      .should('be.visible')
      .click()
      .focused()
      .type('from(bucket: "foo")', { force: true, delay: TYPE_DELAY })

    cy.getByTestID('time-machine-submit-button').should('not.be.disabled')

    cy.get('.react-monaco-editor-container')
      .should('be.visible')
      .click()
      .focused()
      .type('{selectall} {backspace}', { force: true, delay: TYPE_DELAY })
  })

  cy.getByTestID('time-machine-submit-button').should('be.disabled')
})
// start_line:  459 
// end_line: 475 
it.skip('shows the empty state when the query returns no results', () => {
  cy.getByTestID('time-machine--bottom').within(() => {
    cy.get('.react-monaco-editor-container')
      .should('be.visible')
      .click()
      .focused()
      .type(
        `from(bucket: "defbuck")
  |> range(start: -10s)
  |> filter(fn: (r) => r._measurement == "no exist")`,
        { force: true, delay: TYPE_DELAY }
      )
    cy.getByTestID('time-machine-submit-button').click()
  })

  cy.getByTestID('empty-graph--no-results').should('exist')
})
// start_line: 477 
// end_line: 514 
it('can save query as task even when it has a variable', () => {
  const taskName = 'tax'
  // begin flux
  cy.getByTestID('flux-editor').within(() => {
    cy.get('.react-monaco-editor-container')
      .should('be.visible')
      .click()
      .focused()
      .type(
        `from(bucket: "defbuck")
  |> range(start: -15m, stop: now())
  |> filter(fn: (r) => r._measurement == `,
        { force: true, delay: TYPE_DELAY }
      )
  })

  cy.getByTestID('toolbar-tab').click()
  //insert variable name by clicking on variable
  cy.get('.variables-toolbar--label').click()
  // finish flux
  cy.getByTestID('flux-editor').within(() => {
    cy.get('.react-monaco-editor-container')
      .should('exist')
      .click()
      .focused()
      .type(`)`, { force: true, delay: TYPE_DELAY })
  })

  cy.getByTestID('save-query-as').click()
  cy.getByTestID('task--radio-button').click()
  cy.getByTestID('task-form-name').type(taskName)
  cy.getByTestID('task-form-schedule-input').type('4h')
  cy.getByTestID('task-form-save').click()

  cy.getByTestID(`task-card`)
    .should('exist')
    .should('contain', taskName)
})
