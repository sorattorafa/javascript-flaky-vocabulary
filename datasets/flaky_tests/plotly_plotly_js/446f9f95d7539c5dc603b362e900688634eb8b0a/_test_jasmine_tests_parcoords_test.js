// https://github.com/plotly/plotly.js/blob/446f9f95d7539c5dc603b362e900688634eb8b0a/test/jasmine/tests/parcoords_test.js 

// blob: 446f9f95d7539c5dc603b362e900688634eb8b0a 

// project_name: plotly/plotly.js 

// flaky_file: /test/jasmine/tests/parcoords_test.js 

// test_affected: https://github.com/plotly/plotly.js/blob/446f9f95d7539c5dc603b362e900688634eb8b0a/test/jasmine/tests/parcoords_test.js 
// start_line:  499 
// end_line:  531 
it('@flaky Skip dimensions which are not plain objects or whose `values` is not an array', function (done) {

    var mockCopy = Lib.extendDeep({}, mock1);
    var newDimension, i, j;

    mockCopy.layout.width = 680;
    mockCopy.data[0].dimensions = [];
    for (i = 0; i < 5; i++) {
        newDimension = Lib.extendDeep({}, mock1.data[0].dimensions[0]);
        newDimension.id = 'S' + i;
        newDimension.label = 'S' + i;
        delete newDimension.constraintrange;
        newDimension.range = [1, 2];
        newDimension.values = [];
        for (j = 0; j < 100; j++) {
            newDimension.values[j] = 1 + Math.random();
        }
        mockCopy.data[0].dimensions[i] = newDimension;
    }

    mockCopy.data[0].dimensions[0] = 'This is not a plain object';
    mockCopy.data[0].dimensions[1].values = 'This is not an array';

    var gd = createGraphDiv();
    Plotly.plot(gd, mockCopy.data, mockCopy.layout).then(function () {

        expect(gd.data.length).toEqual(1);
        expect(gd.data[0].dimensions.length).toEqual(5); // it's still five, but ...
        expect(document.querySelectorAll('.axis').length).toEqual(3); // only 3 axes shown
    })
        .catch(fail)
        .then(done);
});
