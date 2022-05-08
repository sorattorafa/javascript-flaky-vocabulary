// https://github.com/nfl/react-helmet/blob/a2323add50c15bf6a1047b5d99753cce6db07fd6/test/HelmetDeclarativeTest.js  

// blob: a2323add50c15bf6a1047b5d99753cce6db07fd6 

// project_name: nfl/react-helmet 

// flaky_file: /test/HelmetDeclarativeTest.js 

// test_affected: https://github.com/nfl/react-helmet/blob/a2323add50c15bf6a1047b5d99753cce6db07fd6/test/HelmetDeclarativeTest.js  
// start_line:  315 
// end_line:  340 
it.skip("clears title tag if empty title is defined", done => {
    ReactDOM.render(
        <Helmet>
            <title>Existing Title</title>
            <meta name="keywords" content="stuff" />
        </Helmet>,
        container
    );

    requestAnimationFrame(() => {
        expect(document.title).to.equal("Existing Title");

        ReactDOM.render(
            <Helmet>
                <title>{" "}</title>
                <meta name="keywords" content="stuff" />
            </Helmet>,
            container
        );

        requestAnimationFrame(() => {
            expect(document.title).to.equal("");
            done();
        });
    });
});
