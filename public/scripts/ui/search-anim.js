

$(window).load(function() {
  $("body").fadeIn(500);
  setTimeout(showBox, 1300)
})

var showBox = function() {
  $("#search-box").finish().velocity({
      width: '400px',
      'padding-left': '50px',
      'padding-right': '12px',
      'margin-left': '-20px'
  });
  $("#search-box").focus();
}

// var hideBox = function() {
//   if ($("#search-box").val().trim() == "") var delay = 1200;
//   else var delay = 2000;
//   $("#search-box").finish().delay(delay).velocity({
//       width: 0,
//       'padding-left': '0',
//       'padding-right': '0',
//   });
// }

// $(function() {
//   $("#search-anim").click(showBox)
//   $("#search-box").blur(hideBox)
// })


$("#search-box").keydown(function(e) {
  if(e.keyCode == 13) {
    $(".intro-header").fadeOut(3000)
    pickVideos(getVideos($("#search-box").val()))
    delay = -1.5
  }
})
