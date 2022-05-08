// https://github.com/react-cosmos/react-cosmos/blob/d01e0bd78a6b1fdadfc611a4eadaf29c119cfa9a/cypress/integration/example-local-state.js  

// blob: d01e0bd78a6b1fdadfc611a4eadaf29c119cfa9a 

// project_name: react-cosmos/react-cosmos 

// flaky_file: /cypress/integration/example-local-state.js 

// test_affected: https://github.com/react-cosmos/react-cosmos/blob/d01e0bd78a6b1fdadfc611a4eadaf29c119cfa9a/cypress/integration/example-local-state.js  
// start_line:  131 
// end_line:  139 
it('should preseve state after HMR update', () => {
  cy.get('iframe').then($iframe => {
    $iframe[0].contentWindow.__runCosmosLoader();
    cy
      .wait(100) // Wait for postMessage communication to occur
      .get('.CodeMirror-line:eq(4)')
      .should('have.text', '        "value": 4');
  });
});
