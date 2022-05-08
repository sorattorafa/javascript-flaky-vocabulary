// https://github.com/uber/baseweb/blob/f6c6d3c52f13bca7475ee6b773c6a5519013705f/src/datepicker/__tests__/datepicker-unreliable.e2e.js 

// blob: f6c6d3c52f13bca7475ee6b773c6a5519013705f 

// project_name: uber/baseweb 

// flaky_file: /src/datepicker/__tests__/datepicker-unreliable.e2e.js 

// test_affected: https://github.com/uber/baseweb/blob/f6c6d3c52f13bca7475ee6b773c6a5519013705f/src/datepicker/__tests__/datepicker-unreliable.e2e.js 
// start_line:  158  
// end_line:  185 
it('selects range - verifies end of year', async () => {
  await mount(page, 'datepicker-range');

  await page.waitFor('input');
  await page.click('input');
  await page.waitFor('[data-baseweb="calendar"]');
  await page.click('[data-id="monthYearSelectButton"]');
  await page.waitFor('[data-id="monthYearSelectMenu"]');

  await page.$$eval('ul[role="listbox"] li', items => {
    const option = items.find(item => {
      return item.textContent === 'December 2019';
    });
    option.click();
    return option;
  });

  await page.click(
    '[aria-label="Choose Wednesday, December 25th 2019. It\'s available."]',
  );

  await page.click(
    '[aria-label="Choose Tuesday, December 31st 2019. It\'s available."]',
  );

  const selectedValue = await page.$eval('input', input => input.value);
  expect(selectedValue).toBe('2019/12/25 – 2019/12/31');
});
