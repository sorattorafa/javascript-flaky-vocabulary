//  https://github.com/skbkontur/retail-ui/blob/a006fdf0e0e65d5fde07134c6909870666e7947f/packages/react-ui-screenshot-tests/gemini/dropdownContainer.js 

// blob: a006fdf0e0e65d5fde07134c6909870666e7947f 

// project_name: skbkontur/retail-ui 

// flaky_file: /packages/react-ui-screenshot-tests/gemini/dropdownContainer.js 

// test_affected:  https://github.com/skbkontur/retail-ui/blob/a006fdf0e0e65d5fde07134c6909870666e7947f/packages/react-ui-screenshot-tests/gemini/dropdownContainer.js 
// start_line:  7  
// end_line:  47 
var initTest = (suite, showLongItems) =>
  suite
    .before(renderStory('DropdownContainer', 'various aligns, portals, items and scrolls'))
    .setCaptureElements(TEST_CONTAINER)
    .ignoreElements(BUTTONS)
    .before((actions, find) => {
      if (showLongItems) {
        actions.click(find(BUTTONS + ' button'));
      }
    });

var innerScrollTest = suite =>
  suite.capture('shot', actions => {
    actions.executeJS(function (window) {
      var innerScroll = window.document.querySelector('#inner-scroll');
      innerScroll.scrollTop = innerScroll.scrollHeight;
      innerScroll.scrollLeft = innerScroll.scrollWidth;
    });
  });

gemini.suite('DropdownContainer', () => {
  gemini.suite('short Items', () => {
    gemini.suite('items', suite => {
      initTest(suite).capture('shot');
    });

    gemini.suite('inner scroll', suite => {
      innerScrollTest(initTest(suite));
    });
  });

  gemini.suite('long Items', () => {
    gemini.suite('items', suite => {
      initTest(suite, true).capture('shot');
    });

    gemini.suite('inner scroll', suite => {
      innerScrollTest(initTest(suite, true));
    });
  });
});
