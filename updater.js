var WORDS, CALC, TIMES;
var delay = 0;

var updateUI = function(time) {
    var current = currentWord(time);
    var word = WORDS[current];
    // $("#word").html(time.toFixed(1) + " " + word.word);
    // console.log(time.toFixed(1) + " " + word.word);
    // console.log(assonance(word.syls));
    // var a = assonance(word.syls);

    var a = assonance(word.syls);
    // console.log(a);
    // if ($("#" + a).children() && $("#" + a).children().last().attr("data-global-num") != current) {
    //     $(".line").each(function() {
    //         $(this).removeClass("activeline")
    //     });
    //     $("#" + a).append("<span class='word' data-global-num='" + current + "'>" + word.word + "</span>");
    //     $("#" + a).addClass('activeline');
    //
    // }
    $(".word").each(function(i, $word) {
        if(assonance(WORDS[i].syls) == a) {
            $($word).addClass('bg' +  _.indexOf(vowels, a.slice(0,2)) % 3);
        } else {
            $($word).removeClass('bg0 bg1 bg2');
        }
        $($word).removeClass('active0 active1 active2');
    })
    $("[data-global-num=" + current + "]").addClass('active' + _.indexOf(vowels, a.slice(0,2)) % 3)
    $("[data-global-num=" + current + "]").removeClass('bg0 bg1 bg2');

}

var currentWord = function(time) {
    if(time < TIMES[0]) return "";
    return Math.max(_.sortedIndex(TIMES, time - delay) - 1, 0);
}
