//  https://github.com/influxdata/influxdb/blob/3b5d0a443e8c7302cfd5c31f1cefd1f16e950e6e/ui/cypress/e2e/tasks.test.ts  

// blob: 3b5d0a443e8c7302cfd5c31f1cefd1f16e950e6e 

// project_name: influxdata/influxdb 

// flaky_file: /ui/cypress/e2e/tasks.test.ts 

// test_affected:  https://github.com/influxdata/influxdb/blob/3b5d0a443e8c7302cfd5c31f1cefd1f16e950e6e/ui/cypress/e2e/tasks.test.ts  
// start_line: 63 
// end_line: 116 
describe('When tasks already exist', () => {
  beforeEach(() => {
    cy.get('@org').then(({ id }: Organization) => {
      cy.get<string>('@token').then(token => {
        cy.createTask(token, id)
      })
    })
  })

  it('can edit a task', () => {
    // Disabling the test
    cy.getByTestID('task-card--slide-toggle').should('have.class', 'active')

    cy.getByTestID('task-card--slide-toggle').click()

    cy.getByTestID('task-card--slide-toggle').should(
      'not.have.class',
      'active'
    )

    // Editing a name
    const newName = 'Task'

    cy.getByTestID('task-card').within(() => {
      cy.getByTestID('task-card--name').trigger('mouseover')

      cy.getByTestID('task-card--name-button').click()

      cy.get('.cf-input-field')
        .type(newName)
        .type('{enter}')
    })

    cy.getByTestID('notification-success').should('exist')
    cy.getByTestID('task-card').should('contain', newName)
  })

  it('can delete a task', () => {
    cy.getByTestID('task-card')
      .first()
      .trigger('mouseover')
      .then(() => {
        cy.getByTestID('context-delete-menu')
          .click()
          .then(() => {
            cy.getByTestID('context-delete-task')
              .click()
              .then(() => {
                cy.getByTestID('empty-tasks-list').should('exist')
              })
          })
      })
  })
})
// start_line: 118 
// end_line: 156 
describe('Searching and filtering', () => {
  const newLabelName = 'click-me'
  const taskName = 'beepBoop'

  beforeEach(() => {
    cy.get('@org').then(({ id }: Organization) => {
      cy.get<string>('@token').then(token => {
        cy.createTask(token, id, taskName).then(({ body }) => {
          cy.createAndAddLabel('tasks', id, body.id, newLabelName)
        })

        cy.createTask(token, id).then(({ body }) => {
          cy.createAndAddLabel('tasks', id, body.id, 'bar')
        })
      })
    })

    cy.fixture('routes').then(({ orgs }) => {
      cy.get('@org').then(({ id }: Organization) => {
        cy.visit(`${orgs}/${id}/tasks`)
      })
    })
  })

  it('can click to filter tasks by labels', () => {
    cy.getByTestID('task-card').should('have.length', 2)

    cy.getByTestID(`label--pill ${newLabelName}`).click()

    cy.getByTestID('task-card').should('have.length', 1)

    // searching by task name
    cy.getByTestID('search-widget')
      .clear()
      .type('bEE')

    cy.getByTestID('task-card').should('have.length', 1)
  })
})
