// https://github.com/preactjs/preact/blob/76b7c9a1d84682a9975dfac11bebb510e307f7d3/test/browser/lifecycle.js 

// blob: 76b7c9a1d84682a9975dfac11bebb510e307f7d3 

// project_name: preactjs/preact 

// flaky_file: /test/browser/lifecycle.js 

// test_affected: https://github.com/preactjs/preact/blob/76b7c9a1d84682a9975dfac11bebb510e307f7d3/test/browser/lifecycle.js 
// start_line:  255 
// end_line:  263 
flakeyIt('should be invoked for components on unmount', () => {
	reset();
	setState({ show: false });
	rerender();

	expect(proto.componentDidUnmount).to.have.been.called;
	expect(proto.componentWillUnmount).to.have.been.calledBefore(proto.componentDidUnmount);
	expect(proto.componentDidUnmount).to.have.been.called;
});
// start_line:  334 
// end_line: 341 
flakeyIt('should be invoked normally on unmount', () => {
	setState({ show: false });
	rerender();

	expect(proto.componentWillUnmount).to.have.been.called;
	expect(proto.componentWillUnmount).to.have.been.calledBefore(proto.componentDidUnmount);
	expect(proto.componentDidUnmount).to.have.been.called;
});
