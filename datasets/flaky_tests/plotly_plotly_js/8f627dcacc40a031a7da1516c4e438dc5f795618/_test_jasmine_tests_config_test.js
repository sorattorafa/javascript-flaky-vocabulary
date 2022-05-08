// https://github.com/plotly/plotly.js/blob/8f627dcacc40a031a7da1516c4e438dc5f795618/test/jasmine/tests/config_test.js 

// blob: 8f627dcacc40a031a7da1516c4e438dc5f795618 

// project_name: plotly/plotly.js 

// flaky_file: /test/jasmine/tests/config_test.js 

// test_affected: https://github.com/plotly/plotly.js/blob/8f627dcacc40a031a7da1516c4e438dc5f795618/test/jasmine/tests/config_test.js 
// start_line:  618 
// end_line:  624 
it('@flaky should still be responsive if the plot is edited', function (done) {
    fillParent(1, 1);
    Plotly.plot(gd, data, {}, { responsive: true })
        .then(function () { return Plotly.restyle(gd, 'y[0]', data[0].y[0] + 2); })
        .then(testResponsive)
        .then(done);
});
