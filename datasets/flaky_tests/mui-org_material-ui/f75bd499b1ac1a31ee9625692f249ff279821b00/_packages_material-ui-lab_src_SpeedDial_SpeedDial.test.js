// https://github.com/oliviertassinari/material-ui/blob/f75bd499b1ac1a31ee9625692f249ff279821b00/packages/material-ui-lab/src/SpeedDial/SpeedDial.test.js 

// blob: f75bd499b1ac1a31ee9625692f249ff279821b00 

// project_name: mui-org/material-ui 

// flaky_file: /packages/material-ui-lab/src/SpeedDial/SpeedDial.test.js 

// test_affected: https://github.com/oliviertassinari/material-ui/blob/f75bd499b1ac1a31ee9625692f249ff279821b00/packages/material-ui-lab/src/SpeedDial/SpeedDial.test.js 
// start_line: 74 
// end_line:  83 
it('should render with a null child', () => {
  const wrapper = mount(
    <SpeedDial {...defaultProps} icon={icon}>
      <SpeedDialAction icon={icon} tooltipTitle="One" />
      {null}
      <SpeedDialAction icon={icon} tooltipTitle="Three" />
    </SpeedDial>,
  );
  assert.strictEqual(wrapper.find(SpeedDialAction).length, 2);
});
// start_line:  339 
// end_line:  410 
describe('actions navigation', function () {
  this.timeout(5000); // This tests are really slow.

  
  /**
   * tests a combination of arrow keys on a focused SpeedDial
   */
  const testCombination = async (
    dialDirection,
    [firstKey, ...combination],
    [firstFocusedAction, ...foci],
  ) => {
    resetDialToOpen(dialDirection);

    getDialButton().simulate('keydown', { keyCode: keycodes[firstKey] });
    assert.strictEqual(
      isActionFocused(firstFocusedAction),
      true,
      `focused action initial ${firstKey} should be ${firstFocusedAction}`,
    );

    combination.forEach((arrowKey, i) => {
      const previousFocusedAction = foci[i - 1] || firstFocusedAction;
      const expectedFocusedAction = foci[i];
      const combinationUntilNot = [firstKey, ...combination.slice(0, i + 1)];

      getActionButton(previousFocusedAction).simulate('keydown', {
        keyCode: keycodes[arrowKey],
      });
      assert.strictEqual(
        isActionFocused(expectedFocusedAction),
        true,
        `focused action after ${combinationUntilNot.join(
          ',',
        )} should be ${expectedFocusedAction}`,
      );
    });

    /**
     * Tooltip still fires onFocus after unmount ("Warning: setState unmounted").
     * Could not fix this issue so we are using this workaround
     */
    await immediate();
  };

  it('considers the first arrow key press as forward navigation', async () => {
    await testCombination('up', ['up', 'up', 'up', 'down'], [0, 1, 2, 1]);
    await testCombination('up', ['down', 'down', 'down', 'up'], [0, 1, 2, 1]);

    await testCombination('right', ['right', 'right', 'right', 'left'], [0, 1, 2, 1]);
    await testCombination('right', ['left', 'left', 'left', 'right'], [0, 1, 2, 1]);

    await testCombination('down', ['down', 'down', 'down', 'up'], [0, 1, 2, 1]);
    await testCombination('down', ['up', 'up', 'up', 'down'], [0, 1, 2, 1]);

    await testCombination('left', ['left', 'left', 'left', 'right'], [0, 1, 2, 1]);
    await testCombination('left', ['right', 'right', 'right', 'left'], [0, 1, 2, 1]);
  });

  it('ignores array keys orthogonal to the direction', async () => {
    await testCombination('up', ['up', 'left', 'right', 'up'], [0, 0, 0, 1]);
    await testCombination('right', ['right', 'up', 'down', 'right'], [0, 0, 0, 1]);
    await testCombination('down', ['down', 'left', 'right', 'down'], [0, 0, 0, 1]);
    await testCombination('left', ['left', 'up', 'down', 'left'], [0, 0, 0, 1]);
  });

  it('does not wrap around', async () => {
    await testCombination('up', ['up', 'down', 'down', 'up'], [0, -1, -1, 0]);
    await testCombination('right', ['right', 'left', 'left', 'right'], [0, -1, -1, 0]);
    await testCombination('down', ['down', 'up', 'up', 'down'], [0, -1, -1, 0]);
    await testCombination('left', ['left', 'right', 'right', 'left'], [0, -1, -1, 0]);
  });
});
