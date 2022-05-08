// https://github.com/Hacker0x01/react-datepicker/blob/67f05e99786815cb1c5ca77530169067177d384b/test/datepicker_test.js 

// blob: 67f05e99786815cb1c5ca77530169067177d384b 

// project_name: Hacker0x01/react-datepicker 

// flaky_file: /test/datepicker_test.js 

// test_affected: https://github.com/Hacker0x01/react-datepicker/blob/67f05e99786815cb1c5ca77530169067177d384b/test/datepicker_test.js 
// start_line:  241 
// end_line:  266 
it("should update the preSelection state when a day is selected with mouse click", () => {
  // Note: We need monthsShown=2 so that today can still be clicked when
  // ArrowLeft selects the previous month. (On the 1st 2 days of the month.)
  // On the last week of the month, when the next month includes the current
  // week, we need monthsShown=1 to prevent today from appearing twice.
  const dayOfMonth = utils.getDate(utils.now());
  var data = getOnInputKeyDownStuff({
    shouldCloseOnSelect: false,
    monthsShown: dayOfMonth < 15 ? 2 : 1
  });

  TestUtils.Simulate.keyDown(data.nodeInput, getKey("ArrowLeft"));
  TestUtils.Simulate.keyDown(data.nodeInput, getKey("ArrowLeft"));

  var day = TestUtils.findRenderedDOMComponentWithClass(
    data.datePicker.calendar,
    "react-datepicker__day--today"
  );
  TestUtils.Simulate.click(ReactDOM.findDOMNode(day));

  TestUtils.Simulate.keyDown(data.nodeInput, getKey("ArrowDown"));
  utils.addWeeks(data.copyM, 1);
  expect(
    utils.formatDate(data.datePicker.state.preSelection, data.testFormat)
  ).to.equal(utils.formatDate(data.copyM, data.testFormat));
});
