import { singleValueFactory } from '@actualwave/closure-value';
import { assignOwnPropsOverwrite } from '@actualwave/assign-own-props';

export const { get: getCurrentGlobals, set: resetGlobals } = singleValueFactory({});

function GlobalMock() {
  Object.defineProperties(this, {
    global: { value: this, enumerable: true, configurable: false },
    self: { value: this, enumerable: true, configurable: false },
    /* 
      Requesting global.performance in a debug mode will cause TypeError: Illegal invocation, 
      so I have to restrict access to it via prototype.

      Prettier requests it.
     */
    performance: { value: undefined },
  });
}

if (typeof global === 'object') {
  GlobalMock.prototype = global;
}

export const createGlobalObject = (...objs) => {
  const mock = new GlobalMock();

  return assignOwnPropsOverwrite(mock, getCurrentGlobals(), ...objs);
};
