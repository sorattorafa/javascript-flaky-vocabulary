// https://github.com/angular/components/blob/86da318c280ec6dc10260c411352086fc87515de/src/material/slide-toggle/slide-toggle.spec.ts 

// blob: 86da318c280ec6dc10260c411352086fc87515de 

// project_name: angular/components 

// flaky_file: /src/material/slide-toggle/slide-toggle.spec.ts 

// test_affected: https://github.com/angular/components/blob/86da318c280ec6dc10260c411352086fc87515de/src/material/slide-toggle/slide-toggle.spec.ts 
// start_line:  392 
// end_line:  433 
it('should not change value on click when click action is noop', () => {
  TestBed
    .resetTestingModule()
    .configureTestingModule({
      imports: [MatSlideToggleModule],
      declarations: [SlideToggleBasic],
      providers: [
        {
          provide: HAMMER_GESTURE_CONFIG,
          useFactory: () => gestureConfig = new TestGestureConfig()
        },
        { provide: MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS, useValue: { disableToggleValue: true } },
      ]
    });
  const fixture = TestBed.createComponent(SlideToggleBasic);
  fixture.detectChanges();

  const testComponent = fixture.debugElement.componentInstance;
  const slideToggleDebug = fixture.debugElement.query(By.css('mat-slide-toggle'));

  const slideToggle = slideToggleDebug.componentInstance;
  const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
  const labelElement = fixture.debugElement.query(By.css('label')).nativeElement;

  expect(testComponent.toggleTriggered).toBe(0);
  expect(testComponent.dragTriggered).toBe(0);
  expect(slideToggle.checked).toBe(false, 'Expect slide toggle value not changed');

  labelElement.click();
  fixture.detectChanges();

  expect(slideToggle.checked).toBe(false, 'Expect slide toggle value not changed');
  expect(testComponent.toggleTriggered).toBe(1, 'Expect toggle once');
  expect(testComponent.dragTriggered).toBe(0);

  inputElement.click();
  fixture.detectChanges();

  expect(slideToggle.checked).toBe(false, 'Expect slide toggle value not changed');
  expect(testComponent.toggleTriggered).toBe(2, 'Expect toggle twice');
  expect(testComponent.dragTriggered).toBe(0);
});
