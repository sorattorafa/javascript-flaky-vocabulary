// https://github.com/preactjs/preact/blob/945afe30c537abce36482821ed12e2df5fd98560/test/browser/lifecycle.js 

// blob: 945afe30c537abce36482821ed12e2df5fd98560 

// project_name: preactjs/preact 

// flaky_file: /test/browser/lifecycle.js 

// test_affected: https://github.com/preactjs/preact/blob/945afe30c537abce36482821ed12e2df5fd98560/test/browser/lifecycle.js 
// start_line:  256 
// end_line: 264 
it('should be invoked for components on unmount', () => {
	reset();
	setState({ show: false });
	rerender();

	expect(proto.componentDidUnmount).to.have.been.called;
	expect(proto.componentWillUnmount).to.have.been.calledBefore(proto.componentDidUnmount);
	expect(proto.componentDidUnmount).to.have.been.called;
});
// start_line:  334 
// end_line:  342 

it('should be invoked normally on unmount', () => {
	setState({ show: false });
	rerender();

	expect(proto.componentWillUnmount).to.have.been.called;
	expect(proto.componentWillUnmount).to.have.been.calledBefore(proto.componentDidUnmount);
	expect(proto.componentDidUnmount).to.have.been.called;
});
