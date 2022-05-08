// https://github.com/plotly/plotly.js/blob/667913c0796c08d03593469403a210588ba627a1/test/image/export_test.js  

// blob: 667913c0796c08d03593469403a210588ba627a1 

// project_name: plotly/plotly.js 

// flaky_file: /test/image/export_test.js 

// test_affected: https://github.com/plotly/plotly.js/blob/667913c0796c08d03593469403a210588ba627a1/test/image/export_test.js  
// start_line:  76 
// end_line:  84 
test('testing image export formats', function (t) {
    t.plan(mockList.length * FORMATS.length);

    for (var i = 0; i < mockList.length; i++) {
        for (var j = 0; j < FORMATS.length; j++) {
            run(mockList[i], FORMATS[j], t);
        }
    }
});
