// https://github.com/preactjs/preact/blob/f71089747102e50b2dc3bbdeefcabee1432ce9a9/test/browser/render.js 

// blob: f71089747102e50b2dc3bbdeefcabee1432ce9a9 

// project_name: preactjs/preact 

// flaky_file: /test/browser/render.js 

// test_affected: https://github.com/preactjs/preact/blob/f71089747102e50b2dc3bbdeefcabee1432ce9a9/test/browser/render.js 
// start_line:  424 
// end_line:  438 
('HTMLDataListElement' in window ? it : xit)('should allow <input list /> to pass through as an attribute', () => {
	render((
		<div>
			<input type="range" min="0" max="100" list="steplist" />
			<datalist id="steplist">
				<option>0</option>
				<option>50</option>
				<option>100</option>
			</datalist>
		</div>
	), scratch);

	let html = scratch.firstElementChild.firstElementChild.outerHTML;
	expect(sortAttributes(html)).to.equal(sortAttributes('<input type="range" min="0" max="100" list="steplist">'));
});
