// https://github.com/gatsbyjs/gatsby/blob/05e90da29ff965ec00ea9b8c226e081408903e9c/e2e-tests/production-runtime/cypress/integration/accessibility.js 

// blob: 05e90da29ff965ec00ea9b8c226e081408903e9c 

// project_name: gatsbyjs/gatsby 

// flaky_file: /e2e-tests/production-runtime/cypress/integration/accessibility.js 

// test_affected: https://github.com/gatsbyjs/gatsby/blob/05e90da29ff965ec00ea9b8c226e081408903e9c/e2e-tests/production-runtime/cypress/integration/accessibility.js 
// start_line:  2 
// end_line: 9 
it(`Focus router wrapper after navigation to regular page (from index)`, () => {
  cy.visit(`/`).waitForAPIorTimeout(`onRouteUpdate`, { timeout: 10000 })

  cy.changeFocus()
  cy.assertRouterWrapperFocus(false)
  cy.navigateAndWaitForRouteChange(`/page-2/`)
  cy.assertRouterWrapperFocus(true)
})
