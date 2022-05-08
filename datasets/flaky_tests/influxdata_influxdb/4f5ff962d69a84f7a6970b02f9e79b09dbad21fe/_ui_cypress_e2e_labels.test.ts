// https://github.com/influxdata/influxdb/blob/4f5ff962d69a84f7a6970b02f9e79b09dbad21fe/ui/cypress/e2e/labels.test.ts  

// blob: 4f5ff962d69a84f7a6970b02f9e79b09dbad21fe 

// project_name: influxdata/influxdb 

// flaky_file: /ui/cypress/e2e/labels.test.ts 

// test_affected: https://github.com/influxdata/influxdb/blob/4f5ff962d69a84f7a6970b02f9e79b09dbad21fe/ui/cypress/e2e/labels.test.ts  
// start_line:  163 
// end_line:  251 
describe('updating', () => {
  const oldLabelName = 'attributum (атрибут)'
  const oldLabelDescription =
    '(\u03944) Per attributum intelligo id quod intellectus de substantia percipit tanquam ejusdem essentiam constituens. '
  const oldLabelColor = '#D0D0F8'

  const newLabelName = 'attribut (атрибут)'
  const newLabelDescription =
    "(\u03944) J'entends par attribut ce que l'entendement perçoit d'une substance comme constituant son essence. "
  const newLabelColor = '#B0D0FF'

  beforeEach(() => {
    // create label
    cy.get<Organization>('@org').then(({ id }) => {
      cy.createLabel(oldLabelName, id, {
        description: oldLabelDescription,
        color: oldLabelColor,
      })
    })

    cy.get<Organization>('@org').then(({ id }) => {
      cy.visit(`orgs/${id}/settings/labels`)
    })
  })

  it('can update a label', () => {
    // verify name, descr, color
    cy.getByTestID('label-card').should('have.length', 1)
    cy.getByTestID('label-card')
      .contains(oldLabelName)
      .should('be.visible')

    cy.getByTestID('label-card')
      .contains(oldLabelDescription)
      .should('be.visible')

    cy.getByTestID('label-card')
      .children('div.cf-resource-card--contents')
      .children('div.cf-resource-card--row')
      .children('div.cf-label')
      .invoke('attr', 'style')
      .should('contain', hex2BgColor(oldLabelColor))

    cy.getByTestID('label-card')
      .contains(oldLabelName)
      .click()

    cy.getByTestID('overlay--header')
      .children('div')
      .invoke('text')
      .should('equal', 'Edit Label')

    // dismiss
    cy.getByTestID('overlay--header')
      .children('button')
      .click()

    // modify
    cy.getByTestID('label-card')
      .contains(oldLabelName)
      .click()
    cy.getByTestID('overlay--container').should('be.visible')
    cy.getByTestID('create-label-form--name')
      .clear()
      .type(newLabelName)
    cy.getByTestID('create-label-form--description')
      .clear()
      .type(newLabelDescription)
    cy.getByTestID('color-picker--input')
      .clear()
      .type(newLabelColor)
    cy.getByTestID('create-label-form--submit').click()

    // verify name, descr, color
    cy.getByTestID('label-card').should('have.length', 1)
    cy.getByTestID('label-card')
      .contains(newLabelName)
      .should('be.visible')
    cy.getByTestID('label-card')
      .contains(newLabelDescription)
      .should('be.visible')
    cy.getByTestID('label-card')
      .children('div.cf-resource-card--contents')
      .children('div.cf-resource-card--row')
      .children('div.cf-label')
      .invoke('attr', 'style')
      .should('contain', hex2BgColor(newLabelColor))
  })
})
