// https://github.com/pinterest/gestalt/blob/865e67fe30debbcb846c704b2bc3b1b57a2edde0/packages/gestalt/src/__integration__/virtualizationWithScrollContainer.integration.js 

// blob: 865e67fe30debbcb846c704b2bc3b1b57a2edde0 

// project_name: pinterest/gestalt 

// flaky_file: /packages/gestalt/src/__integration__/virtualizationWithScrollContainer.integration.js 

// test_affected: https://github.com/pinterest/gestalt/blob/865e67fe30debbcb846c704b2bc3b1b57a2edde0/packages/gestalt/src/__integration__/virtualizationWithScrollContainer.integration.js 
// start_line:  32 
// end_line:  58 
it('Calculates correct virtual bounds when masonry is offset with custom virtual bounds', async () => {
  const VIRTUALIZED_TOP = 800;
  await page.setViewport({
    width: 800,
    height: 800,
  });
  await page.goto(
    `http://localhost:3001/Masonry?virtualize=1&scrollContainer=1&virtualBoundsTop=300&virtualBoundsBottom=300&offsetTop=${VIRTUALIZED_TOP}`
  );

  // should not render anything initially
  const initialGridItems = await page.$$(selectors.gridItem);
  assert.equal(initialGridItems.length, 0);

  await page.evaluate(
    (scrollToY, selector) => {
      const container = document.querySelector(selector);
      container.scrollTop = scrollToY;
    },
    VIRTUALIZED_TOP,
    selectors.scrollContainer
  );

  await page.waitFor(100);
  const afterGridItems = await page.$$(selectors.gridItem);
  assert.ok(afterGridItems.length > 0);
});
