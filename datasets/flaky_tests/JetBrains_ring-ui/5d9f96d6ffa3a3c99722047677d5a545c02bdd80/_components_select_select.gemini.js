// https://github.com/JetBrains/ring-ui/blob/5d9f96d6ffa3a3c99722047677d5a545c02bdd80/components/select/select.gemini.js 

// blob: 5d9f96d6ffa3a3c99722047677d5a545c02bdd80 

// project_name: JetBrains/ring-ui 

// flaky_file: /components/select/select.gemini.js 

// test_affected: https://github.com/JetBrains/ring-ui/blob/5d9f96d6ffa3a3c99722047677d5a545c02bdd80/components/select/select.gemini.js 
// start_line:  3 
// end_line:  44 
gemini.suite('Select', () => {
  gemini.suite('Input based select', child => {
    child.
      setUrl('/select/simple-input-based-select.html').
      setCaptureElements('.ring-select', '[data-test=ring-popup]').
      capture('selectPopup', (actions, find) => {
        actions.click(find('.ring-input'));
        actions.mouseMove(find('body'), { x: 800, y: 1024 });
      });
  });

  gemini.suite('Select button', child => {
    child.
      setUrl('/select/select-with-a-customized-filter-and-an-add-item-button.html').
      setCaptureElements('.ring-select').
      capture('button', (actions, find) => {
        actions.mouseMove(find('body'), { x: 800, y: 1024 });
      });
  });

  gemini.suite('Select with filter', child => {
    child.
      setUrl('/select/simple-select-with-default-filter-mode-enabled.html').
      setCaptureElements('.ring-select', '[data-test=ring-popup]').
      capture('selectPopup', (actions, find) => {
        actions.click(find('.ring-select'));
        actions.mouseMove(find('body'), { x: 800, y: 1024 });
      });
  });

  gemini.suite('Multi-value select with options descriptions', child => {
    child.
      setUrl('/select/multiple-select-with-a-description.html').
      skip('ie', 'Disabled in IE because of weird rendering artefact').
      setCaptureElements('[data-test=ring-popup]').
      capture('selectPopup', (actions, find) => {
        actions.click(find('.ring-button'));
        actions.mouseMove(find('body'), { x: 800, y: 1024 });
      });
  });

});
