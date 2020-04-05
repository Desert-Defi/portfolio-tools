// strategy template

import Strategy from '../strategy.js';

const calcWeights = (dateIndex, returnsByAsset, options, context) => {
  // initialize weights
  let weightByAsset = Array(returnsByAsset.length).fill(0);

  return weightByAsset;
};

const checkRebalance = (
  currentWeights,
  newWeights,
  dateIndex,
  lastRebalanceIndex,
  options,
  context
) => {
  // return true to rebalance
  return false;
};

const validateOptions = (options, returnsByAsset) => {
  // throw error on invalid options properties
};

const validateContext = (context, returnsByAsset) => {
  // throw error on invalid context properties
};

export default new Strategy(
  calcWeights,
  checkRebalance,
  validateOptions,
  validateContext
);
