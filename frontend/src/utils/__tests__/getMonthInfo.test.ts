import { describe, expect, it } from 'vitest';
import { getMonthDays, getMonthName } from '../getMonthInfo.ts';

describe('get month name', () => {
  it("should return the string name of a month for an input of the month's array index", () => {
    const JanuaryIndex = 0;
    const JulyIndex = 6;
    expect(getMonthName(JanuaryIndex)).toBe('January');
    expect(getMonthName(JulyIndex)).toBe('July');
  });

  it('should throw on invalid month index', () => {
    const negativeIndex = -1;
    const tooHighIndex = 12;
    expect(() => getMonthName(negativeIndex)).toThrowError('Invalid month index');
    expect(() => getMonthName(tooHighIndex)).toThrowError('Invalid month index');
  });
});

describe('get month days', () => {
  it('should return the number of days in a month', () => {
    const JanuaryIndex = 0;
    const FebruaryIndex = 1;
    expect(getMonthDays(JanuaryIndex)).toBe(31);
    expect(getMonthDays(FebruaryIndex)).toBe(28);
  });

  it('should throw on invalid month index', () => {
    const negativeIndex = -1;
    const tooHighIndex = 12;
    expect(() => getMonthDays(negativeIndex)).toThrowError('Invalid month index');
    expect(() => getMonthDays(tooHighIndex)).toThrowError('Invalid month index');
  });
});
