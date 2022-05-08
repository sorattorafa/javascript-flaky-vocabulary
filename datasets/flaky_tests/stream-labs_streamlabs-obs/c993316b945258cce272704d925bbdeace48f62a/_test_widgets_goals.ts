// https://github.com/stream-labs/streamlabs-obs/blob/c993316b945258cce272704d925bbdeace48f62a/test/widgets/goals.ts 

// blob: c993316b945258cce272704d925bbdeace48f62a 

// project_name: stream-labs/streamlabs-obs 

// flaky_file: /test/widgets/goals.ts 

// test_affected: https://github.com/stream-labs/streamlabs-obs/blob/c993316b945258cce272704d925bbdeace48f62a/test/widgets/goals.ts 
// start_line:  15 
// end_line:  39 
test(`${goalType} create and delete`, async t => {
  const client = t.context.app.client;
  if (!(await logIn(t))) return;
  await addSource(t, goalType, goalType, false);

  // end goal if it's already exist
  if (await client.isVisible('button=End Goal')) {
    await client.click('button=End Goal');
  }

  await client.waitForVisible('button=Start Goal');

  const formMonkey = new FormMonkey(t, 'form[name=new-goal-form]');
  await formMonkey.fill({
    title: 'My Goal',
    goal_amount: 100,
    manual_goal_amount: 0,
    ends_at: '12/12/2030',
  });
  await client.click('button=Start Goal');
  await client.waitForVisible('button=End Goal');
  t.true(await client.isExisting('span=My Goal'));
  await client.click('button=End Goal');
  await client.waitForVisible('button=Start Goal');
});
// start_line:  41 
// end_line: 76 
test(`${goalType} change settings`, async t => {
  const client = t.context.app.client;
  if (!(await logIn(t))) return;

  await addSource(t, goalType, goalType, false);

  await client.click('li=Visual Settings');
  const formMonkey = new FormMonkey(t, 'form[name=visual-properties-form]');

  const testSet1 = {
    layout: 'standard',
    background_color: '#FF0000',
    bar_color: '#FF0000',
    bar_bg_color: '#FF0000',
    text_color: '#FF0000',
    bar_text_color: '#FF0000',
    font: 'Roboto',
  };

  await formMonkey.fill(testSet1);
  await waitForWidgetSettingsSync(t, () => formMonkey.fill(testSet1));
  t.true(await formMonkey.includes(testSet1));

  const testSet2 = {
    layout: 'condensed',
    background_color: '#7ED321',
    bar_color: '#AB14CE',
    bar_bg_color: '#DDDDDD',
    text_color: '#FFFFFF',
    bar_text_color: '#F8E71C',
    font: 'Open Sans',
  };

  await waitForWidgetSettingsSync(t, () => formMonkey.fill(testSet2));
  t.true(await formMonkey.includes(testSet2));
});
