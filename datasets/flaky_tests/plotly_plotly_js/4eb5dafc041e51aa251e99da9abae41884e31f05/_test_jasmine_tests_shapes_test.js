// https://github.com/plotly/plotly.js/blob/4eb5dafc041e51aa251e99da9abae41884e31f05/test/jasmine/tests/shapes_test.js 

// blob: 4eb5dafc041e51aa251e99da9abae41884e31f05 

// project_name: plotly/plotly.js 

// flaky_file: /test/jasmine/tests/shapes_test.js 

// test_affected: https://github.com/plotly/plotly.js/blob/4eb5dafc041e51aa251e99da9abae41884e31f05/test/jasmine/tests/shapes_test.js 
// start_line:  1040 
// end_line:  1061 
it('@flaky being sized relative to data vertically is getting lower ' +
    'when being dragged to expand the y-axis',
    function (done) {
        layout.shapes[0].ysizemode = 'data';
        layout.shapes[0].y0 = 1;
        layout.shapes[0].y1 = 2;

        Plotly.plot(gd, data, layout, { editable: true })
            .then(function () {
                var shapeNodeBeforeDrag = getFirstShapeNode();
                var heightBeforeDrag = shapeNodeBeforeDrag.getBoundingClientRect().height;

                drag(shapeNodeBeforeDrag, 50, 300).then(function () {
                    var shapeNodeAfterDrag = getFirstShapeNode();
                    var bbox = shapeNodeAfterDrag.getBoundingClientRect();
                    expect(bbox.width).toBe(25);
                    expect(bbox.height).toBeLessThan(heightBeforeDrag);
                    assertShapeFullyVisible(shapeNodeAfterDrag);
                    done();
                });
            });
    });
