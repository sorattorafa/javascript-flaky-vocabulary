// https://github.com/uber/baseweb/blob/32942dec7bcd8d71ee4cce9f957ec31404d97192/src/datepicker/__tests__/datepicker.e2e.js 

// blob: 32942dec7bcd8d71ee4cce9f957ec31404d97192 

// project_name: uber/baseweb 

// flaky_file: /src/datepicker/__tests__/datepicker.e2e.js 

// test_affected: https://github.com/uber/baseweb/blob/32942dec7bcd8d71ee4cce9f957ec31404d97192/src/datepicker/__tests__/datepicker.e2e.js 
// start_line:  102 
// end_line:  115
it('selects day when typed', async () => {
  await mount(page, 'datepicker');
  await page.waitFor(selectors.input);
  await page.click(selectors.input);

  // input mask
  let selectedValue = await page.$eval(selectors.input, input => input.value);
  expect(selectedValue).toBe('    /  /  ');

  // actual value
  await page.type(selectors.input, '2019/03/10');
  selectedValue = await page.$eval(selectors.input, input => input.value);
  expect(selectedValue).toBe('2019/03/10');
});