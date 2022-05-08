// https://github.com/twbs/bootstrap/blob/3b2418e6885d31d9cd1eab33b4cb952e876f8cf7/js/tests/unit/tooltip.js 

// blob: 3b2418e6885d31d9cd1eab33b4cb952e876f8cf7 

// project_name: twbs/bootstrap 

// flaky_file: /js/tests/unit/tooltip.js 

// test_affected: https://github.com/twbs/bootstrap/blob/3b2418e6885d31d9cd1eab33b4cb952e876f8cf7/js/tests/unit/tooltip.js 
// start_line: 389 
// end_line: 426 
test('tooltips should be placed dynamically, with the dynamic placement option', function () {
  $.support.transition = false
  var ttContainer = $('<div id="dynamic-tt-test"/>').css({
    'height': 400,
    'overflow': 'hidden',
    'position': 'absolute',
    'top': 0,
    'left': 0,
    'width': 600
  })
    .appendTo('body')

  var topTooltip = $('<div style="display: inline-block; position: absolute; left: 0; top: 0;" rel="tooltip" title="Top tooltip">Top Dynamic Tooltip</div>')
    .appendTo('#dynamic-tt-test')
    .tooltip({ placement: 'auto' })
    .tooltip('show')

  ok($('.tooltip').is('.bottom'), 'top positioned tooltip is dynamically positioned bottom')

  topTooltip.tooltip('hide')

  var rightTooltip = $('<div style="display: inline-block; position: absolute; right: 0;" rel="tooltip" title="Right tooltip">Right Dynamic Tooltip</div>')
    .appendTo('#dynamic-tt-test')
    .tooltip({ placement: 'right auto' })
    .tooltip('show')

  ok($('.tooltip').is('.left'), 'right positioned tooltip is dynamically positioned left')
  rightTooltip.tooltip('hide')

  var leftTooltip = $('<div style="display: inline-block; position: absolute; left: 0;" rel="tooltip" title="Left tooltip">Left Dynamic Tooltip</div>')
    .appendTo('#dynamic-tt-test')
    .tooltip({ placement: 'auto left' })
    .tooltip('show')

  ok($('.tooltip').is('.right'), 'left positioned tooltip is dynamically positioned right')
  leftTooltip.tooltip('hide')

  ttContainer.remove()
})
