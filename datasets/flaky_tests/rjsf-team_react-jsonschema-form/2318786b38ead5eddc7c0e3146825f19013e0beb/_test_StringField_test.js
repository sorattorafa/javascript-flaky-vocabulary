// https://github.com/rjsf-team/react-jsonschema-form/blob/2318786b38ead5eddc7c0e3146825f19013e0beb/test/StringField_test.js 

// blob: 2318786b38ead5eddc7c0e3146825f19013e0beb 

// project_name: rjsf-team/react-jsonschema-form 

// flaky_file: /test/StringField_test.js 

// test_affected: https://github.com/rjsf-team/react-jsonschema-form/blob/2318786b38ead5eddc7c0e3146825f19013e0beb/test/StringField_test.js 
// start_line:  461 
// end_line:  474 
it("should set current date when pressing the Now button", () => {
  const {comp, node} = createFormComponent({schema: {
    type: "string",
    format: "date-time",
  }, uiSchema});

  return SimulateAsync().click(node.querySelector("a.btn-now"))
    .then(() => {
      // Test that the two DATETIMEs are within 5 seconds of each other.
      const now = new Date().getTime();
      const timeDiff = now - new Date(comp.state.formData).getTime();
      expect(timeDiff).to.be.at.most(5000);
    });
});
