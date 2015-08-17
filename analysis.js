var lookup = function(word) {
    word = word.toUpperCase();
    if (dict[word])
        return dict[word].split(" ");
    else if (dict[word = word.replace(/^'/ig, "")])
        return (dict[word]).split(" ");
    else if (dict[word = word.replace(/'?s$/ig, "")])
        return (dict[word] + " Z").split(" ");
    else if (dict[word = word.replace(/IN'?$/ig, "ING")])
        return (dict[word]).split(" ");
    console.error("Unpronouncable: " + word);
    return [];
}


var isVowel = function(syl) {
    return syl.match(/\d/g) ? syl.charAt(2) : 0;
}

var parse = function(lyrics) {
    var root = $(lyrics).find('transcript')[0];
    var data = _.map(root.children, function(child) {
        return {
            "text": child.textContent.replace(/[^A-z'\-0-9 ]/g, ""),
            "start": parseFloat(child.attributes.start.value),
            "duration": parseFloat(child.attributes.dur.value)
        };
    });
    return data;
}

var calculate = function(lyrics) {
    var calculated = _.map(lyrics, function(lyric) {
        var line = lyric.text;
        var words = line.split(" ");
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
    return calculated;
}

function isVowel(syl) {
    return syl.match(/\d/g) ? syl.charAt(2) : 0;
}

function assonance(pronun) {
    var laststress = pronun.length - 1;
    while (laststress >= 0) {
        var stress = pronun[laststress--];
        if (isVowel(stress) == 3) {
            return stress;
        }
    };
}
