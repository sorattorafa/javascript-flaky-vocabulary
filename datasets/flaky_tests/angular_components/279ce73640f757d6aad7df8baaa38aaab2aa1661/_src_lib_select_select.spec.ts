//  https://github.com/angular/components/blob/279ce73640f757d6aad7df8baaa38aaab2aa1661/src/lib/select/select.spec.ts 

// blob: 279ce73640f757d6aad7df8baaa38aaab2aa1661 

// project_name: angular/components 

// flaky_file: /src/lib/select/select.spec.ts 

// test_affected:  https://github.com/angular/components/blob/279ce73640f757d6aad7df8baaa38aaab2aa1661/src/lib/select/select.spec.ts 
// start_line:  3313 
// end_line:  3336 
it('should keep the position within the viewport on repeat openings', fakeAsync(() => {
    formField.style.left = '-100px';
    trigger.click();
    fixture.detectChanges();
    flush();

    let panelLeft = document.querySelector('.mat-select-panel')!.getBoundingClientRect().left;

    expect(panelLeft)
        .toBeGreaterThanOrEqual(0, `Expected select panel to be inside the viewport.`);

    fixture.componentInstance.select.close();
    fixture.detectChanges();
    flush();

    trigger.click();
    fixture.detectChanges();
    flush();

    panelLeft = document.querySelector('.mat-select-panel')!.getBoundingClientRect().left;

    expect(panelLeft).toBeGreaterThanOrEqual(0,
        `Expected select panel continue being inside the viewport.`);
}));
