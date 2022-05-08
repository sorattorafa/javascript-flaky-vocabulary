// https://github.com/plotly/plotly.js/blob/11bc6259b47eb41e9c869d25f5d36defce02bddb/test/jasmine/tests/titles_test.js 

// blob: 11bc6259b47eb41e9c869d25f5d36defce02bddb 

// project_name: plotly/plotly.js 

// flaky_file: /test/jasmine/tests/titles_test.js 

// test_affected: https://github.com/plotly/plotly.js/blob/11bc6259b47eb41e9c869d25f5d36defce02bddb/test/jasmine/tests/titles_test.js 
// start_line:  1144 
// end_line:  1167 
it('@flaky has no hover effects for titles that used to be blank', function (done) {
    Plotly.plot(gd, data, {
        xaxis: { title: { text: '' } },
        yaxis: { title: { text: '' } },
        title: { text: '' }
    }, { editable: true })
        .then(function () {
            return editTitle('x', 'xaxis.title.text', 'XXX');
        })
        .then(function () {
            return editTitle('y', 'yaxis.title.text', 'YYY');
        })
        .then(function () {
            return editTitle('g', 'title.text', 'TTT');
        })
        .then(function () {
            return Promise.all([
                checkTitle('x', 'XXX', 1, 1),
                checkTitle('y', 'YYY', 1, 1),
                checkTitle('g', 'TTT', 1, 1)
            ]);
        })
        .then(done);
});
