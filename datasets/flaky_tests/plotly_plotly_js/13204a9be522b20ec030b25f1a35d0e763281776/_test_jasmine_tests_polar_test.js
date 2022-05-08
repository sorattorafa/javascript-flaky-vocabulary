// https://github.com/plotly/plotly.js/blob/13204a9be522b20ec030b25f1a35d0e763281776/test/jasmine/tests/polar_test.js 

// blob: 13204a9be522b20ec030b25f1a35d0e763281776 

// project_name: plotly/plotly.js 

// flaky_file: /test/jasmine/tests/polar_test.js 

// test_affected: https://github.com/plotly/plotly.js/blob/13204a9be522b20ec030b25f1a35d0e763281776/test/jasmine/tests/polar_test.js 
// start_line:  801 
// end_line:  890 
it('@flaky should respond to drag interactions on plot area', function (done) {
    var fig = Lib.extendDeep({}, require('@mocks/polar_scatter.json'));

    // to avoid dragging on hover labels
    fig.layout.hovermode = false;

    // adjust margins so that middle of plot area is at 300x300
    // with its middle at [200,200]
    fig.layout.width = 400;
    fig.layout.height = 400;
    fig.layout.margin = { l: 50, t: 50, b: 50, r: 50 };

    var mid = [200, 200];
    var relayoutNumber = 0;
    var resetNumber = 0;

    function _drag(p0, dp) {
        var node = d3.select('.polar > .draglayer > .maindrag').node();
        return drag(node, dp[0], dp[1], null, p0[0], p0[1]);
    }

    function _assertRange(rng, msg) {
        expect(gd._fullLayout.polar.radialaxis.range).toBeCloseToArray(rng, 1, msg);
    }

    function _assertDrag(rng, msg) {
        relayoutNumber++;
        _assertRange(rng, msg);

        if (eventCnts.plotly_relayout === relayoutNumber) {
            expect(eventData['polar.radialaxis.range'])
                .toBeCloseToArray(rng, 1, msg + '- event data');
        } else {
            fail('incorrect number of plotly_relayout events triggered - ' + msg);
        }
    }

    function _assertBase(extra) {
        var msg = 'base range' + (extra ? ' ' + extra : '');
        _assertRange([0, 11.1], msg);
    }

    function _reset() {
        return delay(100)()
            .then(function () { return _doubleClick(mid); })
            .then(function () {
                relayoutNumber++;
                resetNumber++;

                var extra = '(reset ' + resetNumber + ')';
                _assertBase(extra);
                expect(eventCnts.plotly_doubleclick).toBe(resetNumber, 'doubleclick event #' + extra);
            });
    }

    _plot(fig)
        .then(_assertBase)
        .then(function () { return _drag(mid, [50, 50]); })
        .then(function () {
            _assertDrag([0, 5.24], 'from center move toward bottom-right');
        })
        .then(_reset)
        .then(function () { return _drag(mid, [-50, -50]); })
        .then(function () {
            _assertDrag([0, 5.24], 'from center move toward top-left');
        })
        .then(_reset)
        .then(function () { return _drag([mid[0] + 30, mid[0] - 30], [50, -50]); })
        .then(function () {
            _assertDrag([3.1, 8.4], 'from quadrant #1 move top-right');
        })
        .then(_reset)
        .then(function () { return _drag([345, 200], [-50, 0]); })
        .then(function () {
            _assertDrag([7.0, 11.1], 'from right edge move left');
        })
        .then(_reset)
        .then(function () { return _drag(mid, [10, 10]); })
        .then(function () { _assertBase('from center to not far enough'); })
        .then(function () { return _drag([mid[0] + 30, mid[0] - 30], [-10, 0]); })
        .then(function () { _assertBase('from quadrant #1 to not far enough'); })
        .then(function () { return _drag([345, 200], [-10, 0]); })
        .then(function () { _assertBase('from right edge to not far enough'); })
        .then(function () {
            expect(eventCnts.plotly_relayout)
                .toBe(relayoutNumber, 'no new relayout events after *not far enough* cases');
        })
        .catch(fail)
        .then(done);
});
