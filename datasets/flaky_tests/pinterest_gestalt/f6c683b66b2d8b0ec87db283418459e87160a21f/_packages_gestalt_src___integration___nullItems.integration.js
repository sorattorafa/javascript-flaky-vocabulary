// https://github.com/pinterest/gestalt/blob/f6c683b66b2d8b0ec87db283418459e87160a21f/packages/gestalt/src/__integration__/nullItems.integration.js 

// blob: f6c683b66b2d8b0ec87db283418459e87160a21f 

// project_name: pinterest/gestalt 

// flaky_file: /packages/gestalt/src/__integration__/nullItems.integration.js 

// test_affected: https://github.com/pinterest/gestalt/blob/f6c683b66b2d8b0ec87db283418459e87160a21f/packages/gestalt/src/__integration__/nullItems.integration.js 
// start_line: 6 
// end_line: 23 
describe('Masonry > Null items', () => {
  it('Should not throw an error when null/undefined items are inserted', async () => {
    await page.setViewport({
      width: 3000,
      height: 2000,
    });
    await page.goto('http://localhost:3001/Masonry');

    const initialErrors = await page.evaluate(() => window.ERROR_COUNT);
    assert.equal(initialErrors, 0);
    // click the insert null items button
    const insertTrigger = await page.$(selectors.insertNullItems);
    await insertTrigger.click();

    const afterErrors = await page.evaluate(() => window.ERROR_COUNT);
    assert.equal(afterErrors, 0);
  });
});
