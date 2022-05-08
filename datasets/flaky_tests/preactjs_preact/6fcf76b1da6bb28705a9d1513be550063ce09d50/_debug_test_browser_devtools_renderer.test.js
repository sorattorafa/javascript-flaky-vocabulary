// https://github.com/preactjs/preact/blob/6fcf76b1da6bb28705a9d1513be550063ce09d50/debug/test/browser/devtools/renderer.test.js 

// blob: 6fcf76b1da6bb28705a9d1513be550063ce09d50 

// project_name: preactjs/preact 

// flaky_file: /debug/test/browser/devtools/renderer.test.js 

// test_affected: https://github.com/preactjs/preact/blob/6fcf76b1da6bb28705a9d1513be550063ce09d50/debug/test/browser/devtools/renderer.test.js 
// start_line:  121  
// end_line:  137 
flakeyIt('should unmount nodes', () => {
	render(
		<div>
			<span>foo</span>
			<span>bar</span>
		</div>,
		scratch
	);
	render(<div />, scratch);

	expect(toSnapshot(spy.args[1][1])).to.deep.equal([
		'rootId: 1',
		'Update timings 2',
		'Remove 4',
		'Remove 3'
	]);
});
// start_line:  156 
// end_line: 186 
flakeyIt('should mount after filtered update', () => {
	renderer.applyFilters({
		regex: [],
		type: new Set(['dom'])
	});

	const Foo = props => <div>{props.children}</div>;
	const Bar = props => <span>{props.children}</span>;

	render(
		<div>
			<Foo />
		</div>,
		scratch
	);
	render(
		<div>
			<Foo>
				<Bar>bar</Bar>
			</Foo>
		</div>,
		scratch
	);

	expect(toSnapshot(spy.args[1][1])).to.deep.equal([
		'rootId: 1',
		'Add 3 <Bar> to parent 2',
		'Update timings 1',
		'Update timings 2'
	]);
});
// start_line:  484 
// end_line: 491 
flakeyIt('should find filtered nodes', () => {
	renderer.applyFilters({
		regex: [],
		type: new Set(['dom'])
	});
	render(<div />, scratch);
	expect(renderer.findVNodeIdForDom(scratch.firstChild)).to.equal(1);
});
// start_line: 610 
// end_line: 626 
flakeyIt('should filter by dom type #1', () => {
	renderer.applyFilters({
		regex: [],
		type: new Set(['dom'])
	});
	render(
		<div>
			<span>foo</span>
			<span>bar</span>
		</div>,
		scratch
	);
	expect(toSnapshot(spy.args[0][1])).to.deep.equal([
		'rootId: 1',
		'Add 1 <Fragment> to parent 1'
	]);
});
// start_line: 628 
// end_line: 650 
flakeyIt('should filter by dom type #2', () => {
	renderer.applyFilters({
		regex: [],
		type: new Set(['dom'])
	});

	function Foo() {
		return <div>foo</div>;
	}
	render(
		<div>
			<Foo />
			<span>foo</span>
			<span>bar</span>
		</div>,
		scratch
	);
	expect(toSnapshot(spy.args[0][1])).to.deep.equal([
		'rootId: 1',
		'Add 1 <Fragment> to parent 1',
		'Add 2 <Foo> to parent 1'
	]);
});
// start_line:  652 
// end_line: 675 
flakeyIt('should filter by fragment type', () => {
	renderer.applyFilters({
		regex: [],
		type: new Set(['fragment'])
	});

	function Foo() {
		return <div>foo</div>;
	}
	render(
		<div>
			<Foo />
			<Fragment>asdf</Fragment>
		</div>,
		scratch
	);
	expect(toSnapshot(spy.args[0][1])).to.deep.equal([
		'rootId: 1',
		'Add 1 <Fragment> to parent 1',
		'Add 2 <div> to parent 1',
		'Add 3 <Foo> to parent 2',
		'Add 4 <div> to parent 3'
	]);
});
// start_line: 677 
// end_line: 716 
flakeyIt('should filter on update', () => {
	renderer.applyFilters({
		regex: [],
		type: new Set(['dom'])
	});

	let update;
	function Parent(props) {
		const [i, setI] = useState(0);
		update = () => setI(i + 1);
		return <div>{props.children}</div>;
	}

	const Foo = () => <div />;
	render(
		<Parent>
			<div>
				<Foo />
			</div>
		</Parent>,
		scratch
	);

	expect(toSnapshot(spy.args[0][1])).to.deep.equal([
		'rootId: 1',
		'Add 1 <Fragment> to parent 1',
		'Add 2 <Parent> to parent 1',
		'Add 3 <Foo> to parent 2'
	]);

	act(() => {
		update();
	});

	expect(toSnapshot(spy.args[1][1])).to.deep.equal([
		'rootId: 1',
		'Update timings 2',
		'Update timings 3'
	]);
});
// start_line: 718 
// end_line: 760 
flakeyIt('should update filters after 1st render', () => {
	renderer.applyFilters({
		regex: [],
		type: new Set(['dom'])
	});

	function Foo() {
		return <div>foo</div>;
	}
	render(
		<div>
			<Foo />
			<span>foo</span>
			<span>bar</span>
		</div>,
		scratch
	);
	expect(toSnapshot(spy.args[0][1])).to.deep.equal([
		'rootId: 1',
		'Add 1 <Fragment> to parent 1',
		'Add 2 <Foo> to parent 1'
	]);

	renderer.applyFilters({
		regex: [],
		type: new Set()
	});

	expect(toSnapshot(spy.args[1][1])).to.deep.equal([
		'rootId: 1',
		'Remove 2'
	]);

	expect(toSnapshot(spy.args[2][1])).to.deep.equal([
		'rootId: 1',
		'Add 3 <div> to parent 1',
		'Add 4 <Foo> to parent 3',
		'Add 5 <div> to parent 4',
		'Add 6 <span> to parent 3',
		'Add 7 <span> to parent 3',
		'Update timings 1'
	]);
});
// start_line: 762 
// end_line: 831 
flakeyIt('should update filters after 1st render with unmounts', () => {
	renderer.applyFilters({
		regex: [],
		type: new Set(['dom'])
	});

	function Foo(props) {
		return <div>{props.children}</div>;
	}
	render(
		<div>
			<Foo>
				<h1>
					<Foo>foo</Foo>
				</h1>
			</Foo>
			<span>foo</span>
			<span>bar</span>
		</div>,
		scratch
	);
	expect(toSnapshot(spy.args[0][1])).to.deep.equal([
		'rootId: 1',
		'Add 1 <Fragment> to parent 1',
		'Add 2 <Foo> to parent 1',
		'Add 3 <Foo> to parent 2'
	]);

	renderer.applyFilters({
		regex: [],
		type: new Set()
	});

	expect(toSnapshot(spy.args[1][1])).to.deep.equal([
		'rootId: 1',
		'Remove 2'
	]);
	expect(toSnapshot(spy.args[2][1])).to.deep.equal([
		'rootId: 1',
		'Add 4 <div> to parent 1',
		'Add 5 <Foo> to parent 4',
		'Add 6 <div> to parent 5',
		'Add 7 <h1> to parent 6',
		'Add 3 <Foo> to parent 7',
		'Add 8 <div> to parent 3',
		'Add 9 <span> to parent 4',
		'Add 10 <span> to parent 4',
		'Update timings 1'
	]);

	renderer.applyFilters({
		regex: [],
		type: new Set(['dom'])
	});

	expect(toSnapshot(spy.args[3][1])).to.deep.equal([
		'rootId: 1',
		'Remove 4',
		'Remove 5',
		'Remove 9',
		'Remove 10'
	]);

	expect(toSnapshot(spy.args[4][1])).to.deep.equal([
		'rootId: 1',
		'Add 11 <Foo> to parent 1',
		'Add 3 <Foo> to parent 11',
		'Update timings 1'
	]);
});
