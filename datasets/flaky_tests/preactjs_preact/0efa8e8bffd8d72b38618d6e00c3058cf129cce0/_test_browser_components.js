// https://github.com/preactjs/preact/blob/0efa8e8bffd8d72b38618d6e00c3058cf129cce0/test/browser/components.js 

// blob: 0efa8e8bffd8d72b38618d6e00c3058cf129cce0 

// project_name: preactjs/preact 

// flaky_file: /test/browser/components.js 

// test_affected: https://github.com/preactjs/preact/blob/0efa8e8bffd8d72b38618d6e00c3058cf129cce0/test/browser/components.js 
// start_line:  362 
// end_line: 362 
expect(sortAttributes(scratch.innerHTML)).to.equal(sortAttributes('<div foo="bar" j="2" i="2">inner</div>'));
// start_line:  218 
// end_line: 286 
it('should re-render nested functional components', () => {
	let doRender = null;
	class Outer extends Component {
		componentDidMount() {
			let i = 1;
			doRender = () => this.setState({ i: ++i });
		}
		componentWillUnmount() { }
		render(props, { i }) {
			return <Inner i={i} {...props} />;
		}
	}
	sinon.spy(Outer.prototype, 'render');
	sinon.spy(Outer.prototype, 'componentWillUnmount');

	let j = 0;
	const Inner = sinon.spy(
		props => <div j={++j} {...props}>inner</div>
	);

	render(<Outer foo="bar" />, scratch);

	// update & flush
	doRender();
	rerender();

	expect(Outer.prototype.componentWillUnmount)
		.not.to.have.been.called;

	expect(Inner).to.have.been.calledTwice;

	expect(Inner.secondCall)
		.to.have.been.calledWith({ foo: 'bar', i: 2 })
		.and.to.have.returned(sinon.match({
			attributes: {
				j: 2,
				i: 2,
				foo: 'bar'
			}
		}));

	expect(getAttributes(scratch.firstElementChild)).to.eql({
		j: '2',
		i: '2',
		foo: 'bar'
	});

	// update & flush
	doRender();
	rerender();

	expect(Inner).to.have.been.calledThrice;

	expect(Inner.thirdCall)
		.to.have.been.calledWith({ foo: 'bar', i: 3 })
		.and.to.have.returned(sinon.match({
			attributes: {
				j: 3,
				i: 3,
				foo: 'bar'
			}
		}));

	expect(getAttributes(scratch.firstElementChild)).to.eql({
		j: '3',
		i: '3',
		foo: 'bar'
	});
});
