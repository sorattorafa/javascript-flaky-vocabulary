// https://github.com/preactjs/preact/blob/ba48cd3741bb1266dab6418db19783aa151c182b/test/browser/components.js 

// blob: ba48cd3741bb1266dab6418db19783aa151c182b 

// project_name: preactjs/preact 

// flaky_file: /test/browser/components.js 

// test_affected: https://github.com/preactjs/preact/blob/ba48cd3741bb1266dab6418db19783aa151c182b/test/browser/components.js 
// start_line:  288 
// end_line:  407 
it('should re-render nested components', () => {
	let doRender = null,
		alt = false;

	class Outer extends Component {
		componentDidMount() {
			let i = 1;
			doRender = () => this.setState({ i: ++i });
		}
		componentWillUnmount() { }
		render(props, { i }) {
			if (alt) return <div is-alt />;
			return <Inner i={i} {...props} />;
		}
	}
	sinon.spy(Outer.prototype, 'render');
	sinon.spy(Outer.prototype, 'componentDidMount');
	sinon.spy(Outer.prototype, 'componentWillUnmount');

	let j = 0;
	class Inner extends Component {
		constructor(...args) {
			super();
			this._constructor(...args);
		}
		_constructor() { }
		componentWillMount() { }
		componentDidMount() { }
		componentWillUnmount() { }
		componentDidUnmount() { }
		render(props) {
			return <div j={++j} {...props}>inner</div>;
		}
	}
	sinon.spy(Inner.prototype, '_constructor');
	sinon.spy(Inner.prototype, 'render');
	sinon.spy(Inner.prototype, 'componentWillMount');
	sinon.spy(Inner.prototype, 'componentDidMount');
	sinon.spy(Inner.prototype, 'componentDidUnmount');
	sinon.spy(Inner.prototype, 'componentWillUnmount');

	render(<Outer foo="bar" />, scratch);

	expect(Outer.prototype.componentDidMount).to.have.been.calledOnce;

	// update & flush
	doRender();
	rerender();

	expect(Outer.prototype.componentWillUnmount).not.to.have.been.called;

	expect(Inner.prototype._constructor).to.have.been.calledOnce;
	expect(Inner.prototype.componentWillUnmount).not.to.have.been.called;
	expect(Inner.prototype.componentDidUnmount).not.to.have.been.called;
	expect(Inner.prototype.componentWillMount).to.have.been.calledOnce;
	expect(Inner.prototype.componentDidMount).to.have.been.calledOnce;
	expect(Inner.prototype.render).to.have.been.calledTwice;

	expect(Inner.prototype.render.secondCall)
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

	expect(sortAttributes(scratch.innerHTML)).to.equal(sortAttributes('<div foo="bar" j="2" i="2">inner</div>'));

	// update & flush
	doRender();
	rerender();

	expect(Inner.prototype.componentWillUnmount).not.to.have.been.called;
	expect(Inner.prototype.componentDidUnmount).not.to.have.been.called;
	expect(Inner.prototype.componentWillMount).to.have.been.calledOnce;
	expect(Inner.prototype.componentDidMount).to.have.been.calledOnce;
	expect(Inner.prototype.render).to.have.been.calledThrice;

	expect(Inner.prototype.render.thirdCall)
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


	// update & flush
	alt = true;
	doRender();
	rerender();

	expect(Inner.prototype.componentWillUnmount).to.have.been.calledOnce;
	expect(Inner.prototype.componentDidUnmount).to.have.been.calledOnce;

	expect(scratch.innerHTML).to.equal('<div is-alt="true"></div>');

	// update & flush
	alt = false;
	doRender();
	rerender();

	expect(sortAttributes(scratch.innerHTML)).to.equal(sortAttributes('<div foo="bar" j="4" i="5">inner</div>'));
});
