// https://github.com/mobxjs/mobx/blob/03a087452ad7d6c1b5e2b13239bba5d95a0d7768/test/extras.js 

// blob: 03a087452ad7d6c1b5e2b13239bba5d95a0d7768 

// project_name: mobxjs/mobx 

// flaky_file: /test/extras.js 

// test_affected: https://github.com/mobxjs/mobx/blob/03a087452ad7d6c1b5e2b13239bba5d95a0d7768/test/extras.js 
// start_line: 301 
// end_line: 320 
test('strict mode checks', function (t) {
    var x = mobx.observable(3);

    mobx.extras.allowStateChanges(false, function () {
        x.get();
    });

    mobx.extras.allowStateChanges(true, function () {
        x.set(7);
    });

    t.throws(function () {
        mobx.extras.allowStateChanges(false, function () {
            x.set(4);
        });
    });

    mobx.extras.resetGlobalState();
    t.end();
});
