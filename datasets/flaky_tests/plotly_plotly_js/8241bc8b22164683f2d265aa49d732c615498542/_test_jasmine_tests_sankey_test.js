// https://github.com/plotly/plotly.js/blob/8241bc8b22164683f2d265aa49d732c615498542/test/jasmine/tests/sankey_test.js 

// blob: 8241bc8b22164683f2d265aa49d732c615498542 

// project_name: plotly/plotly.js 

// flaky_file: /test/jasmine/tests/sankey_test.js 

// test_affected: https://github.com/plotly/plotly.js/blob/8241bc8b22164683f2d265aa49d732c615498542/test/jasmine/tests/sankey_test.js 
// start_line:  1131 
// end_line:  1177 
it('@flaky should persist the position of every nodes after drag in attributes nodes.(x|y)', function (done) {
    mockCopy.data[0].arrangement = arrangement;
    var move = [50, -50];
    var nodes;
    var node;
    var x, x1;
    var y, y1;
    var precision = 3;

    Plotly.newPlot(gd, mockCopy)
        .then(function () {
            x = gd._fullData[0].node.x.slice();
            y = gd._fullData[0].node.y.slice();
            expect(x.length).toBe(0);
            expect(y.length).toBe(0);

            nodes = document.getElementsByClassName('sankey-node');
            node = nodes.item(nodeId);
            return drag(node, move[0], move[1]);
        })
        .then(function () {
            x = gd._fullData[0].node.x.slice();
            y = gd._fullData[0].node.y.slice();
            expect(x.length).toBe(mockCopy.data[0].node.label.length);
            expect(y.length).toBe(mockCopy.data[0].node.label.length);

            nodes = document.getElementsByClassName('sankey-node');
            node = nodes.item(nodes.length - 1); // Dragged node is now the last one
            return drag(node, move[0], move[1]);
        })
        .then(function () {
            x1 = gd._fullData[0].node.x.slice();
            y1 = gd._fullData[0].node.y.slice();
            if (arrangement === 'freeform') expect(x1[nodeId]).not.toBeCloseTo(x[nodeId], 2, 'node ' + nodeId + ' has not changed x position');
            expect(y1[nodeId]).not.toBeCloseTo(y[nodeId], precision, 'node ' + nodeId + ' has not changed y position');

            // All nodes should have same x, y values after drag
            for (var i = 0; i < x.length; i++) {
                if (i === nodeId) continue; // except the one was just dragged
                if (arrangement === 'freeform') expect(x1[i]).toBeCloseTo(x[i], 3, 'node ' + i + ' has changed x position');
                expect(y1[i]).toBeCloseTo(y[i], precision, 'node ' + i + ' has changed y position');
            }
            return true;
        })
        .catch(failTest)
        .then(done);
});
