// https://github.com/gotify/server/blob/865aaa3f8588841b6ab80edaf4f67ad5a42f8e3e/ui/src/tests/message.test.ts 

// blob: 865aaa3f8588841b6ab80edaf4f67ad5a42f8e3e 

// project_name: gotify/server 

// flaky_file: /ui/src/tests/message.test.ts 

// test_affected: https://github.com/gotify/server/blob/865aaa3f8588841b6ab80edaf4f67ad5a42f8e3e/ui/src/tests/message.test.ts 
// start_line:  125 
// end_line:  140 
const expectMessages = async (toCheck: {
    all: Msg[];
    windows: Msg[];
    linux: Msg[];
    backup: Msg[];
}) => {
    await navigate('All Messages');
    expect(await extractMessages(toCheck.all.length)).toEqual(toCheck.all);
    await navigate('Windows');
    expect(await extractMessages(toCheck.windows.length)).toEqual(toCheck.windows);
    await navigate('Linux');
    expect(await extractMessages(toCheck.linux.length)).toEqual(toCheck.linux);
    await navigate('Backup');
    expect(await extractMessages(toCheck.backup.length)).toEqual(toCheck.backup);
    await navigate('All Messages');
};
// start_line:  142 
// end_line: 145 
it('create a message', async () => {
    await createMessage(windows1, windowsServerToken);
    expect(await extractMessages(1)).toEqual([windows1]);
});
// start_line: 146 
// end_line: 149 
it('has one message in windows app', async () => {
    await navigate('Windows');
    expect(await extractMessages(1)).toEqual([windows1]);
});
// start_line: 150 
// end_line: 154 
it('has no message in linux app', async () => {
    await navigate('Linux');
    expect(await extractMessages(0)).toEqual([]);
    await navigate('All Messages');
});
// start_line:  261 
// end_line: 268 
it('deletes all backup messages and navigates to all messages', async () => {
    await navigate('Backup');
    await page.click('#delete-all');
    await navigate('All Messages');
    await createMessage(backup3, backupServerToken);
    await waitForExists(page, '.message .title', backup3.title);
    expect(await extractMessages(1)).toEqual([backup3]);
});
