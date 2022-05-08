// https://github.com/plotly/plotly.js/blob/4e6935aede26f25466c1817ef6addb3c259ab35c/test/jasmine/tests/gl2d_plot_interact_test.js 

// blob: 4e6935aede26f25466c1817ef6addb3c259ab35c 

// project_name: plotly/plotly.js 

// flaky_file: /test/jasmine/tests/gl2d_plot_interact_test.js 

// test_affected: https://github.com/plotly/plotly.js/blob/4e6935aede26f25466c1817ef6addb3c259ab35c/test/jasmine/tests/gl2d_plot_interact_test.js 
// start_line:  574 
// end_line:  639 
it('@flaky supports axis constraints with zoom', function (done) {
    var centerX;
    var centerY;

    Plotly.newPlot(gd, [{
        type: 'scattergl', x: [1, 15], y: [1, 15]
    }], {
        width: 400,
        height: 400,
        margin: { t: 100, b: 100, l: 100, r: 100 },
        xaxis: { range: [0, 16] },
        yaxis: { range: [0, 16] }
    })
        .then(function () {
            var bBox = gd.getBoundingClientRect();
            centerX = bBox.left + 200;
            centerY = bBox.top + 200;

            return Plotly.relayout(gd, {
                'yaxis.scaleanchor': 'x',
                'yaxis.scaleratio': 2
            });
        })
        .then(function () {
            // x range is adjusted to fit constraint
            expect(gd.layout.xaxis.range).toBeCloseToArray([-8, 24], 3);
            expect(gd.layout.yaxis.range).toBeCloseToArray([0, 16], 3);
        })
        .then(function () {
            return mouseTo([centerX, centerY], [centerX - 5, centerY + 5]);
        })
        .then(function () {
            // no change - too small
            expect(gd.layout.xaxis.range).toBeCloseToArray([-8, 24], 3);
            expect(gd.layout.yaxis.range).toBeCloseToArray([0, 16], 3);
        })
        .then(function () {
            // now there should only be 2D zooming
            // dy>>dx
            return mouseTo([centerX, centerY], [centerX - 1, centerY - 50]);
        })
        .then(function () {
            expect(gd.layout.xaxis.range).toBeCloseToArray([0, 8], 3);
            expect(gd.layout.yaxis.range).toBeCloseToArray([8, 12], 3);
        })
        .then(function () {
            return mouseTo([centerX, centerY], [centerX + 50, centerY + 1]);
        })
        .then(function () {
            // dx>>dy
            expect(gd.layout.xaxis.range).toBeCloseToArray([4, 6], 3);
            expect(gd.layout.yaxis.range).toBeCloseToArray([9, 10], 3);
        })
        .then(function () {
            return Plotly.relayout(gd, {
                'xaxis.autorange': true,
                'yaxis.autorange': true
            });
        })
        .then(function () {
            expect(gd.layout.xaxis.range).toBeCloseToArray([-8.2, 24.2], 1);
            expect(gd.layout.yaxis.range).toBeCloseToArray([-0.12, 16.1], 1);
        })
        .catch(fail)
        .then(done);
});
// start_line:  641 
// end_line:  652 
it('@flaky should change plot type with incomplete data', function (done) {
    Plotly.plot(gd, [{}]);
    expect(function () {
        Plotly.restyle(gd, { type: 'scattergl', x: [[1]] }, 0);
    }).not.toThrow();

    expect(function () {
        Plotly.restyle(gd, { y: [[1]] }, 0);
    }).not.toThrow();

    done();
});
// start_line:  697 
// end_line:  749 
it('@flaky should not scroll document while panning', function (done) {
    var mock = {
        data: [
            { type: 'scattergl', y: [1, 2, 3], x: [1, 2, 3] }
        ],
        layout: {
            width: 500,
            height: 500
        }
    };

    var sceneTarget, relayoutCallback = jasmine.createSpy('relayoutCallback');

    function scroll(target, amt) {
        return new Promise(function (resolve) {
            target.dispatchEvent(new WheelEvent('wheel', { deltaY: amt || 1, cancelable: true }));
            setTimeout(resolve, 0);
        });
    }

    function touchDrag(target, start, end) {
        return new Promise(function (resolve) {
            touchEvent('touchstart', start[0], start[1], { element: target });
            touchEvent('touchmove', end[0], end[1], { element: target });
            touchEvent('touchend', end[0], end[1], { element: target });
            setTimeout(resolve, 0);
        });
    }

    function assertEvent(e) {
        expect(e.defaultPrevented).toEqual(true);
        relayoutCallback();
    }

    gd.addEventListener('touchstart', assertEvent);
    gd.addEventListener('wheel', assertEvent);

    Plotly.plot(gd, mock)
        .then(function () {
            sceneTarget = gd.querySelector('.nsewdrag');

            return touchDrag(sceneTarget, [100, 100], [0, 0]);
        })
        .then(function () {
            return scroll(sceneTarget);
        })
        .then(function () {
            expect(relayoutCallback).toHaveBeenCalledTimes(1);

        })
        .catch(fail)
        .then(done);
});
// start_line:  859 
// end_line:  874 
it('@flaky should remove fill2d', function (done) {
    var mock = require('@mocks/gl2d_axes_labels2.json');

    Plotly.plot(gd, mock.data, mock.layout)
        .then(delay(1000))
        .then(function () {
            expect(readPixel(gd.querySelector('.gl-canvas-context'), 100, 80)[0]).not.toBe(0);

            return Plotly.restyle(gd, { fill: 'none' });
        })
        .then(function () {
            expect(readPixel(gd.querySelector('.gl-canvas-context'), 100, 80)[0]).toBe(0);
        })
        .catch(fail)
        .then(done);
});
