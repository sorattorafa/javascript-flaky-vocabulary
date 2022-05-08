// https://github.com/plotly/plotly.js/blob/b2975c90d9e9e388d49c37fbc5e7c255b9cfd6d8/test/jasmine/tests/gl3d_plot_interact_test.js 

// blob: b2975c90d9e9e388d49c37fbc5e7c255b9cfd6d8 

// project_name: plotly/plotly.js 

// flaky_file: /test/jasmine/tests/gl3d_plot_interact_test.js 

// test_affected: https://github.com/plotly/plotly.js/blob/b2975c90d9e9e388d49c37fbc5e7c255b9cfd6d8/test/jasmine/tests/gl3d_plot_interact_test.js 
// start_line:  204 
// end_line:  231 
it('@gl should display correct hover labels of the second point of the very first scatter3d trace', function (done) {
    var _mock = Lib.extendDeep({}, multipleScatter3dMock);

    function _hover() {
        mouseEvent('mouseover', 300, 200);
    }

    Plotly.plot(gd, _mock)
        .then(delay(20))
        .then(function () {
            gd.on('plotly_hover', function (eventData) {
                ptData = eventData.points[0];
            });
        })
        .then(delay(20))
        .then(_hover)
        .then(delay(20))
        .then(function () {
            assertHoverLabelContent(
                {
                    nums: ['x: 0', 'y: 0', 'z: 0'].join('\n'),
                    name: 'trace 0'
                }
            );
        })
        .catch(failTest)
        .then(done);
});
// start_line:  233 
// end_line:  255 
it('@gl should honor *hoverlabel.namelength*', function (done) {
    var _mock = Lib.extendDeep({}, multipleScatter3dMock);

    function _hover() {
        mouseEvent('mouseover', 300, 200);
    }

    Plotly.plot(gd, _mock)
        .then(delay(20))
        .then(function () { return Plotly.restyle(gd, 'hoverlabel.namelength', 3); })
        .then(_hover)
        .then(delay(20))
        .then(function () {
            assertHoverLabelContent(
                {
                    nums: ['x: 0', 'y: 0', 'z: 0'].join('\n'),
                    name: 'tra'
                }
            );
        })
        .catch(failTest)
        .then(done);
});
