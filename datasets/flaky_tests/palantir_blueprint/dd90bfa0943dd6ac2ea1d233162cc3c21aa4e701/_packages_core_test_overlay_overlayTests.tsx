// https://github.com/palantir/blueprint/blob/dd90bfa0943dd6ac2ea1d233162cc3c21aa4e701/packages/core/test/overlay/overlayTests.tsx 

// blob: dd90bfa0943dd6ac2ea1d233162cc3c21aa4e701 

// project_name: palantir/blueprint 

// flaky_file: /packages/core/test/overlay/overlayTests.tsx 

// test_affected: https://github.com/palantir/blueprint/blob/dd90bfa0943dd6ac2ea1d233162cc3c21aa4e701/packages/core/test/overlay/overlayTests.tsx 
// start_line:  160 
// end_line:  168 
it.skip("brings focus to overlay if autoFocus=true", (done) => {
    wrapper = mount(
        <Overlay autoFocus={true} inline={false} isOpen={true}>
            <input type="text" />
        </Overlay>,
        { attachTo: testsContainerElement },
    );
    assertFocus(".pt-overlay-backdrop", done);
});
