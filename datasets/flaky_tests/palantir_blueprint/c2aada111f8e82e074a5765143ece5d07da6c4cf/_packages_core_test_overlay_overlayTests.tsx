// https://github.com/palantir/blueprint/blob/c2aada111f8e82e074a5765143ece5d07da6c4cf/packages/core/test/overlay/overlayTests.tsx 

// blob: c2aada111f8e82e074a5765143ece5d07da6c4cf 

// project_name: palantir/blueprint 

// flaky_file: /packages/core/test/overlay/overlayTests.tsx 

// test_affected: https://github.com/palantir/blueprint/blob/c2aada111f8e82e074a5765143ece5d07da6c4cf/packages/core/test/overlay/overlayTests.tsx 
// start_line:  168 
// end_line:  176 
it.skip("brings focus to overlay if autoFocus=true", done => {
    wrapper = mount(
        <Overlay autoFocus={true} inline={false} isOpen={true}>
            <input type="text" />
        </Overlay>,
        { attachTo: testsContainerElement },
    );
    assertFocus(".pt-overlay-backdrop", done);
});
