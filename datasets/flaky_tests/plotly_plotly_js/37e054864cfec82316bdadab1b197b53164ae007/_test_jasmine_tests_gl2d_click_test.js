// https://github.com/plotly/plotly.js/blob/37e054864cfec82316bdadab1b197b53164ae007/test/jasmine/tests/gl2d_click_test.js 

// blob: 37e054864cfec82316bdadab1b197b53164ae007 

// project_name: plotly/plotly.js 

// flaky_file: /test/jasmine/tests/gl2d_click_test.js 

// test_affected: https://github.com/plotly/plotly.js/blob/37e054864cfec82316bdadab1b197b53164ae007/test/jasmine/tests/gl2d_click_test.js 
// start_line:  67 
// end_line:  533 
describe('@gl @flaky Test hover and click interactions', function () {
    var gd;

    function makeHoverFn(gd, x, y) {
        return function () {
            return new Promise(function (resolve) {
                gd.on('plotly_hover', resolve);
                hover(x, y);
            });
        };
    }

    function makeClickFn(gd, x, y) {
        return function () {
            return new Promise(function (resolve) {
                gd.on('plotly_click', resolve);
                click(x, y);
            });
        };
    }

    function makeUnhoverFn(gd, x0, y0) {
        return function () {
            return new Promise(function (resolve) {
                var initialElement = document.elementFromPoint(x0, y0);
                // fairly realistic simulation of moving with the cursor
                var canceler = setInterval(function () {
                    x0 -= 2;
                    y0 -= 2;
                    hover(x0, y0);

                    var nowElement = document.elementFromPoint(x0, y0);
                    if (nowElement !== initialElement) {
                        mouseEvent('mouseout', x0, y0, { element: initialElement });
                    }
                }, 10);

                gd.on('plotly_unhover', function () {
                    clearInterval(canceler);
                    resolve('emitted plotly_unhover');
                });

                setTimeout(function () {
                    clearInterval(canceler);
                    resolve(null);
                }, 350);
            });
        };
    }

    function assertEventData(actual, expected, msg) {
        expect(actual.points.length).toEqual(1, 'points length');

        var pt = actual.points[0];

        expect(Object.keys(pt)).toEqual(jasmine.arrayContaining([
            'x', 'y', 'curveNumber', 'pointNumber',
            'data', 'fullData', 'xaxis', 'yaxis'
        ]), 'event data keys');

        expect(typeof pt.data.uid).toBe('string', msg + ' - uid');
        expect(pt.xaxis.domain.length).toBe(2, msg + ' - xaxis');
        expect(pt.yaxis.domain.length).toBe(2, msg + ' - yaxis');

        expect(pt.x).toBe(expected.x, msg + ' - x');
        expect(pt.y).toBe(expected.y, msg + ' - y');
        expect(pt.curveNumber).toBe(expected.curveNumber, msg + ' - curve number');
        expect(String(pt.pointNumber)).toBe(String(expected.pointNumber), msg + ' - point number');
    }

    // returns basic hover/click/unhover runner for one xy position
    function makeRunner(pos, expected, opts) {
        opts = opts || {};

        var _hover = makeHoverFn(gd, pos[0], pos[1]);
        var _click = makeClickFn(gd, pos[0], pos[1]);

        var _unhover = opts.noUnHover ?
            function () { return 'emitted plotly_unhover'; } :
            makeUnhoverFn(gd, pos[0], pos[1]);

        return function () {
            return delay(100)()
                .then(_hover)
                .then(function (eventData) {
                    assertEventData(eventData, expected);

                    var g = d3.select('g.hovertext');
                    if (g.node() === null) {
                        expect(expected.noHoverLabel).toBe(true);
                    } else {
                        assertHoverLabelStyle(g, expected, opts.msg);
                    }
                    if (expected.label) {
                        assertHoverLabelContent({
                            nums: expected.label[0],
                            name: expected.label[1]
                        });
                    }
                })
                .then(_click)
                .then(function (eventData) {
                    assertEventData(eventData, expected, opts.msg);
                })
                .then(_unhover)
                .then(function (eventData) {
                    expect(eventData).toBe('emitted plotly_unhover', opts.msg);
                });
        };
    }

    beforeEach(function () {
        gd = createGraphDiv();
    });

    afterEach(function () {
        Plotly.purge(gd);
        destroyGraphDiv();
    });

    it('should output correct event data for scattergl', function (done) {
        var _mock = Lib.extendDeep({}, mock1);

        _mock.layout.hoverlabel = {
            font: {
                size: 20,
                color: 'yellow'
            }
        };
        _mock.data[0].hoverinfo = _mock.data[0].x.map(function (_, i) { return i % 2 ? 'y' : 'x'; });

        _mock.data[0].hoverlabel = {
            bgcolor: 'blue',
            bordercolor: _mock.data[0].x.map(function (_, i) { return i % 2 ? 'red' : 'green'; })
        };

        var run = makeRunner([634, 321], {
            x: 15.772,
            y: 0.387,
            label: ['0.387', null],
            curveNumber: 0,
            pointNumber: 33,
            bgcolor: 'rgb(0, 0, 255)',
            bordercolor: 'rgb(255, 0, 0)',
            fontSize: 20,
            fontFamily: 'Arial',
            fontColor: 'rgb(255, 255, 0)'
        }, {
            msg: 'scattergl'
        });

        Plotly.plot(gd, _mock)
            .then(run)
            .catch(fail)
            .then(done);
    });

    it('should output correct event data for scattergl in *select* dragmode', function (done) {
        var _mock = Lib.extendDeep({}, mock1);

        _mock.layout.dragmode = 'select';

        _mock.layout.hoverlabel = {
            font: {
                size: 20,
                color: 'yellow'
            }
        };
        _mock.data[0].hoverinfo = _mock.data[0].x.map(function (_, i) { return i % 2 ? 'y' : 'x'; });

        _mock.data[0].hoverlabel = {
            bgcolor: 'blue',
            bordercolor: _mock.data[0].x.map(function (_, i) { return i % 2 ? 'red' : 'green'; })
        };

        var run = makeRunner([634, 321], {
            x: 15.772,
            y: 0.387,
            label: ['0.387', null],
            curveNumber: 0,
            pointNumber: 33,
            bgcolor: 'rgb(0, 0, 255)',
            bordercolor: 'rgb(255, 0, 0)',
            fontSize: 20,
            fontFamily: 'Arial',
            fontColor: 'rgb(255, 255, 0)'
        }, {
            msg: 'scattergl'
        });

        Plotly.plot(gd, _mock)
            .then(run)
            .catch(fail)
            .then(done);
    });

    it('should output correct event data for scattergl in *lasso* dragmode', function (done) {
        var _mock = Lib.extendDeep({}, mock1);

        _mock.layout.dragmode = 'lasso';

        _mock.layout.hoverlabel = {
            font: {
                size: 20,
                color: 'yellow'
            }
        };
        _mock.data[0].hoverinfo = _mock.data[0].x.map(function (_, i) { return i % 2 ? 'y' : 'x'; });

        _mock.data[0].hoverlabel = {
            bgcolor: 'blue',
            bordercolor: _mock.data[0].x.map(function (_, i) { return i % 2 ? 'red' : 'green'; })
        };

        var run = makeRunner([634, 321], {
            x: 15.772,
            y: 0.387,
            label: ['0.387', null],
            curveNumber: 0,
            pointNumber: 33,
            bgcolor: 'rgb(0, 0, 255)',
            bordercolor: 'rgb(255, 0, 0)',
            fontSize: 20,
            fontFamily: 'Arial',
            fontColor: 'rgb(255, 255, 0)'
        }, {
            msg: 'scattergl'
        });

        Plotly.plot(gd, _mock)
            .then(run)
            .catch(fail)
            .then(done);
    });

    it('should output correct event data for scattergl with hoverinfo: \'none\'', function (done) {
        var _mock = Lib.extendDeep({}, mock1);
        _mock.data[0].hoverinfo = 'none';

        var run = makeRunner([634, 321], {
            x: 15.772,
            y: 0.387,
            curveNumber: 0,
            pointNumber: 33,
            noHoverLabel: true
        }, {
            msg: 'scattergl with hoverinfo'
        });

        Plotly.plot(gd, _mock)
            .then(run)
            .catch(fail)
            .then(done);
    });

    it('should output correct event data for pointcloud', function (done) {
        var _mock = Lib.extendDeep({}, mock2);

        _mock.layout.hoverlabel = { font: { size: 8 } };
        _mock.data[2].hoverlabel = {
            bgcolor: ['red', 'green', 'blue']
        };

        var run = makeRunner([540, 150], {
            x: 4.5,
            y: 9,
            curveNumber: 2,
            pointNumber: 1,
            bgcolor: 'rgb(0, 128, 0)',
            bordercolor: 'rgb(255, 255, 255)',
            fontSize: 8,
            fontFamily: 'Arial',
            fontColor: 'rgb(255, 255, 255)'
        }, {
            msg: 'pointcloud'
        });

        Plotly.plot(gd, _mock)
            .then(run)
            .catch(fail)
            .then(done);
    });

    it('should output correct event data for heatmapgl', function (done) {
        var _mock = Lib.extendDeep({}, mock3);
        _mock.data[0].type = 'heatmapgl';

        _mock.data[0].hoverlabel = {
            font: { size: _mock.data[0].z }
        };

        _mock.layout.hoverlabel = {
            font: { family: 'Roboto' }
        };

        var run = makeRunner([540, 150], {
            x: 3,
            y: 3,
            curveNumber: 0,
            pointNumber: [3, 3],
            bgcolor: 'rgb(68, 68, 68)',
            bordercolor: 'rgb(255, 255, 255)',
            fontSize: 20,
            fontFamily: 'Roboto',
            fontColor: 'rgb(255, 255, 255)'
        }, {
            noUnHover: true,
            msg: 'heatmapgl'
        });

        Plotly.plot(gd, _mock)
            .then(run)
            .catch(fail)
            .then(done);
    });

    it('should output correct event data for heatmapgl (asymmetric case) ', function (done) {
        var _mock = {
            data: [{
                type: 'heatmapgl',
                z: [[1, 2, 0], [2, 3, 1]],
                text: [['a', 'b', 'c'], ['D', 'E', 'F']],
                hoverlabel: {
                    bgcolor: [['red', 'blue', 'green'], ['cyan', 'pink', 'black']]
                }
            }]
        };

        var run = makeRunner([540, 150], {
            x: 2,
            y: 1,
            curveNumber: 0,
            pointNumber: [1, 2],
            bgcolor: 'rgb(0, 0, 0)',
            bordercolor: 'rgb(255, 255, 255)',
            fontSize: 13,
            fontFamily: 'Arial',
            fontColor: 'rgb(255, 255, 255)'
        }, {
            noUnHover: true,
            msg: 'heatmapgl'
        });

        Plotly.plot(gd, _mock)
            .then(run)
            .catch(fail)
            .then(done);
    });

    it('should output correct event data for scattergl after visibility restyle', function (done) {
        var _mock = Lib.extendDeep({}, mock4);

        var run = makeRunner([435, 216], {
            x: 8,
            y: 18,
            curveNumber: 2,
            pointNumber: 0,
            bgcolor: 'rgb(44, 160, 44)',
            bordercolor: 'rgb(255, 255, 255)',
            fontSize: 13,
            fontFamily: 'Arial',
            fontColor: 'rgb(255, 255, 255)'
        }, {
            msg: 'scattergl before visibility restyle'
        });

        // after the restyle, autorange changes the y range
        var run2 = makeRunner([435, 106], {
            x: 8,
            y: 18,
            curveNumber: 2,
            pointNumber: 0,
            bgcolor: 'rgb(255, 127, 14)',
            bordercolor: 'rgb(68, 68, 68)',
            fontSize: 13,
            fontFamily: 'Arial',
            fontColor: 'rgb(68, 68, 68)'
        }, {
            msg: 'scattergl after visibility restyle'
        });

        Plotly.plot(gd, _mock)
            .then(run)
            .then(function () {
                return Plotly.restyle(gd, 'visible', false, [1]);
            })
            .then(run2)
            .catch(fail)
            .then(done);
    });

    it('should output correct event data for scattergl-fancy', function (done) {
        var _mock = Lib.extendDeep({}, mock4);
        _mock.data[0].mode = 'markers+lines';
        _mock.data[1].mode = 'markers+lines';
        _mock.data[2].mode = 'markers+lines';

        var run = makeRunner([435, 216], {
            x: 8,
            y: 18,
            curveNumber: 2,
            pointNumber: 0,
            bgcolor: 'rgb(44, 160, 44)',
            bordercolor: 'rgb(255, 255, 255)',
            fontSize: 13,
            fontFamily: 'Arial',
            fontColor: 'rgb(255, 255, 255)'
        }, {
            msg: 'scattergl fancy before visibility restyle'
        });

        // after the restyle, autorange changes the x AND y ranges
        // I don't get why the x range changes, nor why the y changes in
        // a different way than in the previous test, but they do look
        // correct on the screen during the test.
        var run2 = makeRunner([426, 116], {
            x: 8,
            y: 18,
            curveNumber: 2,
            pointNumber: 0,
            bgcolor: 'rgb(255, 127, 14)',
            bordercolor: 'rgb(68, 68, 68)',
            fontSize: 13,
            fontFamily: 'Arial',
            fontColor: 'rgb(68, 68, 68)'
        }, {
            msg: 'scattergl fancy after visibility restyle'
        });

        Plotly.plot(gd, _mock)
            .then(run)
            .then(function () {
                return Plotly.restyle(gd, 'visible', false, [1]);
            })
            .then(run2)
            .catch(fail)
            .then(done);
    });

    it('should output correct event data contourgl', function (done) {
        var _mock = Lib.extendDeep({}, mock3);

        _mock.data[0].hoverlabel = {
            font: { size: _mock.data[0].z }
        };

        var run = makeRunner([540, 150], {
            x: 3,
            y: 3,
            curveNumber: 0,
            pointNumber: [3, 3],
            bgcolor: 'rgb(68, 68, 68)',
            bordercolor: 'rgb(255, 255, 255)',
            fontSize: 20,
            fontFamily: 'Arial',
            fontColor: 'rgb(255, 255, 255)'
        }, {
            noUnHover: true,
            msg: 'contourgl'
        });

        Plotly.plot(gd, _mock)
            .then(run)
            .catch(fail)
            .then(done);
    });
});
