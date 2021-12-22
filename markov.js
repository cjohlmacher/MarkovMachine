/** Textual markov chain generator */


class MarkovMachine {

  /** build markov machine; read in text.*/

  constructor(text) {
    let words = text.split(/[ \r\n]+/);
    this.words = words.filter(c => c !== "");
    this.chains = this.makeChains();
    this.bigrams = this.makeBigramChains();
    this.startOptions = [];
  }

  /** set markov chains:
   *
   *  for text of "the cat in the hat", chains will be
   *  {"the": ["cat", "hat"], "cat": ["in"], "in": ["the"], "hat": [null]} */

  makeChains() {
    let chains = {};
    for (let i=0; i<this.words.length-1;i++) {
      if (this.words[i] in chains) {
        chains[this.words[i]].push(this.words[i+1])
      } else {
        chains[this.words[i]] = [this.words[i+1]]
      };
    };
    const lastWord = this.words.slice(-1);
    if (lastWord in chains) {
      chains[lastWord].push(null);
    } else {
      chains[lastWord] = [null];
    }
    return chains;
  };

  /* set markov bigram chains */
  makeBigramChains() {
    let chains = {};
    for (let i=1; i<this.words.length-1;i++) {
      let join = this.words[i-1] + ' ' + this.words[i];
      if (join in chains) {
        chains[join].push(this.words[i+1])
      } else {
        chains[join] = [this.words[i+1]]
      };
    };
    const lastWords = this.words.slice(-2,-1) + ' ' + this.words.slice(-1);
    if (lastWords in chains) {
      chains[lastWords].push(null);
    } else {
      chains[lastWords] = [null];
    }
    return chains;
  };

  setStartOptions(chains) {
    const options = Object.keys(chains).filter(c => {
      return c[0] == c[0].toUpperCase();
    });
    return options;
  };

  /** return random text from chains */
  makeText(numWords = 100) {
    this.startOptions = this.setStartOptions(this.chains);
    let text = this.chooseWordAtRandom(this.startOptions);
    let previousWord = text;
    let nextWord;
    while (numWords > 1) {
      nextWord = this.chooseWordAtRandom(this.chains[previousWord]);
      if (nextWord == null) {
        nextWord = this.chooseWordAtRandom(this.startOptions);
      };
      text = text + ' ' + nextWord;
      previousWord = nextWord;
      numWords -= 1; 
    };
    return text;
  };

  /* return random text from bigram chains */
  makeBigramText(numWords=100) {
    this.startOptions = this.setStartOptions(this.bigrams);
    let text = this.chooseWordAtRandom(this.startOptions);
    let previousWords = text;
    let nextWord;
    while (numWords > 1) {
        nextWord = this.chooseWordAtRandom(this.bigrams[previousWords]);
      if (nextWord == null) {
        nextWord = this.chooseWordAtRandom(this.startOptions);
        text = text + ' ' + nextWord;
        previousWords = nextWord;
        numWords -= 1;
      } else {
        text = text + ' ' + nextWord;
        previousWords = previousWords.split(/[ \r\n]+/).slice(-1) + ' ' + nextWord;
      };
      numWords -= 1; 
    };
    return text;
  }

  /** Choose word at random from list */
  chooseWordAtRandom(words) {
    let randomIndex = Math.floor(Math.random()*words.length)
    return words[randomIndex];
  }
}

module.exports = { MarkovMachine };
