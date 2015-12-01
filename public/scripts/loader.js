var PLAYER;
var playerState = {
  last_time: 0,
  last_updated: 0
}
var updateLoop;

// Searches YouTube for query and gets top ten videos.
var getVideos = function(query) {
  var videos = [];
  $.ajax({
    url: 'https://www.googleapis.com/youtube/v3/search',
    method: 'GET',
    async: false,
    data: {
      "key": API_KEY,
      "q": query,
      "part": "snippet",
      "maxResults": "10",
      "safeSearch": "none"
    },
    success: function(data) {
      videos = _.map(data.items, function(item) {
        return item.id.videoId;
      }); // Extract only YouTube IDs
    }
  });
  return videos;
}

// Searches Musixmatch for lyric data for a given YouTube ID.
var getLyrics = function(id) {
  var hash = _.map(id, function(letter) {
    return (letter.charCodeAt(0) + 13) + "A";
  }).join(""); // Hash YouTube ID to access musixmatch
  var url = 'https://extension.musixmatch.com/?res=' + hash + '&v=' + id; // API URL
  var lyrics;
  $.ajax({
    url: url,
    async: false,
    timeout: 1000,
    success: function(data) {
      lyrics = data;
    }
  })
  return lyrics;
}

// Find the first video with lyrics (if any are available)
var pickVideos = function(ids) {
  var found = _.find(ids, getLyrics);
  if (!found) {
    noLyrics();
  } else {
    createUI(found);
  }
}

var noLyrics = function() {
  // TODO: return some nice error message
}

// Create the main UI.
var createUI = function(id) {
  createPlayer(id);
  createLyrics(id);
}

// Create the YouTube Player.
var createPlayer = function(id) {

  // Autoplay (triggering the onPlayerStateChange)
  var onPlayerReady = function(event) {
    event.target.playVideo();
    scrollLoop();

  }

  // Initialize update loop for YouTube player for accurate timing
  var onPlayerStateChange = function(event) {
    if (event.data == YT.PlayerState.PLAYING) { // If now playing
      updateLoop = setInterval(function() {
        var time = PLAYER.getCurrentTime(); // Get current player time (not updated often)
        if (time == playerState.last_time) { // Check if time was not updated
          time += (new Date() - playerState.last_updated) / 1000; // Add elapsed time to player time
        } else { // If player time was correctly updated, update last_time and last_updated
          playerState.last_time = time;
          playerState.last_updated = +new Date();
        }
        updateUI(time);
      }, 50);
    } else { // If now paused
      clearInterval(updateLoop);
    }
  }

 PLAYER = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: id,
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    },
  });
  if(id == '_Yhyp-_hX2s') delay = -1.8
  else if (id == 'xufJHc2EdBA') delay = 1;
}

var createLyrics = function(id) {
  var lyrics = parse(getLyrics(id));
  CALC = calculate(lyrics);
  WORDS = _.flatten(_.pluck(CALC, "words"));
  TIMES = _.pluck(WORDS, "time");
  var $lyrics = $("#lyrics");
  var counter = 0;
  _.each(lyrics, function(line, i) {
    var $newline = $("<div class='line'></div>");
    $newline.attr("data-line-num", i);
    var words = line.text.split(" ");
    _.each(words, function(word, j) {
      var $newword = $("<span class='word'>" + word + "</span>");
      $newword.attr("data-local-num", j);
      $newword.attr("data-global-num", j + counter);
      $newline.append($newword);
      $newword.click(function() {
        PLAYER.seekTo(TIMES[Number($(this).attr("data-global-num"))]);
      })
    });
    counter += words.length;
    $lyrics.append($newline);
  });







  $("#lyrics").scroll(function() {
    shouldScroll = 1;
    clearInterval(scrollinterval);
    scrollLoop();

  })

}
var shouldScroll = 0;
var scroll = function() {
  var current = currentWord(playerState.last_time);
  var line = $("[data-global-num=" + current + "]").parent().attr("data-line-num");
  $("#lyrics").animate({
    scrollTop: $("[data-line-num=" + line + "]")[0].offsetTop - $("#lyrics").height() * 0.4
  }, 80)
}
var scrollLoop = function() {
  console.log("scrollLoop")

  if(shouldScroll % 6 == 0) {
    scroll();
    shouldScroll = 0;
  } else {
    shouldScroll++;
  }
  scrollinterval = setTimeout(scrollLoop, 1000);

}

var scrollinterval;
