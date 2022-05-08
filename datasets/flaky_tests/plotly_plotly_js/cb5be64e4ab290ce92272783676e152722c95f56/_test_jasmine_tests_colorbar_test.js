// https://github.com/plotly/plotly.js/blob/cb5be64e4ab290ce92272783676e152722c95f56/test/jasmine/tests/colorbar_test.js 

// blob: cb5be64e4ab290ce92272783676e152722c95f56 

// project_name: plotly/plotly.js 

// flaky_file: /test/jasmine/tests/colorbar_test.js 

// test_affected: https://github.com/plotly/plotly.js/blob/cb5be64e4ab290ce92272783676e152722c95f56/test/jasmine/tests/colorbar_test.js 
// start_line:  400 
// end_line:  418 
it('@flaky can drag root-level colorbars in editable mode', function (done) {
    Plotly.newPlot(gd,
        [{ z: [[1, 2], [3, 4]], type: 'heatmap' }],
        { width: 400, height: 400 },
        { editable: true }
    )
        .then(function () {
            expect(gd.data[0].colorbar).toBeUndefined();
            expect(gd._fullData[0].colorbar.x).toBe(1.02);
            expect(gd._fullData[0].colorbar.y).toBe(0.5);
            return drag({ node: getCBNode(), dpos: [-100, 100] });
        })
        .then(function () {
            expect(gd.data[0].colorbar.x).toBeWithin(0.591, 0.01);
            expect(gd.data[0].colorbar.y).toBeWithin(0.045, 0.01);
        })
        .catch(failTest)
        .then(done);
});
// start_line:  420 
// end_line:  438 
it('@flaky can drag marker-level colorbars in editable mode', function (done) {
    Plotly.newPlot(gd,
        [{ y: [1, 2, 1], marker: { color: [0, 1, 2], showscale: true } }],
        { width: 400, height: 400 },
        { editable: true }
    )
        .then(function () {
            expect(gd.data[0].marker.colorbar).toBeUndefined();
            expect(gd._fullData[0].marker.colorbar.x).toBe(1.02);
            expect(gd._fullData[0].marker.colorbar.y).toBe(0.5);
            return drag({ node: getCBNode(), dpos: [-100, 100] });
        })
        .then(function () {
            expect(gd.data[0].marker.colorbar.x).toBeWithin(0.591, 0.01);
            expect(gd.data[0].marker.colorbar.y).toBeWithin(0.045, 0.01);
        })
        .catch(failTest)
        .then(done);
});
// start_line:  440 
// end_line:  460 
it('@flaky can drag colorbars linked to color axes in editable mode', function (done) {
    Plotly.newPlot(gd,
        [{ z: [[1, 2], [3, 4]], type: 'heatmap', coloraxis: 'coloraxis' }],
        { coloraxis: {}, width: 400, height: 400 },
        { editable: true }
    )
        .then(function () {
            expect(gd.layout.coloraxis.colorbar).toBeUndefined();
            expect(gd._fullLayout.coloraxis.colorbar.x).toBe(1.02);
            expect(gd._fullLayout.coloraxis.colorbar.y).toBe(0.5);
            return drag({ node: getCBNode(), dpos: [-100, 100] });
        })
        .then(function () {
            expect(gd.layout.coloraxis.colorbar.x).toBeWithin(0.591, 0.01);
            expect(gd.layout.coloraxis.colorbar.y).toBeWithin(0.045, 0.01);
            expect(gd._fullLayout.coloraxis.colorbar.x).toBeWithin(0.591, 0.01);
            expect(gd._fullLayout.coloraxis.colorbar.y).toBeWithin(0.045, 0.01);
        })
        .catch(failTest)
        .then(done);
});
