// https://github.com/plotly/plotly.js/blob/5160948d6813b5de162fb6a68af44bd7be1bec9b/test/jasmine/tests/histogram2d_test.js 

// blob: 5160948d6813b5de162fb6a68af44bd7be1bec9b 

// project_name: plotly/plotly.js 

// flaky_file: /test/jasmine/tests/histogram2d_test.js 

// test_affected: https://github.com/plotly/plotly.js/blob/5160948d6813b5de162fb6a68af44bd7be1bec9b/test/jasmine/tests/histogram2d_test.js 
// start_line:  175 
// end_line:  203 
it('@flaky should sort z data based on axis categoryorder for ' + traceType, function () {
    var mock = require('@mocks/heatmap_categoryorder');
    var mockCopy = Lib.extendDeep({}, mock);
    var data = mockCopy.data[0];
    data.type = traceType;
    var layout = mockCopy.layout;

    // sort x axis categories
    var mockLayout = Lib.extendDeep({}, layout);
    var out = _calc(data, mockLayout);
    mockLayout.xaxis.categoryorder = 'category ascending';
    var out1 = _calc(data, mockLayout);

    expect(out._xcategories).toEqual(out1._xcategories.slice().reverse());
    // Check z data is also sorted
    for (var i = 0; i < out.z.length; i++) {
        expect(out1.z[i]).toEqual(out.z[i].slice().reverse());
    }

    // sort y axis categories
    mockLayout = Lib.extendDeep({}, layout);
    out = _calc(data, mockLayout);
    mockLayout.yaxis.categoryorder = 'category ascending';
    out1 = _calc(data, mockLayout);

    expect(out._ycategories).toEqual(out1._ycategories.slice().reverse());
    // Check z data is also sorted
    expect(out1.z).toEqual(out.z.slice().reverse());
});
