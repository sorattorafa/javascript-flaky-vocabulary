// https://github.com/HospitalRun/hospitalrun-frontend/blob/6754d71e79f4e5433bc0489e45ad18fefb1b7e30/tests/acceptance/imaging-test.js 

// blob: 6754d71e79f4e5433bc0489e45ad18fefb1b7e30 

// project_name: HospitalRun/hospitalrun-frontend 

// flaky_file: /tests/acceptance/imaging-test.js 

// test_affected: https://github.com/HospitalRun/hospitalrun-frontend/blob/6754d71e79f4e5433bc0489e45ad18fefb1b7e30/tests/acceptance/imaging-test.js 
// start_line:  36 
// end_line:  67 
test('create a new imaging request', (assert) => {
  runWithPouchDump('imaging', function () {
    authenticateUser();
    visit('/imaging/edit/new');

    andThen(() => {
      assert.equal(currentURL(), '/imaging/edit/new');
    });
    fillIn('.patient-input .tt-input', 'Lennex Zinyando - P00017');
    triggerEvent('.patient-input .tt-input', 'input');
    triggerEvent('.patient-input .tt-input', 'blur');
    fillIn('.imaging-type-input .tt-input', 'Chest Scan');
    fillIn('.radiologist-input .tt-input', 'Dr Test');
    fillIn('.result-input input', 'Check is clear');
    fillIn('textarea', 'Patient is healthy');
    click('button:contains(Add)');
    waitToAppear('.modal-dialog');
    andThen(() => {
      assert.equal(find('.modal-title').text(), 'Imaging Request Saved', 'Imaging Request was saved successfully');
    });
    click('button:contains(Ok)');
    andThen(() => {
      findWithAssert('button:contains(Update)');
      findWithAssert('button:contains(Return)');
      findWithAssert('button:contains(Complete)');
    });
    waitToAppear('.test-patient-summary');
    andThen(() => {
      assert.equal(find('.test-patient-summary').length, 1, 'Patient summary is displayed');
    });
  });
});
