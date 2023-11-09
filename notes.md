# Flaky dataset

Observations:

- Dataset with issues, commits, and pull requests with flaky keyword.
- Issues contais link to another issue, commit or pull request associated;
- Pull request contais a set of commits to fix flaky test;
- Commits contais fix flaky code;
- The dataset does not contains the exact 'flaky code';
- To identify flaky codes into nodejs we removed items of csv:
  - Android projects;
  - Non trivial code affected;
  - Custom suites of tests;
- Flakies smells (comments and actions who identify flakies):
  - suite of tests: `npm run test-image -- $SUITE --filter --skip-flaky || EXIT_STATE=$?`
  - remove or add fixes identifiers `xit or it.skip`
  - `this.timeout(5000); // This tests are really slow.`
  - `timeout: 10000`
  - `let it = DISABLE_FLAKEY ? xit : _it;`
  - ` /* global DISABLE_FLAKEY */ let flakeyIt = DISABLE_FLAKEY ? xit : it;`
  - `delay: 150, fireImmediately: false`
  - `// TODO: figure out why this test is flaky. Perhaps unmount of useEffect is async? itIf.skip(is('> 16.8.3'), 'cleanup on unmount', () => {`
  - `describe.skip('visualize tables', () => {`
  - ` // skipping this test for now as it's flakey. Issue has been raise: // https://github.com/influxdata/influxdb/issues/15798 it.skip('should sort the bucket names alphabetically', () => {`
  - `it.skip("clears title tag if empty title is defined", done => { `
  - `jest.setTimeout(10000);`
  - `expect(timeDiff).to.be.at.most(5000);`
  - `` This commit works around the issue by clicking the elements directly using JavaScript (instead of `WebElement#click()`). ``
  - Remove `sleepFor(1000);` and `add await browser.wait(async () => await heroesList.count() < total, 2000);`
  - `tick(500)`
  - Remove `fakeAsync` from it test
  - `this.retries(2);`
  - `describe('@flaky Click-to-select', function() {`
  - Flaky list or black list:

  ```javascript
  var FLAKY_LIST = [
    "treemap_coffee",
    "treemap_textposition",
    "treemap_with-without_values_template",
    "trace_metatext",
    "gl3d_directions-streamtube1",
  ];
  ```

  - Identifing flaky javascript.feature = `@qtwebkit_skip @flaky`
    - https://github.com/qutebrowser/qutebrowser/blob/8bf7cb539ad44076deabed1740c4cfe29adb1252/tests/end2end/features/javascript.feature
  - assertFocus function:

  ```javascript
  function assertFocus(selector: string, done: MochaDone) {
    wrapper.update();
    // the behavior being tested relies on requestAnimationFrame. to
    // avoid flakiness, use nested setTimeouts to delay execution until
    // the next frame, not just to the end of the current frame.
    setTimeout(() => {
      setTimeout(() => {
        assert.strictEqual(
          document.querySelector(selector),
          document.activeElement
        );
        done();
      });
    });
  }
  ```

  - Flaky json config:

  ```json
   "flaky_test_config": {
    "global_config": {
      "max_retries": 2,
      "retry_delay_ms": 500,
      "min_changed_pixel_count": 15,
      "max_changed_pixel_fraction_to_retry": 0.10,
      "font_face_observer_timeout_ms": 3000,
      "fonts_loaded_reflow_delay_ms": 50
    },

    "config_overrides": [
      {
        "browser_regex_patterns": [
          "desktop_windows_edge@latest",
          "desktop_windows_ie@11"
        ],
        "custom_config": {
          "max_retries": 4,
          "fonts_loaded_reflow_delay_ms": 300
        }
      },
      {
        "browser_regex_patterns": [
          "desktop_windows_edge@latest",
          "desktop_windows_ie@11"
        ],
        "url_regex_patterns": [
          "mdc-textfield",
          "mdc-typography"
        ],
        "custom_config": {
          "max_retries": 6,
          "fonts_loaded_reflow_delay_ms": 500
        }
      }
    ]
  }
  ```

