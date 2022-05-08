// https://github.com/plotly/plotly.js/blob/aae0c60c6c720ef7de33333dfb7884087dae2edc/test/jasmine/tests/transition_test.js 

// blob: aae0c60c6c720ef7de33333dfb7884087dae2edc 

// project_name: plotly/plotly.js 

// flaky_file: /test/jasmine/tests/transition_test.js 

// test_affected: https://github.com/plotly/plotly.js/blob/aae0c60c6c720ef7de33333dfb7884087dae2edc/test/jasmine/tests/transition_test.js 
// start_line:  642 
// end_line:  732 
it('@flaky should only transition the layout when both traces and layout have animatable changes by default', function (done) {
    var data = [{ y: [1, 2, 1] }];
    var layout = {
        transition: { duration: 10 },
        xaxis: { range: [0, 3] },
        yaxis: { range: [0, 3] }
    };

    Plotly.react(gd, data, layout)
        .then(function () {
            methods.push([gd._fullLayout._basePlotModules[0], 'plot']);
            methods.push([gd._fullLayout._basePlotModules[0], 'transitionAxes']);
            methods.push([Axes, 'drawOne']);
            addSpies();
        })
        .then(function () {
            data[0].marker = { color: 'red' };
            return Plotly.react(gd, data, layout);
        })
        .then(function () {
            assertSpies('just trace transition', [
                [Plots, 'transitionFromReact', 1],
                [gd._fullLayout._basePlotModules[0], 'plot', 1],
                [gd._fullLayout._basePlotModules[0], 'transitionAxes', 0],
                [Axes, 'drawOne', 0]
            ]);
        })
        .then(function () {
            layout.xaxis.range = [-2, 2];
            return Plotly.react(gd, data, layout);
        })
        .then(function () {
            assertSpies('just layout transition', [
                [Plots, 'transitionFromReact', 1],
                [gd._fullLayout._basePlotModules[0], 'transitionAxes', 1],
                [Axes, 'drawOne', 1],
                [Axes, 'drawOne', 1],
                [Axes, 'drawOne', 1],
                [Axes, 'drawOne', 1],
                // one _module.plot call from the relayout at end of axis transition
                [Registry, 'call', ['relayout', gd, { 'xaxis.range': [-2, 2] }]],
                [Axes, 'drawOne', 1],
                [gd._fullLayout._basePlotModules[0], 'plot', 1],
            ]);
        })
        .then(function () {
            data[0].marker.color = 'black';
            layout.xaxis.range = [-1, 1];
            return Plotly.react(gd, data, layout);
        })
        .then(delay(20))
        .then(function () {
            assertSpies('both trace and layout transitions', [
                [Plots, 'transitionFromReact', 1],
                [gd._fullLayout._basePlotModules[0], 'transitionAxes', 1],
                [Axes, 'drawOne', 1],
                [Axes, 'drawOne', 1],
                // one instantaneous transition options to halt other trace transitions (if any)
                [gd._fullLayout._basePlotModules[0], 'plot', [gd, null, { duration: 0, easing: 'cubic-in-out', ordering: 'layout first' }, 'function']],
                [Axes, 'drawOne', 1],
                [Axes, 'drawOne', 1],
                // one _module.plot call from the relayout at end of axis transition
                [Registry, 'call', ['relayout', gd, { 'xaxis.range': [-1, 1] }]],
                [Axes, 'drawOne', 1],
                [gd._fullLayout._basePlotModules[0], 'plot', [gd]]
            ]);
        })
        .then(function () {
            data[0].marker.color = 'red';
            layout.xaxis.range = [-2, 2];
            layout.transition.ordering = 'traces first';
            return Plotly.react(gd, data, layout);
        })
        .then(delay(20))
        .then(function () {
            assertSpies('both trace and layout transitions under *ordering:traces first*', [
                [Plots, 'transitionFromReact', 1],
                // one smooth transition
                [gd._fullLayout._basePlotModules[0], 'plot', [gd, [0], { duration: 10, easing: 'cubic-in-out', ordering: 'traces first' }, 'function']],
                // one by relayout call  at the end of instantaneous axis transition
                [gd._fullLayout._basePlotModules[0], 'transitionAxes', 1],
                [Axes, 'drawOne', 1],
                [Axes, 'drawOne', 1],
                [Registry, 'call', ['relayout', gd, { 'xaxis.range': [-2, 2] }]],
                [Axes, 'drawOne', 1],
                [gd._fullLayout._basePlotModules[0], 'plot', [gd]]
            ]);
        })
        .catch(failTest)
        .then(done);
});
// start_line:  802 
// end_line: 851 
it('@flaky should transition layout when one or more axis auto-ranged value changed', function (done) {
    var data = [{ y: [1, 2, 1] }];
    var layout = { transition: { duration: 10 } };

    function assertAxAutorange(msg, exp) {
        expect(gd.layout.xaxis.autorange).toBe(exp, msg);
        expect(gd.layout.yaxis.autorange).toBe(exp, msg);
        expect(gd._fullLayout.xaxis.autorange).toBe(exp, msg);
        expect(gd._fullLayout.yaxis.autorange).toBe(exp, msg);
    }

    Plotly.react(gd, data, layout)
        .then(function () {
            methods.push([gd._fullLayout._basePlotModules[0], 'plot']);
            methods.push([gd._fullLayout._basePlotModules[0], 'transitionAxes']);
            addSpies();
            assertAxAutorange('axes are autorange:true by default', true);
        })
        .then(function () {
            // N.B. marker.size can expand axis range
            data[0].marker = { size: 30 };
            return Plotly.react(gd, data, layout);
        })
        .then(function () {
            assertSpies('must transition autoranged axes, not the traces', [
                [Plots, 'transitionFromReact', 1],
                [gd._fullLayout._basePlotModules[0], 'transitionAxes', 1],
                // one instantaneous transition options to halt other trace transitions (if any)
                [gd._fullLayout._basePlotModules[0], 'plot', [gd, null, { duration: 0, easing: 'cubic-in-out', ordering: 'layout first' }, 'function']],
                // one _module.plot call from the relayout at end of axis transition
                [gd._fullLayout._basePlotModules[0], 'plot', [gd]],
            ]);
            assertAxAutorange('axes are now autorange:false', false);
        })
        .then(function () {
            data[0].marker = { size: 10 };
            return Plotly.react(gd, data, layout);
        })
        .then(function () {
            assertSpies('transition just traces, as now axis ranges are set', [
                [Plots, 'transitionFromReact', 1],
                [gd._fullLayout._basePlotModules[0], 'transitionAxes', 0],
                // called from Plots.transitionFromReact
                [gd._fullLayout._basePlotModules[0], 'plot', [gd, [0], { duration: 10, easing: 'cubic-in-out', ordering: 'layout first' }, 'function']]
            ]);
            assertAxAutorange('axes are still autorange:false', false);
        })
        .catch(failTest)
        .then(done);
});
// start_line:  853 
// end_line:  922 
it('@flaky should not transition layout when axis auto-ranged value do not changed', function (done) {
    var data = [{ y: [1, 2, 1] }];
    var layout = { transition: { duration: 10 } };

    function assertAxAutorange(msg, exp) {
        expect(gd.layout.yaxis.autorange).toBe(exp, msg);
        expect(gd._fullLayout.yaxis.autorange).toBe(exp, msg);
    }

    Plotly.react(gd, data, layout)
        .then(function () {
            methods.push([gd._fullLayout._basePlotModules[0], 'plot']);
            methods.push([gd._fullLayout._basePlotModules[0], 'transitionAxes']);
            addSpies();
            assertAxAutorange('y-axis is autorange:true by default', true);
        })
        .then(function () {
            // N.B. different coordinate, but same auto-range value
            data[0].y = [2, 1, 2];
            return Plotly.react(gd, data, layout);
        })
        .then(function () {
            assertSpies('do not transition autoranged axes, just the traces', [
                [Plots, 'transitionFromReact', 1],
                [gd._fullLayout._basePlotModules[0], 'transitionAxes', 0],
                [gd._fullLayout._basePlotModules[0], 'plot', 1]
            ]);
            assertAxAutorange('y-axis is still autorange:true', true);
        })
        .then(function () {
            // N.B. different coordinates with different auto-range value
            data[0].y = [20, 10, 20];
            return Plotly.react(gd, data, layout);
        })
        .then(function () {
            assertSpies('both trace and layout transitions', [
                // xaxis call to _storeDirectGUIEdit from doAutoRange
                [Registry, 'call', ['_storeDirectGUIEdit', gd.layout, gd._fullLayout._preGUI, {
                    'xaxis.range': [-0.12852664576802508, 2.128526645768025],
                    'xaxis.autorange': true
                }]],
                // yaxis call to _storeDirectGUIEdit from doAutoRange
                [Registry, 'call', ['_storeDirectGUIEdit', gd.layout, gd._fullLayout._preGUI, {
                    'yaxis.range': [9.26751592356688, 20.73248407643312],
                    'yaxis.autorange': true
                }]],

                [Plots, 'transitionFromReact', 1],
                [gd._fullLayout._basePlotModules[0], 'transitionAxes', 1],

                // one instantaneous transition options to halt other trace transitions (if any)
                [gd._fullLayout._basePlotModules[0], 'plot', [gd, null, { duration: 0, easing: 'cubic-in-out', ordering: 'layout first' }, 'function']],

                // one _module.plot call from the relayout at end of axis transition
                [Registry, 'call', ['relayout', gd, {
                    'yaxis.range': [9.26751592356688, 20.73248407643312]
                }]],
                // xaxis call #2 to _storeDirectGUIEdit from doAutoRange,
                // as this axis is still autorange:true
                [Registry, 'call', ['_storeDirectGUIEdit', gd.layout, gd._fullLayout._preGUI, {
                    'xaxis.range': [-0.12852664576802508, 2.128526645768025],
                    'xaxis.autorange': true
                }]],
                [gd._fullLayout._basePlotModules[0], 'plot', [gd]]
            ]);
            assertAxAutorange('y-axis is now autorange:false', false);
        })
        .catch(failTest)
        .then(done);
});
