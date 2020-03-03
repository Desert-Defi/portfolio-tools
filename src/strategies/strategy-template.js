// strategy template

import Strategy from '../strategy';

const calcWeights = (dateIndex, pricesByAsset, options, context) => {
  // initialize weights
  let weightByAsset = Array(pricesByAsset.length).fill(0);

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

const validateOptions = (options, pricesByAsset) => {
  // throw error on invalid options properties
};

const validateContext = (context, pricesByAsset) => {
  // throw error on invalid context properties
};

export default new Strategy(
  calcWeights,
  checkRebalance,
  validateOptions,
  validateContext
);
