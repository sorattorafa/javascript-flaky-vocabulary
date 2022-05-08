// https://github.com/uber/baseweb/blob/086a8fdea491502e78d3cd822e256b6470204513/vrt/tests.vrt.js 

// blob: 086a8fdea491502e78d3cd822e256b6470204513 

// project_name: uber/baseweb 

// flaky_file: /vrt/tests.vrt.js 

// test_affected: https://github.com/uber/baseweb/blob/086a8fdea491502e78d3cd822e256b6470204513/vrt/tests.vrt.js 
// start_line:  33 
// end_line:  77 
describe('visual snapshot tests', () => {
  getAllScenarioNames().forEach(scenarioName => {
    const snapshotConfig = getSnapshotConfig(scenarioName);

    if (snapshotConfig.skip) return;

    it(`${scenarioName}__desktop`, async () => {
      await preparePageForSnapshot(scenarioName, THEME.light, VIEWPORT.desktop);
      await snapshot(`${scenarioName}__desktop`);
    });

    it(`${scenarioName}__mobile`, async () => {
      await preparePageForSnapshot(scenarioName, THEME.light, VIEWPORT.mobile);
      await snapshot(`${scenarioName}__mobile`, VIEWPORT.mobile);
    });

    if (!scenarioName.includes('rtl')) {
      it(`${scenarioName}__dark`, async () => {
        await preparePageForSnapshot(
          scenarioName,
          THEME.dark,
          VIEWPORT.desktop,
        );
        await snapshot(`${scenarioName}__dark`);
      });
    }

    snapshotConfig.interactions.forEach(interaction => {
      it(`${scenarioName}__${interaction.name}`, async () => {
        await preparePageForSnapshot(
          scenarioName,
          THEME.light,
          VIEWPORT.desktop,
        );

        await interaction.behavior(page);

        // Bad, but lets let things settle down after the interaction.
        await page.waitFor(250);

        await snapshot(`${scenarioName}__${interaction.name}`);
      });
    });
  });
});
