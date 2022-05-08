// https://github.com/angular/angular/blob/deca6a60ddddb45caae97942977591204a7e56f9/aio/tests/e2e/app.e2e-spec.ts  

// blob: deca6a60ddddb45caae97942977591204a7e56f9 

// project_name: angular/angular 

// flaky_file: /aio/tests/e2e/app.e2e-spec.ts 

// test_affected: https://github.com/angular/angular/blob/deca6a60ddddb45caae97942977591204a7e56f9/aio/tests/e2e/app.e2e-spec.ts  
// start_line:  143 
// end_line:  173 
it('should have contributors listed in each group', () => {
    // WebDriver calls `scrollIntoView()` on the element to bring it into the visible area of the
    // browser, before clicking it. By default, this aligns the top of the element to the top of
    // the window. As a result, the element may end up behing the fixed top menu, thus being
    // unclickable. To avoid this, we click the element directly using JavaScript instead.
    const clickButton = (elementFinder: ElementFinder) => elementFinder.getWebElement().then(
        webElement => browser.executeScript('arguments[0].click()', webElement));
    const getContributorNames =
        () => contributors.all(by.css('h3')).map<string>(c => c && c.getText());

    const names1 = getContributorNames();
    expect(contributors.count()).toBeGreaterThan(1);

    clickButton(groupButtons.get(1));
    const names2 = getContributorNames();
    expect(contributors.count()).toBeGreaterThan(1);
    expect(names2).not.toEqual(names1);

    clickButton(groupButtons.get(2));
    const names3 = getContributorNames();
    expect(contributors.count()).toBeGreaterThan(1);
    expect(names3).not.toEqual(names2);
    expect(names3).not.toEqual(names1);

    clickButton(groupButtons.get(0));
    const names4 = getContributorNames();
    expect(contributors.count()).toBeGreaterThan(1);
    expect(names4).not.toEqual(names3);
    expect(names4).not.toEqual(names2);
    expect(names4).toEqual(names1);
});
