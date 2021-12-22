const { MarkovMachine } = require('./markov.js');

describe('MarkovMachine test', function() {
    test('should store property "words" on instantiation', function() {
        const testMarkov = new MarkovMachine("This is a test example\nwith two lines");
        expect(testMarkov.words).toEqual(['This','is','a','test','example','with','two','lines']);
    });
    test('should store word map "chains" on instantiation', function() {
        const testMarkov = new MarkovMachine("This is a test example\nwith two lines");
        const expectedMap = {
            'This': ['is'],
            'is': ['a'],
            'a': ['test'],
            'test': ['example'],
            'example': ['with'],
            'with': ['two'],
            'two': ['lines'],
            'lines': [null],
        }
        expect(testMarkov.chains).toEqual(expectedMap);
    });
    test('should merge duplicate words into one map entry', function() {
        const testMarkov = new MarkovMachine("This is a test example\nwith test word repeated");
        const expectedMap = {
            'This': ['is'],
            'is': ['a'],
            'a': ['test'],
            'test': ['example','word'],
            'example': ['with'],
            'with': ['test'],
            'word': ['repeated'],
            'repeated': [null],
        }
        expect(testMarkov.chains).toEqual(expectedMap);
    });
    test('should generate text from the given words', function() {
        const testMarkov = new MarkovMachine("This is a test example\nwith test word repeated");
        const text = testMarkov.makeText(15);
        expect(testMarkov.makeText()).toEqual(expect.any(String));
        let words = text.split(/[ \r\n]+/);
        words = words.filter(c => c !== '');
        for (let word of words) {
            expect(testMarkov.words).toContain(word);
        }
    });
    test('should return text with the specified number of words', function() {
        const testMarkov = new MarkovMachine("This is a test example\nwith test word repeated");
        const text = testMarkov.makeText(12);
        let words = text.split(/[ \r\n]+/);
        words = words.filter(c => c !== '');
        expect(words.length).toEqual(12);
    });
    test('should be able to return a word at random from an array of words', function() {
        const testMarkov = new MarkovMachine("This is a test example\nwith test word repeated");
        expect(testMarkov.words).toContain(testMarkov.chooseWordAtRandom(testMarkov.words));
    })
    test('should support bigram chains at instantiation', function() {
        const testMarkov = new MarkovMachine("This is a test example\nwith test example word repeated");
        const expectedMap = {
            'This is': ['a'],
            'is a': ['test'],
            'a test': ['example'],
            'test example': ['with','word'],
            'example with': ['test'],
            'with test': ['example'],
            'example word': ['repeated'],
            'word repeated': [null],
        }
        expect(testMarkov.bigrams).toEqual(expectedMap);
    });
    test('should make test based on the bigram chains', function() {
        const testMarkov = new MarkovMachine("This is a test example\nwith test word repeated");
        const text = testMarkov.makeBigramText(15);
        console.log('generates from bigram: ',text);
        expect(text).toEqual(expect.any(String));
        let words = text.split(/[ \r\n]+/);
        words = words.filter(c => c !== '');
        for (let word of words) {
            expect(testMarkov.words).toContain(word);
        }
    });
    test('should create a list of starting options at instantiation', function() {
        const testMarkov = new MarkovMachine("This is a test example\nwith Test Word repeated");
        const text = testMarkov.makeBigramText(15);
        expect(testMarkov.startOptions).toEqual(['This is','Test Word','Word repeated']);
    });

});

