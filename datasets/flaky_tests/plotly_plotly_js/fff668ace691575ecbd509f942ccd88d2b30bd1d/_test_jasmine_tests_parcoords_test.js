// https://github.com/plotly/plotly.js/blob/fff668ace691575ecbd509f942ccd88d2b30bd1d/test/jasmine/tests/parcoords_test.js 

// blob: fff668ace691575ecbd509f942ccd88d2b30bd1d 

// project_name: plotly/plotly.js 

// flaky_file: /test/jasmine/tests/parcoords_test.js 

// test_affected: https://github.com/plotly/plotly.js/blob/fff668ace691575ecbd509f942ccd88d2b30bd1d/test/jasmine/tests/parcoords_test.js 
// start_line:  1147 
// end_line:  1207 
it('@flaky snaps ordinal constraints', function (done) {
    // first: drag almost to 2 but not quite - constraint will snap back to [2.75, 4]
    mostOfDrag(105, 165, 105, 190);
    var newDashArray = getDashArray(0);
    expect(newDashArray).not.toBe(initialDashArray0);
    checkDashCount(newDashArray, 1);

    mouseEvent('mouseup', 105, 190);
    delay(snapDelay)().then(function () {
        expect(getDashArray(0)).toBe(initialDashArray0);
        expect(gd.data[0].dimensions[0].constraintrange).toBeCloseToArray([2.75, 4]);

        // now select a range between 1 and 2 but missing both - it will disappear on mouseup
        mostOfDrag(105, 210, 105, 240);
        newDashArray = getDashArray(0);
        checkDashCount(newDashArray, 2);

        mouseEvent('mouseup', 105, 240);
    })
        .then(delay(snapDelay))
        .then(function () {
            expect(getDashArray(0)).toBe(initialDashArray0);
            expect(gd.data[0].dimensions[0].constraintrange).toBeCloseToArray([2.75, 4]);

            // select across 1, making a new region
            mostOfDrag(105, 240, 105, 260);
            newDashArray = getDashArray(0);
            checkDashCount(newDashArray, 2);

            mouseEvent('mouseup', 105, 260);
        })
        .then(delay(snapDelay))
        .then(function () {
            newDashArray = getDashArray(0);
            checkDashCount(newDashArray, 2);
            expect(gd.data[0].dimensions[0].constraintrange).toBeCloseTo2DArray([[0.75, 1.25], [2.75, 4]]);

            // select from 2 down to just above 1, extending the new region
            mostOfDrag(105, 190, 105, 240);
            newDashArray = getDashArray(0);
            checkDashCount(newDashArray, 2);

            mouseEvent('mouseup', 105, 240);
        })
        .then(delay(snapDelay))
        .then(function () {
            newDashArray = getDashArray(0);
            checkDashCount(newDashArray, 2);
            expect(gd.data[0].dimensions[0].constraintrange).toBeCloseTo2DArray([[0.75, 2.25], [2.75, 4]]);

            // clear the whole thing
            click(105, 290);
        })
        .then(delay(snapDelay))
        .then(function () {
            checkDashCount(getDashArray(0), 0);
            expect(gd.data[0].dimensions[0].constraintrange).toBeUndefined();
        })
        .catch(failTest)
        .then(done);
});
