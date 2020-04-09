import Strategy from './strategy.js';
import backtester from './backtester.js';

export default class Simulation {
  constructor(returnsByAsset, strategy, options = {}, context = {}) {
    if (!Array.isArray(returnsByAsset) || returnsByAsset.length === 0)
      throw new Error('invalid returnsByAsset');
    this.returnsByAsset = returnsByAsset;

    if (!(strategy instanceof Strategy))
      throw new Error('strategy not an instance of Strategy');
    this.strategy = strategy;

    strategy.validateOptions(options, returnsByAsset);
    this.options = options;

    strategy.validateContext(context, returnsByAsset);
    this.context = context;

    this.results = null;
  }
  run() {
    const [returns, weightsByAsset] = backtester(
      this.returnsByAsset,
      this.strategy.calcWeights,
      this.options,
      this.context
    );
    this.results = { returns, weightsByAsset };
  }
}
