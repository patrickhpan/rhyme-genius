var vowels = ['AO', 'AA', 'IY', 'UW', 'EH', 'ER', 'IH', 'UH', 'AH', 'AX', 'AE', 'EY', 'AY', 'OW', 'AW', 'OY'];
var createLine = function() {
  $(".line").remove();
  _.each(vowels, function(vowel) {
    $("body").append("<div class='line' id='" + vowel + "3'>" + vowel + ": </div>");
  })
}
