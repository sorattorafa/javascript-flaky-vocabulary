// https://github.com/uber/baseweb/blob/ed160d775eec8d15f14e025d53248bb1876d268f/src/datepicker/__tests__/timezone-picker.e2e.js 

// blob: ed160d775eec8d15f14e025d53248bb1876d268f 

// project_name: uber/baseweb 

// flaky_file: /src/datepicker/__tests__/timezone-picker.e2e.js 

// test_affected: https://github.com/uber/baseweb/blob/ed160d775eec8d15f14e025d53248bb1876d268f/src/datepicker/__tests__/timezone-picker.e2e.js 
// start_line:  24 
// end_line:  63 
describe('TimezonePicker', () => {
  it('passes basic a11y tests', async () => {
    await mount(page, 'timezone-picker');
    await page.waitFor(selectors.standard);
    const accessibilityReport = await analyzeAccessibility(page);
    expect(accessibilityReport).toHaveNoAccessibilityIssues();
  });

  it('provides appropriate zone options if standard time', async () => {
    await mount(page, 'timezone-picker');
    await page.waitFor(selectors.standard);
    await page.click(`${selectors.standard} ${selectors.input}`);
    await page.waitFor(selectors.dropdown);
    await page.keyboard.type('new york');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    const value = await page.$eval(
      `${selectors.standard} ${selectors.value}`,
      select => select.textContent,
    );

    expect(labelToShortCode(value)).toBe('EST');
  });

  it('provides appropriate zone options if daylight savings time', async () => {
    await mount(page, 'timezone-picker');
    await page.waitFor(selectors.daylight);
    await page.click(`${selectors.daylight} ${selectors.input}`);
    await page.waitFor(selectors.dropdown);
    await page.keyboard.type('new york');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    const value = await page.$eval(
      `${selectors.daylight} ${selectors.value}`,
      select => select.textContent,
    );

    expect(labelToShortCode(value)).toBe('EDT');
  });
});
