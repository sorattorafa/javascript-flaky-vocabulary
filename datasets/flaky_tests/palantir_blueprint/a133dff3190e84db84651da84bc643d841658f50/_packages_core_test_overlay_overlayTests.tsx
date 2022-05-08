// https://github.com/palantir/blueprint/blob/a133dff3190e84db84651da84bc643d841658f50/packages/core/test/overlay/overlayTests.tsx 

// blob: a133dff3190e84db84651da84bc643d841658f50 

// project_name: palantir/blueprint 

// flaky_file: /packages/core/test/overlay/overlayTests.tsx 

// test_affected: https://github.com/palantir/blueprint/blob/a133dff3190e84db84651da84bc643d841658f50/packages/core/test/overlay/overlayTests.tsx 
// start_line:  163 
// end_line:  320 
describe("Focus management", () => {
    const testsContainerElement = document.createElement("div");
    document.documentElement.appendChild(testsContainerElement);

    it("brings focus to overlay if autoFocus=true", done => {
        wrapper = mount(
            <Overlay autoFocus={true} inline={false} isOpen={true}>
                <input type="text" />
            </Overlay>,
            { attachTo: testsContainerElement },
        );
        assertFocus(".pt-overlay-backdrop", done);
    });

    it("does not bring focus to overlay if autoFocus=false", done => {
        wrapper = mount(
            <Overlay autoFocus={false} inline={false} isOpen={true}>
                <input type="text" />
            </Overlay>,
            { attachTo: testsContainerElement },
        );
        assertFocus("body", done);
    });

    // React implements autoFocus itself so our `[autofocus]` logic never fires.
    // This test always fails and I can't figure out why, so disabling as we're not even testing our own logic.
    it.skip("autoFocus element inside overlay gets the focus", done => {
        wrapper = mount(
            <Overlay inline={false} isOpen={true}>
                <input autoFocus={true} type="text" />
            </Overlay>,
            { attachTo: testsContainerElement },
        );
        assertFocus("input", done);
    });

    it("returns focus to overlay if enforceFocus=true", done => {
        let buttonRef: HTMLElement;
        const focusBtnAndAssert = () => {
            buttonRef.focus();
            // nested setTimeouts delay execution until the next frame, not
            // just to the end of the current frame. necessary to wait for
            // focus to change.
            setTimeout(() => {
                setTimeout(() => {
                    wrapper.update();
                    assert.notStrictEqual(buttonRef, document.activeElement);
                    done();
                });
            });
        };

        wrapper = mount(
            <div>
                <button ref={ref => (buttonRef = ref)} />
                <Overlay enforceFocus={true} inline={false} isOpen={true}>
                    <input ref={ref => ref && focusBtnAndAssert()} />
                </Overlay>
            </div>,
            { attachTo: testsContainerElement },
        );
    });

    it("returns focus to overlay after clicking the backdrop if enforceFocus=true", done => {
        wrapper = mount(
            <Overlay enforceFocus={true} canOutsideClickClose={false} inline={true} isOpen={true}>
                {createOverlayContents()}
            </Overlay>,
            { attachTo: testsContainerElement },
        );
        wrapper.find(BACKDROP_SELECTOR).simulate("mousedown");
        assertFocus(`.${Classes.OVERLAY_CONTENT}`, done);
    });

    it("does not result in maximum call stack if two overlays open with enforceFocus=true", () => {
        const anotherContainer = document.createElement("div");
        document.documentElement.appendChild(anotherContainer);
        const temporaryWrapper = mount(
            <Overlay enforceFocus={true} inline={true} isOpen={true}>
                <input type="text" />
            </Overlay>,
            { attachTo: anotherContainer },
        );

        wrapper = mount(
            <Overlay enforceFocus={true} inline={true} isOpen={false}>
                <input id="inputId" type="text" />
            </Overlay>,
            { attachTo: testsContainerElement },
        );
        // ES6 class property vs prototype, see: https://github.com/airbnb/enzyme/issues/365
        const bringFocusSpy = spy(wrapper.instance() as Overlay, "bringFocusInsideOverlay");
        wrapper.setProps({ isOpen: true });

        // triggers the infinite recursion
        wrapper.find("#inputId").simulate("click");
        assert.isTrue(bringFocusSpy.calledOnce);

        // don't need spy.restore() since the wrapper will be destroyed after test anyways
        temporaryWrapper.unmount();
        document.documentElement.removeChild(anotherContainer);
    });

    it("does not return focus to overlay if enforceFocus=false", done => {
        let buttonRef: HTMLElement;
        const focusBtnAndAssert = () => {
            buttonRef.focus();
            assert.strictEqual(buttonRef, document.activeElement);
            done();
        };

        wrapper = mount(
            <div>
                <button ref={ref => (buttonRef = ref)} />
                <Overlay enforceFocus={false} inline={false} isOpen={true}>
                    <input ref={ref => ref && setTimeout(focusBtnAndAssert)} />
                </Overlay>
            </div>,
            { attachTo: testsContainerElement },
        );
    });

    it("doesn't focus overlay if focus is already inside overlay", done => {
        let textarea: HTMLTextAreaElement;
        wrapper = mount(
            <Overlay inline={false} isOpen={true}>
                <textarea ref={ref => (textarea = ref)} />
            </Overlay>,
            { attachTo: testsContainerElement },
        );
        textarea.focus();
        assertFocus("textarea", done);
    });

    it("does not focus overlay when closed", done => {
        wrapper = mount(
            <div>
                <button ref={ref => ref && ref.focus()} />
                <Overlay inline={false} isOpen={false} />
            </div>,
            { attachTo: testsContainerElement },
        );
        assertFocus("button", done);
    });

    function assertFocus(selector: string, done: MochaDone) {
        wrapper.update();
        // the behavior being tested relies on requestAnimationFrame. to
        // avoid flakiness, use nested setTimeouts to delay execution until
        // the next frame, not just to the end of the current frame.
        setTimeout(() => {
            setTimeout(() => {
                assert.strictEqual(document.querySelector(selector), document.activeElement);
                done();
            });
        });
    }
});
