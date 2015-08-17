    var vowels = ['AO', 'AA', 'IY', 'UW', 'EH', 'ER', 'IH', 'UH', 'AH', 'AX', 'AE', 'EY', 'AY', 'OW', 'AW', 'OY'];
var createLine = function() {
    $(".line").remove();
    _.each(vowels, function(vowel) {
        $("body").append("<div class='line' id='" + vowel + "3'>" + vowel + ": </div>");
    })
}

// var sort = function() {
//     $(".line").sort(function(a, b) {
//         var aa = $(a).children().length, bb = $(b).children.length;
//         if(aa == bb) return 0; else return aa < bb;
//     }).detach().appendTo("body");
// }
