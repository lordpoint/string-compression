"use strict";

$('#compressBtn').click(function() {
  $('.input-area').addClass('col-sm-6');
  $('.output-area').addClass('col-sm-6 col-xs-12');

  $('.output-area').delay(500).fadeIn(300);
  $('.stats-area').delay(500).fadeIn(300);

  $('#compressBtn').fadeOut(500);
  $('.reset-btn').delay(500).fadeIn(300);
})
