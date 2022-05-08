// https://github.com/plotly/plotly.js/blob/d9d626ae53109144dd2a9eeea9c7daf5f1e45a37/test/jasmine/tests/select_test.js 

// blob: d9d626ae53109144dd2a9eeea9c7daf5f1e45a37 

// project_name: plotly/plotly.js 

// flaky_file: /test/jasmine/tests/select_test.js 

// test_affected: https://github.com/plotly/plotly.js/blob/d9d626ae53109144dd2a9eeea9c7daf5f1e45a37/test/jasmine/tests/select_test.js 
// start_line:  1299 
// end_line:  1334 
it('@flaky should cleanly clear and restart selections on double click when add/subtract mode on', function (done) {
    var gd = createGraphDiv();
    var fig = Lib.extendDeep({}, require('@mocks/0.json'));

    fig.layout.dragmode = 'select';
    Plotly.plot(gd, fig)
        .then(function () {
            return drag([[350, 100], [400, 400]]);
        })
        .then(function () {
            _assertSelectedPoints([49, 50, 51, 52, 53, 54, 55, 56, 57]);

            // Note: although Shift has no behavioral effect on clearing a selection
            // with a double click, users might hold the Shift key by accident.
            // This test ensures selection is cleared as expected although
            // the Shift key is held and no selection state is retained in any way.
            return doubleClick(500, 200, { shiftKey: true });
        })
        .then(function () {
            _assertSelectedPoints(null);
            return drag([[450, 100], [500, 400]], { shiftKey: true });
        })
        .then(function () {
            _assertSelectedPoints([67, 68, 69, 70, 71, 72, 73, 74]);
        })
        .catch(failTest)
        .then(done);

    function _assertSelectedPoints(selPts) {
        if (selPts) {
            expect(gd.data[0].selectedpoints).toEqual(selPts);
        } else {
            expect('selectedpoints' in gd.data[0]).toBe(false);
        }
    }
});
