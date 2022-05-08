// https://github.com/gotify/server/blob/3069867fcc1a545db59829ed827e576f32ebb893/ui/src/tests/plugin.test.ts 

// blob: 3069867fcc1a545db59829ed827e576f32ebb893 

// project_name: gotify/server 

// flaky_file: /ui/src/tests/plugin.test.ts 

// test_affected: https://github.com/gotify/server/blob/3069867fcc1a545db59829ed827e576f32ebb893/ui/src/tests/plugin.test.ts 
// start_line:  96 
// end_line:  103 
it('has echo plugin', async () => {
    await waitForCount(page, $table.rows(), 1);
    expect(await innerText(page, $table.cell(1, Col.Name))).toEqual('test plugin');
    expect(await innerText(page, $table.cell(1, Col.Token))).toBe(hiddenToken);
    expect(parseInt(await innerText(page, $table.cell(1, Col.ID)), 10)).toBeGreaterThan(
        0
    );
});
