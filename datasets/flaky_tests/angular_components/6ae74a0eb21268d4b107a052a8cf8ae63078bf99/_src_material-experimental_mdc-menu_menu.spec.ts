// https://github.com/angular/components/blob/6ae74a0eb21268d4b107a052a8cf8ae63078bf99/src/material-experimental/mdc-menu/menu.spec.ts 

// blob: 6ae74a0eb21268d4b107a052a8cf8ae63078bf99 

// project_name: angular/components 

// flaky_file: /src/material-experimental/mdc-menu/menu.spec.ts 

// test_affected: https://github.com/angular/components/blob/6ae74a0eb21268d4b107a052a8cf8ae63078bf99/src/material-experimental/mdc-menu/menu.spec.ts 
// start_line:  851 
// end_line:  861 
it('should focus the menu panel if all items are disabled', fakeAsync(() => {
  const fixture = createComponent(SimpleMenuWithRepeater, [], [FakeIcon]);
  fixture.componentInstance.items.forEach(item => item.disabled = true);
  fixture.detectChanges();
  fixture.componentInstance.trigger.openMenu();
  fixture.detectChanges();
  tick(500);

  expect(document.activeElement)
    .toBe(overlayContainerElement.querySelector('.mat-mdc-menu-panel'));
}));
// start_line:  863 
// end_line:  873 
it('should focus the menu panel if all items are disabled inside lazy content', fakeAsync(() => {
  const fixture = createComponent(SimpleMenuWithRepeaterInLazyContent, [], [FakeIcon]);
  fixture.componentInstance.items.forEach(item => item.disabled = true);
  fixture.detectChanges();
  fixture.componentInstance.trigger.openMenu();
  fixture.detectChanges();
  tick(500);

  expect(document.activeElement)
    .toBe(overlayContainerElement.querySelector('.mat-mdc-menu-panel'));
}));
