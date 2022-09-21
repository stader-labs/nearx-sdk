import { divide, multiply, subtract, sum } from '../src';

describe('blah', () => {
  it('add-works!', () => {
    expect(sum(1, 1)).toEqual(2);
  });

  it('subtract-works!', () => {
    expect(subtract(1, 1)).toEqual(0);
  });

  it('multiply-works!', () => {
    expect(multiply(1, 1)).toEqual(1);
  });

  it('divide-works!', () => {
    expect(divide(1, 1)).toEqual(1);
  });

  it('division-with-zero-throws-error', () => {
    expect(() => {
      divide(1, 0);
    }).toThrowError('Cannot divide by zero');
  });
});
