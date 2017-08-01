"use strict";

//TODO don't add a word to "repeatedWords" if it is only 1 character
//TODO Capitalized words are treated as different from their non-capitalized counterparts, there should be a solution to this

const compressionVal = ['¡','¢','£','¤','¥','¦','§','¨','©','ª','«','¬','®','¯','°','±','²','³','´','µ','¶','·','¸','¹','º','»','¼','½','¾','¿','À','Á','Â','Ã','Ä','Å','Æ','Ç','È','É','Ê','Ë','Ì','Í','Î','Ï','Ð','Ñ','Ò','Ó','Ô','Õ','Ö','×','Ø','Ù','Ú','Û','Ü','Ý','Þ','ß','à','á','â','ã','ä','å','æ','ç','è','é','ê','ë','ì','í','î','ï','ð','ñ','ò','ó','ô','õ','ö','÷','ø','ù','ú','û','ü','ý','þ','ÿ','Œ','œ','Š','š','Ÿ','ƒ','†','‡','•','…','‰','€','™'];
let beginningValue = '';
let endingValue = '';

// Resetting just reloads the page. Quickest way to clear values.
function reset() {
  location.reload();
}

// Identify repeated words in the string
function getRepeats() {
  let input = $('#input').val();
  let wordCounts = [];
  let words = input.split(/\b/);

  for(let i = 0; i < words.length; i++) {
    let thisWord = words[i];
    let repeatedWord = {};
    let instances = 1;
    let isMatch = false;
    for(let m = i+1; m < words.length; m++) {
      if (thisWord == words[m] && thisWord !== ' ') {
        isMatch = true;
        instances++;
        words.splice(m, 1);
      }
      if (m == words.length -1 && isMatch == true) {
        repeatedWord.word = thisWord;
        repeatedWord.instances = instances;
        wordCounts.push(repeatedWord);
      }
      // There was an issue where the above "if" statement didn't catch repeats
      // in small strings where the first & last words were the same. This "else if"
      // fixes that, although there is likely a better solution.
      else if (m == words.length && isMatch == true) {
        repeatedWord.word = thisWord;
        repeatedWord.instances = instances;
        wordCounts.push(repeatedWord);
      }
    }
  }
  console.log(wordCounts);
  sortRepeats(wordCounts);
};

// Sort repeated words from least repeated to most repeated
function sortRepeats(repeatedWords) {
  let wordCounts = repeatedWords;
  wordCounts.sort(function(a, b) {
    return parseFloat(a.instances) - parseFloat(b.instances);
  });
  addCompressionValues(wordCounts);
};

// This was originally done to be more like Huffman compression, which is
// why the repeats were sorted; now that we're using unique characters this seems less
// important. However once the list of "compressionVal"s below is exhausted, we'll need
// to double up on the symbols, so after the 108th most used word, the 109th will be
// represented by two compressionVals, meaning that sorting the list isn't entirely useless
function addCompressionValues(sortedWords) {
  let wordCounts = sortedWords;
  let charIndex = 0;
  let charIndexIterations = 1;
  for (let v = wordCounts.length -1; v >= 0; v--) {
    if (charIndex < 107) {
      console.log("Index: " + charIndex + " Iterations: " + charIndexIterations);
      wordCounts[v].compVal = compressionVal[charIndex].repeat(charIndexIterations);

    } else {
      charIndexIterations++;
      charIndex = 0;
      console.log("Result: " + compressionVal[charIndex] + " Index: " + charIndex + " Iterations: " + charIndexIterations);
      wordCounts[v].compVal = compressionVal[charIndex].repeat(charIndexIterations);
    }
    charIndex++;
  }
  compress(wordCounts);
};

function compress(wordsWithVals) {
  let wordCounts = wordsWithVals;
  let input = $('#input').val();
  let outputArea = $('#output');
  let words = input.split(/\b/);

  for (let c = 0; c < wordCounts.length; c++) {
    let thisWord = wordCounts[c].word;
    let thisVal = wordCounts[c].compVal;
    for (let r = 0; r < words.length; r++) {
      if (words[r] == thisWord) {
        words[r] = thisVal;
      }
    }
  }

  // remove spaces after any compression characters
  for (let r = 0; r < words.length; r++) {
    for (let s = 0; s <= compressionVal.length; s++) {
      // criteria for removing spaces: if it follows a special character and if it is followed by a space (to prevent removal of periods, etc)
      if (words[r] == compressionVal[s] && words[r+1] == ' ') {
        words.splice(r+1, 1);
      }
    }
  }

  // add "compression val dictionary" at the beginning of the output
  /*
  for (let k = 0; k < wordCounts.length; k++){
    if (k == wordCounts.length-1) {
      outputArea.append(wordCounts[k].compVal + wordCounts[k].word + "}")
    } else {
      outputArea.append(wordCounts[k].compVal + wordCounts[k].word)
    }
  }
  */

  let result = words.join('');
  outputArea.append(result);

  let finalOutput = outputArea.val();

  byteLength(input, "Original");
  byteLength(finalOutput, " / Compressed");
}

function byteLength(str, state) {
  let resultsArea = $('#results');
  var s = str.length;

  for (var i=str.length-1; i>=0; i--) {
    var code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) s++;
    else if (code > 0x7ff && code <= 0xffff) s+=2;
    if (code >= 0xDC00 && code <= 0xDFFF) i--; //trail surrogate
  }

  let results = '<span>' + state + ": " + s + ' bytes </span>';
  resultsArea.append(results);

  if (beginningValue == '') {
    beginningValue = s;
  } else {
    endingValue = s;
    calcCompressionPercent(beginningValue, endingValue);
  }
};

function calcCompressionPercent(a, b) {
  let resultsArea = $('#results');
  let difference = a - b;
  let percentage = (difference * 100) / a;
  let resultsOutput = '<span> / Percent Compression: ' + Math.round(percentage * 100) / 100 + '</span>';
  resultsArea.append(resultsOutput);
}
