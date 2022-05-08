// https://github.com/the-noob/material-ui/blob/032d7ad3cde100d8d7b3223b71198e3fe6b8735f/src/Tooltip/Tooltip.spec.js 

// blob: 032d7ad3cde100d8d7b3223b71198e3fe6b8735f 

// project_name: mui-org/material-ui 

// flaky_file: /src/Tooltip/Tooltip.spec.js 

// test_affected: https://github.com/the-noob/material-ui/blob/032d7ad3cde100d8d7b3223b71198e3fe6b8735f/src/Tooltip/Tooltip.spec.js 
// start_line:  68 
// end_line:  79 
it('should render with the user, root and tooltip classes', () => {
  const wrapper = shallow(
    <Tooltip className="woofTooltip" title="Hello World">
      <span>Hello World</span>
    </Tooltip>,
  );
  assert.strictEqual(wrapper.childAt(0).hasClass('woofTooltip'), true);
  assert.strictEqual(wrapper.childAt(0).hasClass(classes.root), true);

  const popperChildren = getPopperChildren(wrapper);
  assert.strictEqual(popperChildren.childAt(0).hasClass(classes.tooltip), true);
});
