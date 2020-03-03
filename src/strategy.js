import backtester from './backtester.js';

export default class Strategy {
  constructor(
    calcWeights,
    checkRebalance,
    validateOptions = () => {},
    validateContext = () => {}
  ) {
    if (typeof calcWeights !== 'function')
      throw new Error('calcWeights not a function');
    this.calcWeights = calcWeights;

    if (typeof checkRebalance !== 'function')
      throw new Error('checkRebalance not a function');
    this.checkRebalance = checkRebalance;

    if (typeof validateOptions !== 'function')
      throw new Error('validateOptions not a function');
    this.validateOptions = validateOptions;

    if (typeof validateContext !== 'function')
      throw new Error('validateContext not a function');
    this.validateContext = validateContext;
  }
}
