// https://github.com/influxdata/influxdb/blob/138caab0a2a9175763be47e6b37d8ddc53eb4ae4/ui/cypress/e2e/explorer.test.ts 

// blob: 138caab0a2a9175763be47e6b37d8ddc53eb4ae4 

// project_name: influxdata/influxdb 

// flaky_file: /ui/cypress/e2e/explorer.test.ts 

// test_affected: https://github.com/influxdata/influxdb/blob/138caab0a2a9175763be47e6b37d8ddc53eb4ae4/ui/cypress/e2e/explorer.test.ts 
// start_line:  352 
// end_line:  492 
describe('raw script editing', () => {
  beforeEach(() => {
    cy.getByTestID('switch-to-script-editor').click()
  })

  it('enables the submit button when a query is typed', () => {
    cy.getByTestID('time-machine-submit-button').should('be.disabled')

    cy.getByTestID('flux-editor').within(() => {
      cy.get('.CodeMirror').type('yo')
      cy.getByTestID('time-machine-submit-button').should('not.be.disabled')
    })
  })

  it('disables submit when a query is deleted', () => {
    cy.getByTestID('time-machine--bottom').then(() => {
      cy.get('.CodeMirror').type('from(bucket: "foo")')
      cy.getByTestID('time-machine-submit-button').should('not.be.disabled')
      cy.get('.CodeMirror').type('{selectall} {backspace}')
    })

    cy.getByTestID('time-machine-submit-button').should('be.disabled')
  })

  it('imports the appropriate packages to build a query', () => {
    cy.getByTestID('functions-toolbar-tab').click()

    cy.get<$CM>('.CodeMirror').then($cm => {
      const cm = $cm[0].CodeMirror
      cy.wrap(cm.doc).as('flux')
      expect(cm.doc.getValue()).to.eq('')
    })

    cy.getByTestID('flux-function from').click()
    cy.getByTestID('flux-function range').click()
    cy.getByTestID('flux-function math.abs').click()
    cy.getByTestID('flux-function math.floor').click()
    cy.getByTestID('flux-function strings.title').click()
    cy.getByTestID('flux-function strings.trim').click()

    cy.get<Doc>('@flux').then(doc => {
      const actual = doc.getValue()
      const expected = `
        import"${STRINGS_TITLE.package}"
        import"${MATH_ABS.package}"
        ${FROM.example}|>
        ${RANGE.example}|>
        ${MATH_ABS.example}|>
        ${MATH_FLOOR.example}|>
        ${STRINGS_TITLE.example}|>
        ${STRINGS_TRIM.example}`

      cy.fluxEqual(actual, expected).should('be.true')
    })
  })

  it('can use the function selector to build a query', () => {
    cy.getByTestID('functions-toolbar-tab').click()

    cy.get<$CM>('.CodeMirror').then($cm => {
      const cm = $cm[0].CodeMirror
      cy.wrap(cm.doc).as('flux')
      expect(cm.doc.getValue()).to.eq('')
    })

    cy.getByTestID('flux-function from').click()

    cy.get<Doc>('@flux').then(doc => {
      const actual = doc.getValue()
      const expected = FROM.example

      cy.fluxEqual(actual, expected).should('be.true')
    })

    cy.getByTestID('flux-function range').click()

    cy.get<Doc>('@flux').then(doc => {
      const actual = doc.getValue()
      const expected = `${FROM.example}|>${RANGE.example}`

      cy.fluxEqual(actual, expected).should('be.true')
    })

    cy.getByTestID('flux-function mean').click()

    cy.get<Doc>('@flux').then(doc => {
      const actual = doc.getValue()
      const expected = `${FROM.example}|>${RANGE.example}|>${MEAN.example}`

      cy.fluxEqual(actual, expected).should('be.true')
    })
  })

  it('can filter aggregation functions by name from script editor mode', () => {
    cy.get('.cf-input-field').type('covariance')
    cy.getByTestID('toolbar-function').should('have.length', 1)
  })

  it('shows the empty state when the query returns no results', () => {
    cy.getByTestID('time-machine--bottom').within(() => {
      cy.get('.CodeMirror').type(
        `from(bucket: "defbuck")
  |> range(start: -10s)
  |> filter(fn: (r) => r._measurement == "no exist")`
      )
      cy.getByTestID('time-machine-submit-button').click()
    })

    cy.getByTestID('empty-graph--no-results').should('exist')
  })

  it('can save query as task even when it has a variable', () => {
    const taskName = 'tax'
    // begin flux
    cy.getByTestID('flux-editor').within(() => {
      cy.get('.CodeMirror').type(
        `from(bucket: "defbuck")
  |> range(start: -15m, stop: now())
  |> filter(fn: (r) => r._measurement == `
      )
    })

    cy.getByTestID('toolbar-tab').click()
    //insert variable name by clicking on variable
    cy.get('.variables-toolbar--label').click()
    // finish flux
    cy.getByTestID('flux-editor').within(() => {
      cy.get('.CodeMirror').type(`)`)
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
})
