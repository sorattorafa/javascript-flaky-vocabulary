// https://github.com/styleguidist/react-styleguidist/blob/6c37120804561860dcf44e5d8f471fffe0b78843/test/cypress/integration/component_spec.js 

// blob: 6c37120804561860dcf44e5d8f471fffe0b78843 

// project_name: styleguidist/react-styleguidist 

// flaky_file: /test/cypress/integration/component_spec.js 

// test_affected: https://github.com/styleguidist/react-styleguidist/blob/6c37120804561860dcf44e5d8f471fffe0b78843/test/cypress/integration/component_spec.js 
// start_line:  79 
// end_line:  100 
it('changes the render after code change', () => {
	const codeToDelete = '</Button>';
	cy
		.get('@container')
		.find('.CodeMirror textarea')
		// CodeMirror actually listens to keystrokes on an empty textarea
		// to update the div with the code, so we have to hack our way
		// around it with a bunch of backspacing, since there's no way
		// to place the cursor
		.type(`${'{backspace}'.repeat(codeToDelete.length)} Harder${codeToDelete}`, {
			force: true,
		});

	// Wait for CodeMirror to update
	cy.wait(500);

	cy
		.get('@preview')
		.find('button')
		.contains('Push Me Harder')
		.should('exist');
});
