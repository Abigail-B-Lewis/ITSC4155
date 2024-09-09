const sum = require('../app');

test('add 6 + 4 to equal 10', () => {
    expect(sum(6,4)).toBe(10);
});