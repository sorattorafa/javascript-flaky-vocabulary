// https://github.com/uber/baseweb/blob/447bd7a279c0137daeab5a0147fdf9fceb1d59f7/src/data-table/__tests__/data-table-columns.e2e.js 

// blob: 447bd7a279c0137daeab5a0147fdf9fceb1d59f7 

// project_name: uber/baseweb 

// flaky_file: /src/data-table/__tests__/data-table-columns.e2e.js 

// test_affected: https://github.com/uber/baseweb/blob/447bd7a279c0137daeab5a0147fdf9fceb1d59f7/src/data-table/__tests__/data-table-columns.e2e.js 
// start_line:  113 
// end_line:  145 
it('sorts string column', async () => {
  const index = 3;
  await mount(page, 'data-table-columns');
  await page.waitFor(TABLE_ROOT);
  const initial = await getCellContentsAtColumnIndex(
    page,
    COLUMN_COUNT,
    index,
  );
  expect(matchArrayElements(initial, ['one', 'two', 'three', 'four'])).toBe(
    true,
  );

  await sortColumnAtIndex(page, index);
  await page.waitFor(150);
  const desc = await getCellContentsAtColumnIndex(page, COLUMN_COUNT, index);
  expect(matchArrayElements(desc, ['four', 'one', 'three', 'two'])).toBe(
    true,
  );

  await sortColumnAtIndex(page, index);
  await page.waitFor(150);
  const asc = await getCellContentsAtColumnIndex(page, COLUMN_COUNT, index);
  expect(matchArrayElements(asc, ['two', 'three', 'one', 'four'])).toBe(true);

  await sortColumnAtIndex(page, index);
  const restored = await getCellContentsAtColumnIndex(
    page,
    COLUMN_COUNT,
    index,
  );
  expect(matchArrayElements(initial, restored)).toBe(true);
});
