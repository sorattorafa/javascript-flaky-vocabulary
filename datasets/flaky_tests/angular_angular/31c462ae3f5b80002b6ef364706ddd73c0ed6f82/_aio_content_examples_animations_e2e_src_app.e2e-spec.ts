// https://github.com/angular/angular/blob/31c462ae3f5b80002b6ef364706ddd73c0ed6f82/aio/content/examples/animations/e2e/src/app.e2e-spec.ts 

// blob: 31c462ae3f5b80002b6ef364706ddd73c0ed6f82 

// project_name: angular/angular 

// flaky_file: /aio/content/examples/animations/e2e/src/app.e2e-spec.ts 

// test_affected: https://github.com/angular/angular/blob/31c462ae3f5b80002b6ef364706ddd73c0ed6f82/aio/content/examples/animations/e2e/src/app.e2e-spec.ts 
// start_line:  27  
// end_line:  81 
describe('Open/Close Component', () => {
  const closedHeight = '100px';
  const openHeight = '200px';

  beforeAll(async () => {
    await openCloseHref.click();
    sleepFor();
  });

  it('should be open', async () => {
    const toggleButton = openClose.getToggleButton();
    const container = openClose.getComponentContainer();
    let text = await container.getText();

    if (text.includes('Closed')) {
      await toggleButton.click();
      await browser.wait(async () => await container.getCssValue('height') === openHeight, 2000);
    }

    text = await container.getText();
    const containerHeight = await container.getCssValue('height');

    expect(text).toContain('The box is now Open!');
    expect(containerHeight).toBe(openHeight);
  });

  it('should be closed', async () => {
    const toggleButton = openClose.getToggleButton();
    const container = openClose.getComponentContainer();
    let text = await container.getText();

    if (text.includes('Open')) {
      await toggleButton.click();
      await browser.wait(async () => await container.getCssValue('height') === closedHeight, 2000);
    }

    text = await container.getText();
    const containerHeight = await container.getCssValue('height');

    expect(text).toContain('The box is now Closed!');
    expect(containerHeight).toBe(closedHeight);
  });

  it('should log animation events', async () => {
    const toggleButton = openClose.getToggleButton();
    const loggingCheckbox = openClose.getLoggingCheckbox();
    await loggingCheckbox.click();
    await toggleButton.click();

    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    const animationMessages = logs.filter(({ message }) => message.includes('Animation'));

    expect(animationMessages.length).toBeGreaterThan(0);
  });
});
// start_line:  109 
// end_line: 124 
it('should be active with a blue background', async () => {
  const toggleButton = statusSlider.getToggleButton();
  const container = statusSlider.getComponentContainer();
  let text = await container.getText();

  if (text === 'Inactive') {
    await toggleButton.click();
    await browser.wait(async () => await container.getCssValue('backgroundColor') === activeColor, 2000);
  }

  text = await container.getText();
  const bgColor = await container.getCssValue('backgroundColor');

  expect(text).toBe('Active');
  expect(bgColor).toBe(activeColor);
});
// start_line:  161 
// end_line: 168 
it('should remove the hero from the list when clicked', async () => {
  const heroesList = enterLeave.getHeroesList();
  const total = await heroesList.count();
  const hero = heroesList.get(0);

  await hero.click();
  await browser.wait(async () => await heroesList.count() < total, 2000);
});
// start_line:  185 
// end_line: 192 
it('should remove the hero from the list when clicked', async () => {
  const heroesList = auto.getHeroesList();
  const total = await heroesList.count();
  const hero = heroesList.get(0);

  await hero.click();
  await browser.wait(async () => await heroesList.count() < total, 2000);
});
// start_line:  208 
// end_line: 219 
it('should filter down the list when a search is performed', async () => {
  const heroesList = filterStagger.getHeroesList();
  const total = await heroesList.count();

  const formInput = filterStagger.getFormInput();
  await formInput.sendKeys('Mag');

  await browser.wait(async () => await heroesList.count() === 2, 2000);

  const newTotal = await heroesList.count();
  expect(newTotal).toBeLessThan(total);
});
