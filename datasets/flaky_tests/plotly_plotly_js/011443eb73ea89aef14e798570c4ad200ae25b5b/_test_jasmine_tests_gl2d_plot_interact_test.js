// https://github.com/plotly/plotly.js/blob/011443eb73ea89aef14e798570c4ad200ae25b5b/test/jasmine/tests/gl2d_plot_interact_test.js 

// blob: 011443eb73ea89aef14e798570c4ad200ae25b5b 

// project_name: plotly/plotly.js 

// flaky_file: /test/jasmine/tests/gl2d_plot_interact_test.js 

// test_affected: https://github.com/plotly/plotly.js/blob/011443eb73ea89aef14e798570c4ad200ae25b5b/test/jasmine/tests/gl2d_plot_interact_test.js 
// start_line:  351 
// end_line:  380 
it('@flaky should be able to toggle visibility', function (done) {
    var _mock = Lib.extendDeep({}, mock);
    _mock.data[0].line.width = 5;

    Plotly.plot(gd, _mock)
        .then(delay(30))
        .then(function () {
            return Plotly.restyle(gd, 'visible', 'legendonly');
        })
        .then(function () {
            expect(gd.querySelector('.gl-canvas-context')).toBe(null);

            return Plotly.restyle(gd, 'visible', true);
        })
        .then(function () {
            expect(readPixel(gd.querySelector('.gl-canvas-context'), 108, 100)[0]).not.toBe(0);

            return Plotly.restyle(gd, 'visible', false);
        })
        .then(function () {
            expect(gd.querySelector('.gl-canvas-context')).toBe(null);

            return Plotly.restyle(gd, 'visible', true);
        })
        .then(function () {
            expect(readPixel(gd.querySelector('.gl-canvas-context'), 108, 100)[0]).not.toBe(0);
        })
        .catch(fail)
        .then(done);
});
