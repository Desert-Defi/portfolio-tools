export default class Strategy {
  constructor(
    calcWeights,
    validateOptions = () => {},
    validateContext = () => {}
  ) {
    if (typeof calcWeights !== 'function')
      throw new Error('calcWeights not a function');
    this.calcWeights = calcWeights;

    if (typeof validateOptions !== 'function')
      throw new Error('validateOptions not a function');
    this.validateOptions = validateOptions;

    if (typeof validateContext !== 'function')
      throw new Error('validateContext not a function');
    this.validateContext = validateContext;
  }
}
