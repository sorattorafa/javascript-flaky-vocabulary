// https://github.com/plotly/plotly.js/blob/7da973b6c5e219fe6def91bf587c63fc1bba56ad/test/jasmine/tests/select_test.js 

// blob: 7da973b6c5e219fe6def91bf587c63fc1bba56ad 

// project_name: plotly/plotly.js 

// flaky_file: /test/jasmine/tests/select_test.js 

// test_affected: https://github.com/plotly/plotly.js/blob/7da973b6c5e219fe6def91bf587c63fc1bba56ad/test/jasmine/tests/select_test.js 
// start_line:  123 
// end_line:  666 
describe('@flaky Click-to-select', function() {
    var mock14Pts = {
        '1': { x: 134, y: 116 },
        '7': { x: 270, y: 160 },
        '10': { x: 324, y: 198 },
        '35': { x: 685, y: 341 }
    };
    var gd;

    beforeEach(function() {
        gd = createGraphDiv();
    });

    afterEach(destroyGraphDiv);

    function plotMock14(layoutOpts) {
        var mock = require('@mocks/14.json');
        var defaultLayoutOpts = {
            layout: {
                clickmode: 'event+select',
                dragmode: 'select',
                hovermode: 'closest'
            }
        };
        var mockCopy = Lib.extendDeep(
          {},
          mock,
          defaultLayoutOpts,
          { layout: layoutOpts });

        return Plotly.plot(gd, mockCopy.data, mockCopy.layout);
    }

    /**
     * Executes a click and before resets selection event handlers.
     * By default, click is executed with a delay to prevent unwanted double clicks.
     * Returns the `selectedPromise` promise for convenience.
     */
    function _click(x, y, clickOpts, immediate) {
        resetEvents(gd);

        // Too fast subsequent calls of `click` would
        // produce an unwanted double click, thus we need
        // to delay the click.
        if(immediate) {
            click(x, y, clickOpts);
        } else {
            setTimeout(function() {
                click(x, y, clickOpts);
            }, DBLCLICKDELAY * 1.01);
        }

        return selectedPromise;
    }

    function _clickPt(coords, clickOpts, immediate) {
        expect(coords).toBeDefined('coords needs to be defined');
        expect(coords.x).toBeDefined('coords.x needs to be defined');
        expect(coords.y).toBeDefined('coords.y needs to be defined');

        return _click(coords.x, coords.y, clickOpts, immediate);
    }

    /**
     * Convenient helper to execute a click immediately.
     */
    function _immediateClickPt(coords, clickOpts) {
        return _clickPt(coords, clickOpts, true);
    }

    /**
     * Asserting selected points.
     *
     * @param expected can be a point number, an array
     * of point numbers (for a single trace) or an array of point number
     * arrays in case of multiple traces.
     */
    function assertSelectedPoints(expected) {
        var expectedPtsPerTrace;
        var expectedPts;
        var traceNum;

        if(Array.isArray(expected)) {
            if(Array.isArray(expected[0])) {
                expectedPtsPerTrace = expected;
            } else {
                expectedPtsPerTrace = [expected];
            }
        } else {
            expectedPtsPerTrace = [[expected]];
        }

        for(traceNum = 0; traceNum < expectedPtsPerTrace.length; traceNum++) {
            expectedPts = expectedPtsPerTrace[traceNum];
            expect(gd._fullData[traceNum].selectedpoints).toEqual(expectedPts);
            expect(gd.data[traceNum].selectedpoints).toEqual(expectedPts);
        }
    }

    function assertSelectionCleared() {
        gd._fullData.forEach(function(fullDataItem) {
            expect(fullDataItem.selectedpoints).toBeUndefined();
        });
    }

    it('selects a single data point when being clicked', function(done) {
        plotMock14()
          .then(function() { return _immediateClickPt(mock14Pts[7]); })
          .then(function() { assertSelectedPoints(7); })
          .catch(failTest)
          .then(done);
    });

    describe('clears entire selection when the last selected data point', function() {
        [{
            desc: 'is clicked',
            clickOpts: {}
        }, {
            desc: 'is clicked while add/subtract modifier keys are active',
            clickOpts: { shiftKey: true }
        }].forEach(function(testData) {
            it(testData.desc, function(done) {
                plotMock14()
                  .then(function() { return _immediateClickPt(mock14Pts[7]); })
                  .then(function() {
                      assertSelectedPoints(7);
                      _clickPt(mock14Pts[7], testData.clickOpts);
                      return deselectPromise;
                  })
                  .then(function() {
                      assertSelectionCleared();
                      return _clickPt(mock14Pts[35], testData.clickOpts);
                  })
                  .then(function() {
                      assertSelectedPoints(35);
                  })
                  .catch(failTest)
                  .then(done);
            });
        });
    });

    it('cleanly clears and starts selections although add/subtract mode on', function(done) {
        plotMock14()
          .then(function() {
              return _immediateClickPt(mock14Pts[7]);
          })
          .then(function() {
              assertSelectedPoints(7);
              _clickPt(mock14Pts[7], { shiftKey: true });
              return deselectPromise;
          })
          .then(function() {
              assertSelectionCleared();
              return _clickPt(mock14Pts[35], { shiftKey: true });
          })
          .then(function() {
              assertSelectedPoints(35);
          })
          .catch(failTest)
          .then(done);
    });

    it('supports adding to an existing selection', function(done) {
        plotMock14()
          .then(function() { return _immediateClickPt(mock14Pts[7]); })
          .then(function() {
              assertSelectedPoints(7);
              return _clickPt(mock14Pts[35], { shiftKey: true });
          })
          .then(function() { assertSelectedPoints([7, 35]); })
          .catch(failTest)
          .then(done);
    });

    it('supports subtracting from an existing selection', function(done) {
        plotMock14()
          .then(function() { return _immediateClickPt(mock14Pts[7]); })
          .then(function() {
              assertSelectedPoints(7);
              return _clickPt(mock14Pts[35], { shiftKey: true });
          })
          .then(function() {
              assertSelectedPoints([7, 35]);
              return _clickPt(mock14Pts[7], { shiftKey: true });
          })
          .then(function() { assertSelectedPoints(35); })
          .catch(failTest)
          .then(done);
    });

    it('can be used interchangeably with lasso/box select', function(done) {
        plotMock14()
          .then(function() {
              return _immediateClickPt(mock14Pts[35]);
          })
          .then(function() {
              assertSelectedPoints(35);
              drag(SELECT_PATH, { shiftKey: true });
          })
          .then(function() {
              assertSelectedPoints([0, 1, 35]);
              return _immediateClickPt(mock14Pts[7], { shiftKey: true });
          })
          .then(function() {
              assertSelectedPoints([0, 1, 7, 35]);
              return _clickPt(mock14Pts[1], { shiftKey: true });
          })
          .then(function() {
              assertSelectedPoints([0, 7, 35]);
              return Plotly.relayout(gd, 'dragmode', 'lasso');
          })
          .then(function() {
              assertSelectedPoints([0, 7, 35]);
              drag(LASSO_PATH, { shiftKey: true });
          })
          .then(function() {
              assertSelectedPoints([0, 7, 10, 35]);
              return _clickPt(mock14Pts[10], { shiftKey: true });
          })
          .then(function() {
              assertSelectedPoints([0, 7, 35]);
              drag([[670, 330], [695, 330], [695, 350], [670, 350]],
                { shiftKey: true, altKey: true });
          })
          .then(function() {
              assertSelectedPoints([0, 7]);
              return _clickPt(mock14Pts[35], { shiftKey: true });
          })
          .then(function() {
              assertSelectedPoints([0, 7, 35]);
              return _clickPt(mock14Pts[7]);
          })
          .then(function() {
              assertSelectedPoints([7]);
              return doubleClick(650, 100);
          })
          .then(function() {
              assertSelectionCleared();
          })
          .catch(failTest)
          .then(done);
    });

    it('works in a multi-trace plot', function(done) {
        Plotly.plot(gd, [
            {
                x: [1, 3, 5, 4, 10, 12, 12, 7],
                y: [2, 7, 6, 1, 0, 13, 6, 12],
                type: 'scatter',
                mode: 'markers',
                marker: { size: 20 }
            }, {
                x: [1, 7, 6, 2],
                y: [2, 3, 5, 4],
                type: 'bar'
            }, {
                x: [7, 8, 9, 10],
                y: [7, 9, 13, 21],
                type: 'scattergl',
                mode: 'markers',
                marker: { size: 20 }
            }
        ], {
            width: 400,
            height: 600,
            hovermode: 'closest',
            dragmode: 'select',
            clickmode: 'event+select'
        })
          .then(function() {
              return _click(136, 369, {}, true); })
          .then(function() {
              assertSelectedPoints([[1], [], []]);
              return _click(245, 136, { shiftKey: true });
          })
          .then(function() {
              assertSelectedPoints([[1], [], [3]]);
              return _click(183, 470, { shiftKey: true });
          })
          .then(function() {
              assertSelectedPoints([[1], [2], [3]]);
          })
          .catch(failTest)
          .then(done);
    });

    it('is supported in pan/zoom mode', function(done) {
        plotMock14({ dragmode: 'zoom' })
          .then(function() {
              return _immediateClickPt(mock14Pts[35]);
          })
          .then(function() {
              assertSelectedPoints(35);
              return _clickPt(mock14Pts[7], { shiftKey: true });
          })
          .then(function() {
              assertSelectedPoints([7, 35]);
              return _clickPt(mock14Pts[7], { shiftKey: true });
          })
          .then(function() {
              assertSelectedPoints(35);
              drag(LASSO_PATH);
          })
          .then(function() {
              assertSelectedPoints(35);
              _clickPt(mock14Pts[35], { shiftKey: true });
              return deselectPromise;
          })
          .then(function() {
              assertSelectionCleared();
          })
          .catch(failTest)
          .then(done);
    });

    it('retains selected points when switching between pan and zoom mode', function(done) {
        plotMock14({ dragmode: 'zoom' })
          .then(function() {
              return _immediateClickPt(mock14Pts[35]);
          })
          .then(function() {
              assertSelectedPoints(35);
              return Plotly.relayout(gd, 'dragmode', 'pan');
          })
          .then(function() {
              assertSelectedPoints(35);
              return _clickPt(mock14Pts[7], { shiftKey: true });
          })
          .then(function() {
              assertSelectedPoints([7, 35]);
              return Plotly.relayout(gd, 'dragmode', 'zoom');
          })
          .then(function() {
              assertSelectedPoints([7, 35]);
              return _clickPt(mock14Pts[7], { shiftKey: true });
          })
          .then(function() {
              assertSelectedPoints(35);
          })
          .catch(failTest)
          .then(done);
    });

    it('is supported by scattergl in pan/zoom mode', function(done) {
        Plotly.plot(gd, [
            {
                x: [7, 8, 9, 10],
                y: [7, 9, 13, 21],
                type: 'scattergl',
                mode: 'markers',
                marker: { size: 20 }
            }
        ], {
            width: 400,
            height: 600,
            hovermode: 'closest',
            dragmode: 'zoom',
            clickmode: 'event+select'
        })
          .then(function() {
              return _click(230, 340, {}, true);
          })
          .then(function() {
              assertSelectedPoints(2);
          })
          .catch(failTest)
          .then(done);
    });

    it('deals correctly with histogram\'s binning in the persistent selection case', function(done) {
        var mock = require('@mocks/histogram_colorscale.json');
        var firstBinPts = [0];
        var secondBinPts = [1, 2];
        var thirdBinPts = [3, 4, 5];

        mock.layout.clickmode = 'event+select';
        Plotly.plot(gd, mock.data, mock.layout)
          .then(function() {
              return clickFirstBinImmediately();
          })
          .then(function() {
              assertSelectedPoints(firstBinPts);
              return shiftClickSecondBin();
          })
          .then(function() {
              assertSelectedPoints([].concat(firstBinPts, secondBinPts));
              return shiftClickThirdBin();
          })
          .then(function() {
              assertSelectedPoints([].concat(firstBinPts, secondBinPts, thirdBinPts));
              return clickFirstBin();
          })
          .then(function() {
              assertSelectedPoints([].concat(firstBinPts));
              clickFirstBin();
              return deselectPromise;
          })
          .then(function() {
              assertSelectionCleared();
          })
          .catch(failTest)
          .then(done);

        function clickFirstBinImmediately() { return _immediateClickPt({ x: 141, y: 358 }); }
        function clickFirstBin() { return _click(141, 358); }
        function shiftClickSecondBin() { return _click(239, 330, { shiftKey: true }); }
        function shiftClickThirdBin() { return _click(351, 347, { shiftKey: true }); }
    });

    it('ignores clicks on boxes in a box trace type', function(done) {
        var mock = Lib.extendDeep({}, require('@mocks/box_grouped_horz.json'));

        mock.layout.clickmode = 'event+select';
        mock.layout.width = 1100;
        mock.layout.height = 450;

        Plotly.plot(gd, mock.data, mock.layout)
          .then(function() {
              return clickPtImmediately();
          })
          .then(function() {
              assertSelectedPoints(2);
              clickPt();
              return deselectPromise;
          })
          .then(function() {
              assertSelectionCleared();
              clickBox();
          })
          .then(function() {
              // TODO Be sure this is called "late enough" after clicking on box has been processed
              // Maybe plotly_click event would get fired after any selection events?
              assertSelectionCleared();
          })
          .catch(failTest)
          .then(done);

        function clickPtImmediately() { return _immediateClickPt({ x: 610, y: 342 }); }
        function clickPt() { return _clickPt({ x: 610, y: 342 }); }
        function clickBox() { return _clickPt({ x: 565, y: 329 }); }
    });

    describe('is disabled when clickmode does not include \'select\'', function() {
        // TODO How to test for pan and zoom mode as well? Note, that
        // in lasso and select mode, plotly_selected was emitted upon a single
        // click although select-on-click wasn't supported. This behavior is kept
        // for compatibility reasons and as a side affect allows to write this test
        // for lasso and select. But in pan and zoom, how to be sure a click has been
        // processed by plotly.js?
        // ['pan', 'zoom', 'select', 'lasso']
        ['select', 'lasso']
          .forEach(function(dragmode) {
              it('and dragmode is ' + dragmode, function(done) {
                  plotMock14({ clickmode: 'event', dragmode: dragmode })
                    .then(function() {
                        // Still, the plotly_selected event should be thrown,
                        // so return promise here
                        return _immediateClickPt(mock14Pts[1]);
                    })
                    .then(function() {
                        assertSelectionCleared();
                    })
                    .catch(failTest)
                    .then(done);
              });
          });
    });

    describe('is supported by', function() {

        // On loading mocks: note, that require functions are resolved at compile time
        // and thus dynamically concatenated mock paths wont't work.
        [
            testCase('histrogram', require('@mocks/histogram_colorscale.json'), 355, 301, [3, 4, 5]),
            testCase('box', require('@mocks/box_grouped_horz.json'), 610, 342, [[2], [], []],
              { width: 1100, height: 450 }),
            testCase('violin', require('@mocks/violin_grouped.json'), 166, 187, [[3], [], []],
              { width: 1100, height: 450 }),
            testCase('ohlc', require('@mocks/ohlc_first.json'), 669, 165, [9]),
            testCase('candlestick', require('@mocks/finance_style.json'), 331, 162, [[], [5]]),
            testCase('choropleth', require('@mocks/geo_choropleth-text.json'), 440, 163, [6]),
            testCase('scattermapbox', require('@mocks/mapbox_0.json'), 650, 195, [[2], []], {},
              { mapboxAccessToken: require('@build/credentials.json').MAPBOX_ACCESS_TOKEN })
        ]
          .forEach(function(testCase) {
              it('trace type ' + testCase.traceType, function(done) {
                  var defaultLayoutOpts = {
                      layout: {
                          clickmode: 'event+select',
                          dragmode: 'pan',
                          hovermode: 'closest'
                      }
                  };
                  var customLayoutOptions = {
                      layout: testCase.layoutOptions
                  };
                  var customConfigOptions = {
                      config: testCase.configOptions
                  };
                  var mockCopy = Lib.extendDeep(
                    {},
                    testCase.mock,
                    defaultLayoutOpts,
                    customLayoutOptions,
                    customConfigOptions);

                  Plotly.plot(gd, mockCopy.data, mockCopy.layout, mockCopy.config)
                    .then(function() {
                        return _immediateClickPt(testCase);
                    })
                    .then(function() {
                        assertSelectedPoints(testCase.expectedPts);
                        return Plotly.relayout(gd, 'dragmode', 'lasso');
                    })
                    .then(function() {
                        _clickPt(testCase);
                        return deselectPromise;
                    })
                    .then(function() {
                        assertSelectionCleared();
                        return _clickPt(testCase);
                    })
                    .then(function() {
                        assertSelectedPoints(testCase.expectedPts);
                    })
                    .catch(failTest)
                    .then(done);
              });
          });

        function testCase(traceType, mock, x, y, expectedPts, layoutOptions, configOptions) {
            return {
                traceType: traceType,
                mock: mock,
                layoutOptions: layoutOptions,
                x: x,
                y: y,
                expectedPts: expectedPts,
                configOptions: configOptions
            };
        }
    });
});