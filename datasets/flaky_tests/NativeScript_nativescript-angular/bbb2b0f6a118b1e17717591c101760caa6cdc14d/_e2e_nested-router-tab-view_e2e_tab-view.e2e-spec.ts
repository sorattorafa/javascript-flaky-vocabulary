// https://github.com/NativeScript/nativescript-angular/blob/bbb2b0f6a118b1e17717591c101760caa6cdc14d/e2e/nested-router-tab-view/e2e/tab-view.e2e-spec.ts 

// blob: bbb2b0f6a118b1e17717591c101760caa6cdc14d 

// project_name: NativeScript/nativescript-angular 

// flaky_file: /e2e/nested-router-tab-view/e2e/tab-view.e2e-spec.ts 

// test_affected: https://github.com/NativeScript/nativescript-angular/blob/bbb2b0f6a118b1e17717591c101760caa6cdc14d/e2e/nested-router-tab-view/e2e/tab-view.e2e-spec.ts 
// start_line:  48 
// end_line:  58 
it("should navigate Player One/Team One then back separately", async function () {
    this.retries(2);
    await testPlayerNavigated(screen, screen.playerOne);
    await gotoTeamsTab(driver);
    await testTeamNavigated(screen, screen.teamOne);
    await backTeams(driver);
    await screen.loadedTeamList();
    await gotoPlayersTab(driver);
    await backPlayers(driver);
    await screen.loadedPlayersList();
});
