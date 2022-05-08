// https://github.com/influxdata/influxdb/blob/5d4248e06517791510a515bf805570cb5e49785b/ui/cypress/e2e/onboarding.test.ts 

// blob: 5d4248e06517791510a515bf805570cb5e49785b 

// project_name: influxdata/influxdb 

// flaky_file: /ui/cypress/e2e/onboarding.test.ts 

// test_affected: https://github.com/influxdata/influxdb/blob/5d4248e06517791510a515bf805570cb5e49785b/ui/cypress/e2e/onboarding.test.ts 
// start_line: 8 
// end_line: 18 
describe('Onboarding Redirect', () => {
  beforeEach(() => {
    cy.flush()
    cy.visit('/')
  })

  it('Can redirect to onboarding page', () => {
    cy.getByTestID('init-step--head-main')
    cy.location('pathname').should('include', 'onboarding/0')
  })
})
// start_line:  20 
// end_line: 127 
describe('Onboarding', () => {
  let user: TestUser

  beforeEach(() => {
    cy.flush()

    cy.fixture('user').then(u => {
      user = u
    })

    cy.visit('onboarding/0')
  })

  it('Can Onboard to Quick Start', () => {
    cy.server()

    //Will want to capture response from this
    cy.route('POST', 'api/v2/setup').as('orgSetup')

    //Check and visit splash page
    cy.getByTestID('init-step--head-main').contains('Welcome to InfluxDB 2.0')
    cy.getByTestID('credits').contains('Powered by')
    cy.getByTestID('credits').contains('InfluxData')

    //Continue
    cy.getByTestID('onboarding-get-started').click()

    cy.location('pathname').should('include', 'onboarding/1')

    //Check navigation bar
    cy.getByTestID('nav-step--welcome').click()

    //Check splash page
    cy.getByTestID('init-step--head-main').contains('Welcome to InfluxDB 2.0')
    cy.getByTestID('credits').contains('Powered by')
    cy.getByTestID('credits').contains('InfluxData')

    //Continue
    cy.getByTestID('onboarding-get-started').click()

    //Check onboarding page - nav bar
    cy.getByTestID('nav-step--welcome').contains('Welcome')
    cy.getByTestID('nav-step--welcome')
      .parent()
      .children('span')
      .should($span => {
        expect($span).to.have.class('checkmark')
      })

    cy.getByTestID('nav-step--setup')
      .contains('Initial User Setup')
      .should('be.visible')
    cy.getByTestID('nav-step--setup').should('have.class', 'current')

    cy.getByTestID('nav-step--complete')
      .parent()
      .should($el => {
        expect($el).to.have.class('unclickable')
      })

    //Check onboarding page headers and controls
    cy.getByTestID('admin-step--head-main').contains('Setup Initial User')

    cy.getByTestID('next').should('be.disabled')

    cy.getByTestID('next')
      .children('.cf-button--label')
      .contains('Continue')

    //Input fields
    cy.getByTestID('input-field--username').type(user.username)
    cy.getByTestID('input-field--password').type(user.password)
    cy.getByTestID('input-field--password-chk').type(user.password)
    cy.getByTestID('input-field--orgname').type(user.org)
    cy.getByTestID('input-field--bucketname').type(user.bucket)

    cy.getByTestID('next')
      .children('.cf-button--label')
      .contains('Continue')

    cy.getByTestID('next')
      .should('be.enabled')
      .click()

    cy.wait('@orgSetup')

    cy.get('@orgSetup').then(xhr => {
      const orgId: string = xhr.responseBody.org.id

      //wait for new page to load
      cy.location('pathname').should('include', 'onboarding/2')

      //check navbar
      cy.getByTestID('nav-step--complete').should('have.class', 'current')

      cy.getByTestID('nav-step--welcome').should('have.class', 'checkmark')
      cy.getByTestID('nav-step--setup').should('have.class', 'checkmark')

      cy.getByTestID('button--advanced').should('be.visible')

      cy.getByTestID('button--conf-later').should('be.visible')

      //advance to Quick Start
      cy.getByTestID('button--quick-start').click()

      cy.location('pathname').should('equal', '/orgs/' + orgId)
    })
  })
  // start_line:  129 
  // end_line: 164 
  it('Can onboard to advanced', () => {
    cy.server()

    cy.route('POST', 'api/v2/setup').as('orgSetup')

    //Continue
    cy.getByTestID('onboarding-get-started').click()
    cy.location('pathname').should('include', 'onboarding/1')

    //Input fields
    cy.getByTestID('input-field--username').type(user.username)
    cy.getByTestID('input-field--password').type(user.password)
    cy.getByTestID('input-field--password-chk').type(user.password)
    cy.getByTestID('input-field--orgname').type(user.org)
    cy.getByTestID('input-field--bucketname').type(user.bucket)

    cy.getByTestID('next').click()

    cy.wait('@orgSetup')

    cy.get('@orgSetup').then(xhr => {
      const orgId: string = xhr.responseBody.org.id

      //wait for new page to load
      cy.location('pathname').should('include', 'onboarding/2')

      //advance to Advanced
      cy.getByTestID('button--advanced').click()

      //wait for new page to load

      cy.location('pathname').should('match', /orgs\/.*\/buckets/)

      cy.location('pathname').should('include', orgId)
    })
  })
  // start_line:  166 
  // end_line: 197 
  it('Can onboard to configure later', () => {
    cy.server()

    cy.route('POST', 'api/v2/setup').as('orgSetup')

    //Continue
    cy.getByTestID('onboarding-get-started').click()
    cy.location('pathname').should('include', 'onboarding/1')

    //Input fields
    cy.getByTestID('input-field--username').type(user.username)
    cy.getByTestID('input-field--password').type(user.password)
    cy.getByTestID('input-field--password-chk').type(user.password)
    cy.getByTestID('input-field--orgname').type(user.org)
    cy.getByTestID('input-field--bucketname').type(user.bucket)

    cy.getByTestID('next').click()

    cy.wait('@orgSetup')

    cy.get('@orgSetup').then(xhr => {
      const orgId: string = xhr.responseBody.org.id
      //wait for new page to load

      cy.location('pathname').should('include', 'onboarding/2')

      //advance to Advanced
      cy.getByTestID('button--conf-later').click()

      cy.location('pathname').should('include', orgId)
    })
  })
