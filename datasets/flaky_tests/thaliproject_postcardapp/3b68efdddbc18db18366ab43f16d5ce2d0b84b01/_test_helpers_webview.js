//  https://github.com/thaliproject/postcardapp/blob/3b68efdddbc18db18366ab43f16d5ce2d0b84b01/test/helpers/webview.js 

// blob: 3b68efdddbc18db18366ab43f16d5ce2d0b84b01 

// project_name: thaliproject/postcardapp 

// flaky_file: /test/helpers/webview.js 

// test_affected:  https://github.com/thaliproject/postcardapp/blob/3b68efdddbc18db18366ab43f16d5ce2d0b84b01/test/helpers/webview.js 
// start_line:  47 
// end_line:  53 
shouldLoadPostcardWithMessage: function(driver, message) {
  return driver
    .waitForElementByCss("#textbox", asserters.isDisplayed, defaults.wait.short)
    //.waitForConditionInBrowser('document.querySelector("#textbox").value.length > 0', defaults.wait.long)
    .eval('document.querySelector("#textbox").value')
    .should.eventually.contain(message);
},
// start_line:  62 
// end_line:  69 
shouldCountMyPostcardsWithNumber: function(driver, total) {
  return driver
    .waitForElementByCss('#editButton', asserters.isDisplayed, defaults.wait.short)
    .click()
    .waitForElementByCss('#myPostcards', asserters.isDisplayed, defaults.wait.short)
    .eval('document.querySelectorAll("#myPostcards .row:not([hidden])").length')
    .should.eventually.equal(total);
},
