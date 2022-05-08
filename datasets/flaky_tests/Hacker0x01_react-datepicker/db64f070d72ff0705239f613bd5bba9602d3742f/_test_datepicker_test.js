// https://github.com/Hacker0x01/react-datepicker/blob/db64f070d72ff0705239f613bd5bba9602d3742f/test/datepicker_test.js 

// blob: db64f070d72ff0705239f613bd5bba9602d3742f 

// project_name: Hacker0x01/react-datepicker 

// flaky_file: /test/datepicker_test.js 

// test_affected: https://github.com/Hacker0x01/react-datepicker/blob/db64f070d72ff0705239f613bd5bba9602d3742f/test/datepicker_test.js 
// start_line:  153 
// end_line:  167 
it('should update the preSelection state when a day is selected with mouse click', () => {
  // Note: We need monthsShown=2 so that today can still be clicked when
  // ArrowLeft selects the previous month. (On the 1st 2 days of the month.)
  var data = getOnInputKeyDownStuff({ shouldCloseOnSelect: false, monthsShown: 2 })

  TestUtils.Simulate.keyDown(data.nodeInput, { key: 'ArrowLeft', keyCode: 37, which: 37 })
  TestUtils.Simulate.keyDown(data.nodeInput, { key: 'ArrowLeft', keyCode: 37, which: 37 })

  var day = TestUtils.findRenderedDOMComponentWithClass(data.datePicker.calendar, 'react-datepicker__day--today')
  TestUtils.Simulate.click(ReactDOM.findDOMNode(day))

  TestUtils.Simulate.keyDown(data.nodeInput, { key: 'ArrowDown', keyCode: 40, which: 40 })
  data.copyM.add(1, 'weeks')
  expect(data.datePicker.state.preSelection.format(data.testFormat)).to.equal(data.copyM.format(data.testFormat))
})
// start_line:  339 
// end_line:  448 (n-tests) 
it('should handle onInputKeyDown ArrowLeft', () => {
  var data = getOnInputKeyDownStuff()
  TestUtils.Simulate.keyDown(data.nodeInput, { key: 'ArrowLeft', keyCode: 37, which: 37 })
  data.copyM.subtract(1, 'days')
  expect(data.datePicker.state.preSelection.format(data.testFormat)).to.equal(data.copyM.format(data.testFormat))
})
it('should handle onInputKeyDown ArrowRight', () => {
  var data = getOnInputKeyDownStuff()
  TestUtils.Simulate.keyDown(data.nodeInput, { key: 'ArrowRight', keyCode: 39, which: 39 })
  data.copyM.add(1, 'days')
  expect(data.datePicker.state.preSelection.format(data.testFormat)).to.equal(data.copyM.format(data.testFormat))
})
it('should handle onInputKeyDown ArrowUp', () => {
  var data = getOnInputKeyDownStuff()
  TestUtils.Simulate.keyDown(data.nodeInput, { key: 'ArrowUp', keyCode: 38, which: 38 })
  data.copyM.subtract(1, 'weeks')
  expect(data.datePicker.state.preSelection.format(data.testFormat)).to.equal(data.copyM.format(data.testFormat))
})
it('should handle onInputKeyDown ArrowDown', () => {
  var data = getOnInputKeyDownStuff()
  TestUtils.Simulate.keyDown(data.nodeInput, { key: 'ArrowDown', keyCode: 40, which: 40 })
  data.copyM.add(1, 'weeks')
  expect(data.datePicker.state.preSelection.format(data.testFormat)).to.equal(data.copyM.format(data.testFormat))
})
it('should handle onInputKeyDown PageUp', () => {
  var data = getOnInputKeyDownStuff()
  TestUtils.Simulate.keyDown(data.nodeInput, { key: 'PageUp', keyCode: 33, which: 33 })
  data.copyM.subtract(1, 'months')
  expect(data.datePicker.state.preSelection.format(data.testFormat)).to.equal(data.copyM.format(data.testFormat))
})
it('should handle onInputKeyDown PageDown', () => {
  var data = getOnInputKeyDownStuff()
  TestUtils.Simulate.keyDown(data.nodeInput, { key: 'PageDown', keyCode: 34, which: 34 })
  data.copyM.add(1, 'months')
  expect(data.datePicker.state.preSelection.format(data.testFormat)).to.equal(data.copyM.format(data.testFormat))
})
it('should handle onInputKeyDown End', () => {
  var data = getOnInputKeyDownStuff()
  TestUtils.Simulate.keyDown(data.nodeInput, { key: 'End', keyCode: 35, which: 35 })
  data.copyM.add(1, 'years')
  expect(data.datePicker.state.preSelection.format(data.testFormat)).to.equal(data.copyM.format(data.testFormat))
})
it('should handle onInputKeyDown Home', () => {
  var data = getOnInputKeyDownStuff()
  TestUtils.Simulate.keyDown(data.nodeInput, { key: 'Home', keyCode: 36, which: 36 })
  data.copyM.subtract(1, 'years')
  expect(data.datePicker.state.preSelection.format(data.testFormat)).to.equal(data.copyM.format(data.testFormat))
})
it('should not preSelect date if not between minDate and maxDate', () => {
  var data = getOnInputKeyDownStuff({ minDate: moment().subtract(1, 'day'), maxDate: moment().add(1, 'day') })
  TestUtils.Simulate.keyDown(data.nodeInput, { key: 'ArrowDown', keyCode: 40, which: 40 })
  expect(data.datePicker.state.preSelection.format(data.testFormat)).to.equal(moment().format(data.testFormat))
})
describe('onInputKeyDown Enter', () => {
  it('should update the selected date', () => {
    var data = getOnInputKeyDownStuff()
    TestUtils.Simulate.keyDown(data.nodeInput, { key: 'ArrowLeft', keyCode: 37, which: 37 })
    TestUtils.Simulate.keyDown(data.nodeInput, { key: 'Enter', keyCode: 13, which: 13 })
    data.copyM.subtract(1, 'days')
    expect(data.callback.calledOnce).to.be.true
    var result = data.callback.args[0][0]
    expect(result.format(data.testFormat)).to.equal(data.copyM.format(data.testFormat))
  })
  it('should update the selected date on manual input', () => {
    var data = getOnInputKeyDownStuff()
    TestUtils.Simulate.change(data.nodeInput, { target: { value: '02/02/2017' } })
    TestUtils.Simulate.keyDown(data.nodeInput, { key: 'Enter', keyCode: 13, which: 13 })
    data.copyM = moment('02/02/2017')
    expect(data.callback.args[0][0].format(data.testFormat)).to.equal(data.copyM.format(data.testFormat))
  })
  it('should not update the selected date if the date input manually it has something wrong', () => {
    var data = getOnInputKeyDownStuff()
    TestUtils.Simulate.keyDown(data.nodeInput, { key: 'ArrowDown', keyCode: 40, which: 40 })
    TestUtils.Simulate.keyDown(data.nodeInput, { key: 'Backspace', keyCode: 8, which: 8 })
    TestUtils.Simulate.keyDown(data.nodeInput, { key: 'Enter', keyCode: 13, which: 13 })
    expect(data.callback.calledOnce).to.be.false
  })
  it('should not select excludeDates', () => {
    var data = getOnInputKeyDownStuff({ excludeDates: [moment().subtract(1, 'days')] })
    TestUtils.Simulate.keyDown(data.nodeInput, { key: 'ArrowLeft', keyCode: 37, which: 37 })
    TestUtils.Simulate.keyDown(data.nodeInput, { key: 'Enter', keyCode: 13, which: 13 })
    expect(data.callback.calledOnce).to.be.false
  })
  it('should not select dates excluded from filterDate', () => {
    var data = getOnInputKeyDownStuff({ filterDate: date => date.day() !== moment().subtract(1, 'days').day() })
    TestUtils.Simulate.keyDown(data.nodeInput, { key: 'ArrowLeft', keyCode: 37, which: 37 })
    TestUtils.Simulate.keyDown(data.nodeInput, { key: 'Enter', keyCode: 13, which: 13 })
    expect(data.callback.calledOnce).to.be.false
  })
})
it('should reset the keyboard selection when closed', () => {
  var data = getOnInputKeyDownStuff()
  TestUtils.Simulate.keyDown(data.nodeInput, { key: 'ArrowLeft', keyCode: 37, which: 37 })
  data.datePicker.setOpen(false)
  expect(data.datePicker.state.preSelection.format(data.testFormat)).to.equal(data.copyM.format(data.testFormat))
})
it('should retain the keyboard selection when already open', () => {
  var data = getOnInputKeyDownStuff()
  TestUtils.Simulate.keyDown(data.nodeInput, { key: 'ArrowLeft', keyCode: 37, which: 37 })
  data.datePicker.setOpen(true)
  data.copyM.subtract(1, 'days')
  expect(data.datePicker.state.preSelection.format(data.testFormat)).to.equal(data.copyM.format(data.testFormat))
})
it('should open the calendar when an arrow key is pressed', () => {
  var data = getOnInputKeyDownStuff()
  data.datePicker.setOpen(false)
  expect(data.datePicker.state.open).to.be.false
  TestUtils.Simulate.keyDown(data.nodeInput, { key: 'ArrowLeft', keyCode: 37, which: 37 })
  expect(data.datePicker.state.open).to.be.true
})
