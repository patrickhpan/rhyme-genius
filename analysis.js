// Looks up the word in the CMU dictionary, allowing for some flexbility
// Returns array of syllables
var lookup = function(word) {
  word = word.toUpperCase();

  if (dict[word])
    return dict[word].split(" ");

  // Allows correct lookup of words beginning with an apostrophe
  else if (dict[word = word.replace(/^'/ig, "")])
    return (dict[word]).split(" ");

  // Allows correct lookup of plural or possessive words (end with 'S or S)
  else if (dict[word = word.replace(/'?s$/ig, "")])
    return (dict[word] + " Z").split(" ");

  // Allows correct lookup of words ending in ING whose roots are listed
  else if (dict[word = word.replace(/IN'?$/ig, "ING")])
    return (dict[word]).split(" ");

  console.error("Unpronouncable: " + word);
  return [];
}

// Returns vowel stress if vowel, 0 if consonant
var isVowel = function(syl) {
  return syl.match(/\d/g) ? syl.charAt(2) : 0;
}

// Parse original lyric data
var parse = function(lyrics) {
  var root = $(lyrics).find('transcript')[0];

  // Return lines of lyrics as array of objects {text, start of line, duration of line}
  var data = _.map(root.children, function(child) {
    return {
      "text": child.textContent.replace(/[^A-z'\-0-9 ]/g, ""),
      "start": parseFloat(child.attributes.start.value),
      "duration": parseFloat(child.attributes.dur.value)
    };
  });
  return data;
}

// Given lyrics from parse(), add calculations for per-syllable timings
var calculate = function(lyrics) {
  return _.map(lyrics, function(lyric) {
    var words = lyric.text.split(" ");
    var syls = _.map(words, lookup);
    var timePerSyl = lyric.duration / _.filter(_.flatten(syls), isVowel).length;
    var time = lyric.start;
    var processedWords = _.map(words, function(word, i) {
      var length = _.filter(syls[i], isVowel).length;
      var out = {
        "word": word,
        "syls": syls[i],
        "time": time,
        "duration": timePerSyl * length
      };
      time += out.duration;
      return out;
    })
    return {
      text: lyric.text,
      start: lyric.start,
      duration: lyric.duration,
      words: processedWords
    }
  });
}

// Returns vowel stress if vowel, 0 if consonant
function isVowel(syl) {
  return syl.match(/\d/g) ? syl.charAt(2) : 0;
}

// Returns whether two words are assonant with each other
// All that needs to match is the last stressed vowel.
function assonance(pronun) {
  var laststress = pronun.length - 1;
  while (laststress >= 0) {
    var stress = pronun[laststress--];
    if (isVowel(stress) == 3) {
      return stress;
    }
  };
}
