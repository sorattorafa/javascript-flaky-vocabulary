//  https://github.com/plotly/plotly.js/blob/44b0ae6f9e4c1c4ea79ffb67d303647ca630c78c/test/jasmine/tests/gl_plot_interact_test.js  

// blob: 44b0ae6f9e4c1c4ea79ffb67d303647ca630c78c 

// project_name: plotly/plotly.js 

// flaky_file: /test/jasmine/tests/gl_plot_interact_test.js 

// test_affected:  https://github.com/plotly/plotly.js/blob/44b0ae6f9e4c1c4ea79ffb67d303647ca630c78c/test/jasmine/tests/gl_plot_interact_test.js  
// start_line:  1465 
// end_line:  1563 
it('should respond to drag interactions', function (done) {
    var _mock = Lib.extendDeep({}, mock);

    var relayoutCallback = jasmine.createSpy('relayoutCallback');

    var originalX = [-0.3037383177570093, 5.303738317757009];
    var originalY = [-0.5, 6.1];
    var newX = [-0.5, 5];
    var newY = [-1.7, 4.95];
    var precision = 1;

    Plotly.newPlot(gd, _mock)
        .then(delay(20))
        .then(function () {
            expect(gd.layout.xaxis.autorange).toBe(true);
            expect(gd.layout.yaxis.autorange).toBe(true);
            expect(gd.layout.xaxis.range).toBeCloseToArray(originalX, precision);
            expect(gd.layout.yaxis.range).toBeCloseToArray(originalY, precision);

            // Switch to pan mode
            var buttonPan = selectButton(gd._fullLayout._modeBar, 'pan2d');
            expect(buttonPan.isActive()).toBe(false, 'initially, zoom is active');
            buttonPan.click();
            expect(buttonPan.isActive()).toBe(true, 'switched on dragmode');

            // Switching mode must not change visible range
            expect(gd.layout.xaxis.range).toBeCloseToArray(originalX, precision);
            expect(gd.layout.yaxis.range).toBeCloseToArray(originalY, precision);
        })
        .then(delay(200))
        .then(function () {
            gd.on('plotly_relayout', relayoutCallback);
        })
        .then(function () {
            // Drag scene along the X axis
            return mouseTo([200, 200], [220, 200]);
        })
        .then(function () {
            expect(gd.layout.xaxis.autorange).toBe(false);
            expect(gd.layout.yaxis.autorange).toBe(false);
            expect(gd.layout.xaxis.range).toBeCloseToArray(newX, precision);
            expect(gd.layout.yaxis.range).toBeCloseToArray(originalY, precision);
        })
        .then(function () {
            // Drag scene back along the X axis
            return mouseTo([220, 200], [200, 200]);
        })
        .then(function () {
            expect(gd.layout.xaxis.range).toBeCloseToArray(originalX, precision);
            expect(gd.layout.yaxis.range).toBeCloseToArray(originalY, precision);
        })
        .then(function () {
            // Drag scene along the Y axis
            return mouseTo([200, 200], [200, 150]);
        })
        .then(function () {
            expect(gd.layout.xaxis.range).toBeCloseToArray(originalX, precision);
            expect(gd.layout.yaxis.range).toBeCloseToArray(newY, precision);
        })
        .then(function () {
            // Drag scene back along the Y axis
            return mouseTo([200, 150], [200, 200]);
        })
        .then(function () {
            expect(gd.layout.xaxis.range).toBeCloseToArray(originalX, precision);
            expect(gd.layout.yaxis.range).toBeCloseToArray(originalY, precision);
        })
        .then(function () {
            // Drag scene along both the X and Y axis
            return mouseTo([200, 200], [220, 150]);
        })
        .then(function () {
            expect(gd.layout.xaxis.range).toBeCloseToArray(newX, precision);
            expect(gd.layout.yaxis.range).toBeCloseToArray(newY, precision);
        })
        .then(function () {
            // Drag scene back along the X and Y axis
            return mouseTo([220, 150], [200, 200]);
        })
        .then(function () {
            expect(gd.layout.xaxis.range).toBeCloseToArray(originalX, precision);
            expect(gd.layout.yaxis.range).toBeCloseToArray(originalY, precision);
        })
        .then(delay(200))
        .then(function () {
            // callback count expectation: X and back; Y and back; XY and back
            expect(relayoutCallback).toHaveBeenCalledTimes(6);

            // a callback value structure and contents check
            expect(relayoutCallback).toHaveBeenCalledWith(jasmine.objectContaining({
                'xaxis.range[0]': jasmine.any(Number),
                'xaxis.range[1]': jasmine.any(Number),
                'yaxis.range[0]': jasmine.any(Number),
                'yaxis.range[1]': jasmine.any(Number)
            }));
        })
        .catch(fail)
        .then(done);
});
// start_line:  1619 
// end_line:  1670 
it('supports 1D and 2D Zoom', function (done) {
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

            return mouseTo([centerX, centerY], [centerX - 5, centerY + 5]);
        })
        .then(function () {
            // no change - too small
            expect(gd.layout.xaxis.range).toBeCloseToArray([0, 16], 3);
            expect(gd.layout.yaxis.range).toBeCloseToArray([0, 16], 3);
        })
        .then(function () {
            return mouseTo([centerX - 50, centerY], [centerX + 50, centerY + 50]);
        })
        .then(function () {
            // 2D
            expect(gd.layout.xaxis.range).toBeCloseToArray([4, 12], 3);
            expect(gd.layout.yaxis.range).toBeCloseToArray([4, 8], 3);
        })
        .then(function () {
            return mouseTo([centerX - 50, centerY], [centerX, centerY + 5]);
        })
        .then(function () {
            // x only
            expect(gd.layout.xaxis.range).toBeCloseToArray([6, 8], 3);
            expect(gd.layout.yaxis.range).toBeCloseToArray([4, 8], 3);
        })
        .then(function () {
            return mouseTo([centerX, centerY - 50], [centerX - 5, centerY + 50]);
        })
        .then(function () {
            // y only
            expect(gd.layout.xaxis.range).toBeCloseToArray([6, 8], 3);
            expect(gd.layout.yaxis.range).toBeCloseToArray([5, 7], 3);
        })
        .catch(fail)
        .then(done);
});
// start_line:  1672 
// end_line:  1737 
it('supports axis constraints with zoom', function (done) {
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
            expect(gd.layout.xaxis.range).toBeCloseToArray([-7.6, 23.6], 1);
            expect(gd.layout.yaxis.range).toBeCloseToArray([0.2, 15.8], 1);
        })
        .catch(fail)
        .then(done);
});
// start_line:  1752 
// end_line:  1793 
it('data-referenced annotations should update on drag', function (done) {
    function assertAnnotation(xy) {
        var ann = d3.select('g.annotation-text-g').select('g');
        var translate = Drawing.getTranslate(ann);

        expect(translate.x).toBeWithin(xy[0], 8);
        expect(translate.y).toBeWithin(xy[1], 8);
    }

    Plotly.newPlot(gd, [{
        type: 'scattergl',
        x: [1, 2, 3],
        y: [2, 1, 2]
    }], {
        annotations: [{
            x: 2,
            y: 1,
            text: 'text'
        }],
        dragmode: 'pan'
    })
        .then(function () {
            assertAnnotation([327, 312]);
        })
        .then(function () {
            return mouseTo([250, 200], [200, 150]);
        })
        .then(function () {
            assertAnnotation([277, 262]);
        })
        .then(function () {
            return Plotly.relayout(gd, {
                'xaxis.range': [1.5, 2.5],
                'yaxis.range': [1, 1.5]
            });
        })
        .then(function () {
            assertAnnotation([327, 331]);
        })
        .catch(fail)
        .then(done);
});
