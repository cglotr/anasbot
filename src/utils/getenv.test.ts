import { getEnv } from './getenv';

describe('getEnv', () => {
  const process = {
    env: {
      UNDEFINED: undefined,
      SINGLE: 'single',
      MULTI: '1,2,3',
    },
  };

  it('should handle undefined env', () => {
    expect(getEnv(process.env.UNDEFINED)).toEqual([]);
  });

  it('should handle single env', () => {
    expect(getEnv(process.env.SINGLE)).toEqual(['single']);
  });

  it('should handle multiple envs', () => {
    expect(getEnv(process.env.MULTI)).toEqual(['1', '2', '3']);
  });
});
