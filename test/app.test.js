const sum = require('./sum');

test('add 6 + 4 to equal 10', () => {
    expect(sum(6,4)).toBe(10);
});

//to test Jest, run npm test in your terminal