// https://github.com/plotly/plotly.js/blob/17b506815dc44ba90b1daf2d0891b822bebb2ab0/test/jasmine/tests/gl2d_plot_interact_test.js 

// blob: 17b506815dc44ba90b1daf2d0891b822bebb2ab0 

// project_name: plotly/plotly.js 

// flaky_file: /test/jasmine/tests/gl2d_plot_interact_test.js 

// test_affected: https://github.com/plotly/plotly.js/blob/17b506815dc44ba90b1daf2d0891b822bebb2ab0/test/jasmine/tests/gl2d_plot_interact_test.js 
// start_line:  25 
// end_line:  95 
describe('Test removal of gl contexts', function () {
    var gd;

    beforeEach(function () {
        gd = createGraphDiv();
    });

    afterEach(function () {
        Plotly.purge(gd);
        destroyGraphDiv();
    });

    it('@gl Plots.cleanPlot should remove gl context from the graph div of a gl2d plot', function (done) {
        Plotly.plot(gd, [{
            type: 'scattergl',
            x: [1, 2, 3],
            y: [2, 1, 3]
        }])
            .then(function () {
                expect(gd._fullLayout._plots.xy._scene).toBeDefined();
                Plots.cleanPlot([], {}, gd._fullData, gd._fullLayout);

                expect(!!gd._fullLayout._plots.xy._scene).toBe(false);
            })
            .catch(failTest)
            .then(done);
    });

    it('@gl Plotly.newPlot should remove gl context from the graph div of a gl2d plot', function (done) {
        var firstGlplotObject, firstGlContext, firstCanvas;

        Plotly.plot(gd, [{
            type: 'scattergl',
            x: [1, 2, 3],
            y: [2, 1, 3]
        }])
            .then(function () {
                firstGlplotObject = gd._fullLayout._plots.xy._scene;
                firstGlContext = firstGlplotObject.scatter2d.gl;
                firstCanvas = firstGlContext.canvas;

                expect(firstGlplotObject).toBeDefined();
                expect(firstGlContext).toBeDefined();
                expect(firstGlContext instanceof WebGLRenderingContext);

                return Plotly.newPlot(gd, [{
                    type: 'scattergl',
                    x: [1, 2, 3],
                    y: [2, 1, 3]
                }], {});
            })
            .then(function () {
                var secondGlplotObject = gd._fullLayout._plots.xy._scene;
                var secondGlContext = secondGlplotObject.scatter2d.gl;
                var secondCanvas = secondGlContext.canvas;

                expect(Object.keys(gd._fullLayout._plots).length === 1);
                expect(secondGlplotObject).not.toBe(firstGlplotObject);
                expect(firstGlplotObject.gl === null);
                expect(secondGlContext instanceof WebGLRenderingContext);
                expect(secondGlContext).not.toBe(firstGlContext);

                expect(
                    firstCanvas.parentNode === null ||
                    firstCanvas !== secondCanvas && firstGlContext.isContextLost()
                );
            })
            .catch(failTest)
            .then(done);
    });
});
