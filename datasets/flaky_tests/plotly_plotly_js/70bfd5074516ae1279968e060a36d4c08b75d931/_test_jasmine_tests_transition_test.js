// https://github.com/plotly/plotly.js/blob/70bfd5074516ae1279968e060a36d4c08b75d931/test/jasmine/tests/transition_test.js 

// blob: 70bfd5074516ae1279968e060a36d4c08b75d931 

// project_name: plotly/plotly.js 

// flaky_file: /test/jasmine/tests/transition_test.js 

// test_affected: https://github.com/plotly/plotly.js/blob/70bfd5074516ae1279968e060a36d4c08b75d931/test/jasmine/tests/transition_test.js 
// start_line:  1192 
// end_line:  1234 
it('@flaky should update ranges of date and category axes', function (done) {
    Plotly.plot(gd, [
        { x: ['2018-01-01', '2019-01-01', '2020-01-01'], y: [1, 2, 3] },
        { x: ['a', 'b', 'c'], y: [1, 2, 3], xaxis: 'x2', yaxis: 'y2' }
    ], {
        grid: { rows: 1, columns: 2, pattern: 'independent' },
        xaxis: { range: ['2018-01-01', '2020-01-01'] },
        yaxis: { range: [0, 4] },
        xaxis2: { range: [0, 2] },
        yaxis2: { range: [0, 4] },
        transition: { duration: 30 }
    })
        .then(function () {
            expect(gd._fullLayout.xaxis.range).toEqual(['2018-01-01', '2020-01-01']);
            expect(gd._fullLayout.xaxis2.range).toEqual([0, 2]);

            gd.layout.xaxis.range = ['2018-06-01', '2019-06-01'];
            gd.layout.xaxis2.range = [0.5, 1.5];
            var promise = Plotly.react(gd, gd.data, gd.layout);

            setTimeout(function () {
                var fullLayout = gd._fullLayout;

                var xa = fullLayout.xaxis;
                var xr = xa.range.slice();
                expect(xa.r2l(xr[0])).toBeGreaterThan(xa.r2l('2018-01-01'));
                expect(xa.r2l(xr[1])).toBeLessThan(xa.r2l('2020-01-01'));

                var xa2 = fullLayout.xaxis2;
                var xr2 = xa2.range.slice();
                expect(xr2[0]).toBeGreaterThan(0);
                expect(xr2[1]).toBeLessThan(2);
            }, 15);

            return promise;
        })
        .then(function () {
            expect(gd._fullLayout.xaxis.range).toEqual(['2018-06-01', '2019-06-01']);
            expect(gd._fullLayout.xaxis2.range).toEqual([0.5, 1.5]);
        })
        .catch(failTest)
        .then(done);
});
