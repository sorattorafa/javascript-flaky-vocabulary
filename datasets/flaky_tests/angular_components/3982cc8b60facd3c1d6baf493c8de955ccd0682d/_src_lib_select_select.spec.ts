// https://github.com/angular/components/blob/3982cc8b60facd3c1d6baf493c8de955ccd0682d/src/lib/select/select.spec.ts 

// blob: 3982cc8b60facd3c1d6baf493c8de955ccd0682d 

// project_name: angular/components 

// flaky_file: /src/lib/select/select.spec.ts 

// test_affected: https://github.com/angular/components/blob/3982cc8b60facd3c1d6baf493c8de955ccd0682d/src/lib/select/select.spec.ts 
// start_line:  1180 
// end_line:  1231 
it('should adjust position of centered option if there is little space above', async(() => {
  const selectMenuHeight = 256;
  const selectMenuViewportPadding = 8;
  const selectItemHeight = 48;
  const selectedIndex = 4;
  const fontSize = 16;
  const lineHeightEm = 1.125;
  const expectedExtraScroll = 5;

  // Trigger element height.
  const triggerHeight = fontSize * lineHeightEm;

  // Ideal space above selected item in order to center it.
  const idealSpaceAboveSelectedItem = (selectMenuHeight - selectItemHeight) / 2;

  // Actual space above selected item.
  const actualSpaceAboveSelectedItem = selectItemHeight * selectedIndex;

  // Ideal scroll position to center.
  const idealScrollTop = actualSpaceAboveSelectedItem - idealSpaceAboveSelectedItem;

  // Top-most select-position that allows for perfect centering.
  const topMostPositionForPerfectCentering =
    idealSpaceAboveSelectedItem + selectMenuViewportPadding +
    (selectItemHeight - triggerHeight) / 2;

  // Position of select relative to top edge of mat-form-field.
  const formFieldTopSpace =
    trigger.getBoundingClientRect().top - formField.getBoundingClientRect().top;

  const formFieldTop =
    topMostPositionForPerfectCentering - formFieldTopSpace - expectedExtraScroll;

  formField.style.top = `${formFieldTop}px`;

  // Select an option in the middle of the list
  fixture.componentInstance.control.setValue('chips-4');
  fixture.detectChanges();

  trigger.click();
  fixture.detectChanges();

  const scrollContainer = document.querySelector('.cdk-overlay-pane .mat-select-panel')!;

  fixture.whenStable().then(() => {
    expect(Math.ceil(scrollContainer.scrollTop))
      .toEqual(Math.ceil(idealScrollTop + 5),
        `Expected panel to adjust scroll position to fit in viewport.`);

    checkTriggerAlignedWithOption(4);
  });
}));
// start_line:  1233 
// end_line:  1299 
it('should adjust position of centered option if there is little space below', async(() => {
  const selectMenuHeight = 256;
  const selectMenuViewportPadding = 8;
  const selectItemHeight = 48;
  const selectedIndex = 4;
  const fontSize = 16;
  const lineHeightEm = 1.125;
  const expectedExtraScroll = 5;

  // Trigger element height.
  const triggerHeight = fontSize * lineHeightEm;

  // Ideal space above selected item in order to center it.
  const idealSpaceAboveSelectedItem = (selectMenuHeight - selectItemHeight) / 2;

  // Actual space above selected item.
  const actualSpaceAboveSelectedItem = selectItemHeight * selectedIndex;

  // Ideal scroll position to center.
  const idealScrollTop = actualSpaceAboveSelectedItem - idealSpaceAboveSelectedItem;

  // Bottom-most select-position that allows for perfect centering.
  const bottomMostPositionForPerfectCentering =
    idealSpaceAboveSelectedItem + selectMenuViewportPadding +
    (selectItemHeight - triggerHeight) / 2;

  // Position of select relative to bottom edge of mat-form-field:
  const formFieldBottomSpace =
    formField.getBoundingClientRect().bottom - trigger.getBoundingClientRect().bottom;

  const formFieldBottom =
    bottomMostPositionForPerfectCentering - formFieldBottomSpace - expectedExtraScroll;

  // Push the select to a position with not quite enough space on the bottom to open
  // with the option completely centered (needs 113px at least: 256/2 - 48/2 + 9)
  formField.style.bottom = `${formFieldBottom}px`;

  // Select an option in the middle of the list
  fixture.componentInstance.control.setValue('chips-4');
  fixture.detectChanges();

  fixture.whenStable().then(() => {
    fixture.detectChanges();

    trigger.click();
    fixture.detectChanges();

    const scrollContainer = document.querySelector('.cdk-overlay-pane .mat-select-panel')!;

    fixture.whenStable().then(() => {
      // Scroll should adjust by the difference between the bottom space available
      // (56px from the bottom of the screen - 8px padding = 48px)
      // and the height of the panel below the option (113px).
      // 113px - 48px = 75px difference. Original scrollTop 88px - 75px = 23px
      const difference = Math.ceil(scrollContainer.scrollTop) -
        Math.ceil(idealScrollTop - expectedExtraScroll);

      // Note that different browser/OS combinations report the different dimensions with
      // slight deviations (< 1px). We round the expectation and check that the values
      // are within a pixel of each other to avoid flakes.
      expect(Math.abs(difference) < 2)
        .toBe(true, `Expected panel to adjust scroll position to fit in viewport.`);

      checkTriggerAlignedWithOption(4);
    });
  });
}));
// start_line:  1301 
// end_line:  1330 
it('should fall back to "above" positioning if scroll adjustment will not help', () => {
  // Push the select to a position with not enough space on the bottom to open
  formField.style.bottom = '56px';
  fixture.detectChanges();

  // Select an option that cannot be scrolled any farther upward
  fixture.componentInstance.control.setValue('coke-0');
  fixture.detectChanges();

  trigger.click();
  fixture.detectChanges();

  const overlayPane = document.querySelector('.cdk-overlay-pane')!;
  const triggerBottom = trigger.getBoundingClientRect().bottom;
  const overlayBottom = overlayPane.getBoundingClientRect().bottom;
  const scrollContainer = overlayPane.querySelector('.mat-select-panel')!;

  // Expect no scroll to be attempted
  expect(scrollContainer.scrollTop).toEqual(0, `Expected panel not to be scrolled.`);

  const difference = Math.floor(overlayBottom) - Math.floor(triggerBottom);

  // Check that the values are within a pixel of each other. This avoids sub-pixel
  // deviations between OS and browser versions.
  expect(Math.abs(difference) < 2)
    .toEqual(true, `Expected trigger bottom to align with overlay bottom.`);

  expect(fixture.componentInstance.select._transformOrigin)
    .toContain(`bottom`, `Expected panel animation to originate at the bottom.`);
});
// start_line:  1495 
// end_line:  1542 
it('should align a centered option properly when scrolling while the panel is open', () => {
  fixture.componentInstance.heightBelow = 400;
  fixture.componentInstance.heightAbove = 400;
  fixture.componentInstance.control.setValue('chips-4');
  fixture.detectChanges();

  trigger.click();
  fixture.detectChanges();

  setScrollTop(100);
  scrolledSubject.next();
  fixture.detectChanges();

  checkTriggerAlignedWithOption(4);
});

it('should fall back to "above" positioning properly when scrolled', () => {
  // Give the select insufficient space to open below the trigger
  fixture.componentInstance.heightAbove = 0;
  fixture.componentInstance.heightBelow = 100;
  trigger.style.marginTop = '2000px';
  fixture.detectChanges();

  // Scroll the select into view
  setScrollTop(1400);

  // In the iOS simulator (BrowserStack & SauceLabs), adding the content to the
  // body causes karma's iframe for the test to stretch to fit that content once we attempt to
  // scroll the page. Setting width / height / maxWidth / maxHeight on the iframe does not
  // successfully constrain its size. As such, skip assertions in environments where the
  // window size has changed since the start of the test.
  if (window.innerHeight > startingWindowHeight) {
    return;
  }

  trigger.click();
  fixture.detectChanges();

  const overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane')!;
  const triggerBottom = trigger.getBoundingClientRect().bottom;
  const overlayBottom = overlayPane.getBoundingClientRect().bottom;
  const difference = Math.floor(overlayBottom) - Math.floor(triggerBottom);

  // Check that the values are within a pixel of each other. This avoids sub-pixel
  // deviations between OS and browser versions.
  expect(Math.abs(difference) < 2)
    .toEqual(true, `Expected trigger bottom to align with overlay bottom.`);
});
// start_line:  1721 
// end_line: 1752 
it('should align the first option to the trigger, if nothing is selected', async(() => {
  // Push down the form field so there is space for the item to completely align.
  formField.style.top = '100px';

  const menuItemHeight = 48;
  const triggerFontSize = 16;
  const triggerLineHeightEm = 1.125;
  const triggerHeight = triggerFontSize * triggerLineHeightEm;

  trigger.click();
  groupFixture.detectChanges();

  fixture.whenStable().then(() => {
    const triggerTop = trigger.getBoundingClientRect().top;

    const option = overlayContainerElement.querySelector('.cdk-overlay-pane mat-option');
    const optionTop = option ? option.getBoundingClientRect().top : 0;

    // There appears to be a small rounding error on IE, so we verify that the value is close,
    // not exact.
    let platform = new Platform();
    if (platform.TRIDENT) {
      let difference =
        Math.abs(optionTop + (menuItemHeight - triggerHeight) / 2 - triggerTop);
      expect(difference)
        .toBeLessThan(0.1, 'Expected trigger to align with the first option.');
    } else {
      expect(Math.floor(optionTop + (menuItemHeight - triggerHeight) / 2))
        .toBe(Math.floor(triggerTop), 'Expected trigger to align with the first option.');
    }
  });
}));
