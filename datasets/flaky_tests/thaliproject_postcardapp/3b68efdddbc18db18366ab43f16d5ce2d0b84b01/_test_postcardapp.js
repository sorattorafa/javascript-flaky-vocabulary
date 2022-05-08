//  https://github.com/thaliproject/postcardapp/blob/3b68efdddbc18db18366ab43f16d5ce2d0b84b01/test/postcardapp.js 

// blob: 3b68efdddbc18db18366ab43f16d5ce2d0b84b01 

// project_name: thaliproject/postcardapp 

// flaky_file: /test/postcardapp.js 

// test_affected:  https://github.com/thaliproject/postcardapp/blob/3b68efdddbc18db18366ab43f16d5ce2d0b84b01/test/postcardapp.js 
// start_line:  38 
// end_line:  55 
function switchContextToWebview(driver) {
  return driver
    .setImplicitWaitTimeout(defaults.wait.long)
    .sleep(defaults.wait.splashscreen)
    .contexts()
    .then(function (contexts) {
      if (contexts.length < 2) {
        console.error("Could not find webview in contexts:", contexts);
        throw new Error("Stopping tests as webview context was not found.");
        return driver.quit();
      }
      var webviewContext = _.find(contexts, function (context) {
        return context.indexOf('WEBVIEW') !== -1;
      });
      console.log('webview context:', webviewContext);
      return driver.context(webviewContext).setAsyncScriptTimeout(defaults.timeout.app);
    });
}
// start_line:  213 
// end_line:  221 
it("should delete a postcard", function () {
  return driver
    .waitForElementByCss('#editButton', asserters.isDisplayed, defaults.wait.short)
    .click()
    .eval('document.querySelector(\'#myPostcards .row paper-fab[icon="delete"]\').click()')
    .sleep(defaults.wait.long)
    .waitForElementByCss('#myPostcards', asserters.isDisplayed, defaults.wait.short)
    .text().should.eventually.not.contain(defaults.message2);
});
// start_line: 223 
// end_line: 228 
it("should be one postcard remaining after delete", function () {
  return driver
    .waitForElementByCss('#myPostcards', asserters.isDisplayed, defaults.wait.short)
    .eval('document.querySelectorAll("#myPostcards .row:not([hidden])").length')
    .should.eventually.equal(1);
});
