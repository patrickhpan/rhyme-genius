var WORDS, CALC, TIMES;
var delay = 0;

// Redraw function
var updateUI = function(time) {

  var current = currentWord(time);
  var word = WORDS[current];
  var a = assonance(word.syls);

  $(".word").each(function(i, $word) {
    if(Math.abs(i - current) < 30 && assonance(WORDS[i].syls) == a) {
      $($word).addClass('bg' + _.indexOf(vowels, a.slice(0, 2)) % 3);
    } else {
      $($word).removeClass('bg0 bg1 bg2');
    }
    $($word).removeClass('active0 active1 active2');
  })
  $("[data-global-num=" + current + "]").addClass('active' + _.indexOf(vowels, a.slice(0, 2)) % 3)
  $("[data-global-num=" + current + "]").removeClass('bg0 bg1 bg2');
}

var currentWord = function(time) {
  if (time < TIMES[0]) return "";
  return Math.max(_.sortedIndex(TIMES, time - delay) - 1, 0);
}

var scroll = function() {
  var current = currentWord(playerState.last_time);
  var line = $("[data-global-num=" + current + "]").parent().attr("data-line-num");
  $("#lyrics").animate({
    scrollTop: $("[data-line-num=" + line + "]")[0].offsetTop - $("#lyrics").height() * 0.4
  }, 80)
}

var shouldScroll = 0;

var scrollLoop = function() {
  console.log("scrollLoop")
  if(shouldScroll % 6 == 0) {
    scroll();
    shouldScroll = 0;
  } else {
    shouldScroll++;
  }
  setTimeout(scrollLoop, 1000);
}
scrollLoop();

$("#lyrics").scroll($.throttle(function() {
  shouldScroll = 1;
}, 1000))
