// https://github.com/angular/components/blob/253bff61613f39a463a83b24475af66c1de667d2/src/cdk/overlay/keyboard/overlay-keyboard-dispatcher.spec.ts 

// blob: 253bff61613f39a463a83b24475af66c1de667d2 

// project_name: angular/components 

// flaky_file: /src/cdk/overlay/keyboard/overlay-keyboard-dispatcher.spec.ts 

// test_affected: https://github.com/angular/components/blob/253bff61613f39a463a83b24475af66c1de667d2/src/cdk/overlay/keyboard/overlay-keyboard-dispatcher.spec.ts 
// start_line:  10 
// end_line:  137 
describe('OverlayKeyboardDispatcher', () => {
  let keyboardDispatcher: OverlayKeyboardDispatcher;
  let overlay: Overlay;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OverlayModule, TestComponentModule],
    });

    inject([OverlayKeyboardDispatcher, Overlay], (kbd: OverlayKeyboardDispatcher, o: Overlay) => {
      keyboardDispatcher = kbd;
      overlay = o;
    })();
  });

  afterEach(inject([OverlayContainer], (overlayContainer: OverlayContainer) => {
    overlayContainer.ngOnDestroy();
  }));

  it('should track overlays in order as they are attached and detached', () => {
    const overlayOne = overlay.create();
    const overlayTwo = overlay.create();

    // Attach overlays
    keyboardDispatcher.add(overlayOne);
    keyboardDispatcher.add(overlayTwo);

    expect(keyboardDispatcher._attachedOverlays.length)
      .toBe(2, 'Expected both overlays to be tracked.');
    expect(keyboardDispatcher._attachedOverlays[0]).toBe(overlayOne, 'Expected one to be first.');
    expect(keyboardDispatcher._attachedOverlays[1]).toBe(overlayTwo, 'Expected two to be last.');

    // Detach first one and re-attach it
    keyboardDispatcher.remove(overlayOne);
    keyboardDispatcher.add(overlayOne);

    expect(keyboardDispatcher._attachedOverlays[0])
      .toBe(overlayTwo, 'Expected two to now be first.');
    expect(keyboardDispatcher._attachedOverlays[1])
      .toBe(overlayOne, 'Expected one to now be last.');
  });

  it('should dispatch body keyboard events to the most recently attached overlay', () => {
    const overlayOne = overlay.create();
    const overlayTwo = overlay.create();
    const overlayOneSpy = jasmine.createSpy('overlayOne keyboard event spy');
    const overlayTwoSpy = jasmine.createSpy('overlayOne keyboard event spy');

    overlayOne.keydownEvents().subscribe(overlayOneSpy);
    overlayTwo.keydownEvents().subscribe(overlayTwoSpy);

    // Attach overlays
    keyboardDispatcher.add(overlayOne);
    keyboardDispatcher.add(overlayTwo);

    dispatchKeyboardEvent(document.body, 'keydown', ESCAPE);

    // Most recent overlay should receive event
    expect(overlayOneSpy).not.toHaveBeenCalled();
    expect(overlayTwoSpy).toHaveBeenCalled();
  });

  it('should dispatch targeted keyboard events to the overlay containing that target', () => {
    const overlayOne = overlay.create();
    const overlayTwo = overlay.create();
    const overlayOneSpy = jasmine.createSpy('overlayOne keyboard event spy');
    const overlayTwoSpy = jasmine.createSpy('overlayOne keyboard event spy');

    overlayOne.keydownEvents().subscribe(overlayOneSpy);
    overlayTwo.keydownEvents().subscribe(overlayTwoSpy);

    // Attach overlays
    keyboardDispatcher.add(overlayOne);
    keyboardDispatcher.add(overlayTwo);

    const overlayOnePane = overlayOne.overlayElement;

    dispatchKeyboardEvent(document.body, 'keydown', ESCAPE, overlayOnePane);

    // Targeted overlay should receive event
    expect(overlayOneSpy).toHaveBeenCalled();
    expect(overlayTwoSpy).not.toHaveBeenCalled();
  });

  it('should complete the keydown stream on dispose', () => {
    const overlayRef = overlay.create();
    const completeSpy = jasmine.createSpy('keydown complete spy');

    overlayRef.keydownEvents().subscribe(undefined, undefined, completeSpy);

    overlayRef.dispose();

    expect(completeSpy).toHaveBeenCalled();
  });

  it('should stop emitting events to detached overlays', () => {
    const instance = overlay.create();
    const spy = jasmine.createSpy('keyboard event spy');

    instance.attach(new ComponentPortal(TestComponent));
    instance.keydownEvents().subscribe(spy);

    dispatchKeyboardEvent(document.body, 'keydown', ESCAPE, instance.overlayElement);
    expect(spy).toHaveBeenCalledTimes(1);

    instance.detach();
    dispatchKeyboardEvent(document.body, 'keydown', ESCAPE, instance.overlayElement);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should stop emitting events to disposed overlays', () => {
    const instance = overlay.create();
    const spy = jasmine.createSpy('keyboard event spy');

    instance.attach(new ComponentPortal(TestComponent));
    instance.keydownEvents().subscribe(spy);

    dispatchKeyboardEvent(document.body, 'keydown', ESCAPE, instance.overlayElement);
    expect(spy).toHaveBeenCalledTimes(1);

    instance.dispose();
    dispatchKeyboardEvent(document.body, 'keydown', ESCAPE, instance.overlayElement);

    expect(spy).toHaveBeenCalledTimes(1);
  });

});
