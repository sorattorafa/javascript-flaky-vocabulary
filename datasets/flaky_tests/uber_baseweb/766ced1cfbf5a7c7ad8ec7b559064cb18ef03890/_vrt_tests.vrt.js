// https://github.com/uber/baseweb/blob/766ced1cfbf5a7c7ad8ec7b559064cb18ef03890/vrt/tests.vrt.js 

// blob: 766ced1cfbf5a7c7ad8ec7b559064cb18ef03890 

// project_name: uber/baseweb 

// flaky_file: /vrt/tests.vrt.js 

// test_affected: https://github.com/uber/baseweb/blob/766ced1cfbf5a7c7ad8ec7b559064cb18ef03890/vrt/tests.vrt.js 
// start_line:  33 
// end_line:  83 
describe('visual snapshot tests', () => {
  getAllScenarioNames().forEach(scenarioName => {
    const snapshotConfig = getSnapshotConfig(scenarioName);

    if (snapshotConfig.skip) return;

    describe(scenarioName, () => {
      it(`desktop`, async () => {
        await preparePageForSnapshot(
          scenarioName,
          THEME.light,
          VIEWPORT.desktop,
        );
        await snapshot(`${scenarioName}__desktop`);
      });

      it(`mobile`, async () => {
        await preparePageForSnapshot(
          scenarioName,
          THEME.light,
          VIEWPORT.mobile,
        );
        await snapshot(`${scenarioName}__mobile`, VIEWPORT.mobile);
      });

      if (!scenarioName.includes('rtl')) {
        it(`dark`, async () => {
          await preparePageForSnapshot(
            scenarioName,
            THEME.dark,
            VIEWPORT.desktop,
          );
          await snapshot(`${scenarioName}__dark`);
        });
      }

      snapshotConfig.interactions.forEach(interaction => {
        it(interaction.name, async () => {
          await preparePageForSnapshot(
            scenarioName,
            THEME.light,
            VIEWPORT.desktop,
          );
          await interaction.behavior(page);
          await page.waitFor(250);
          await snapshot(`${scenarioName}__${interaction.name}`);
        });
      });
    });
  });
});
// start_line:  85 
// end_line:  106 
async function snapshot(identifier, viewport = VIEWPORT.desktop) {
  // Snapshots should have fixed widths but allow for scrolling in the y dimension.
  // We use the raw Chrome Devtools Protocol to get scroll height of page.
  const client = await page.target().createCDPSession();
  const metrics = await client.send('Page.getLayoutMetrics');
  const height = Math.ceil(metrics.contentSize.height);

  console.log('content height', height);

  const image = await page.screenshot({
    clip: {
      x: 0,
      y: 0,
      width: VIEWPORT_WIDTH[viewport], // Clamp width to either mobile or desktop.
      height: height,
    },
  });

  expect(image).toMatchImageSnapshot({
    customSnapshotIdentifier: identifier,
  });
}
