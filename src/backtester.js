/*
Params
  calcWeights: function(dateIndex, returnsByAsset, options, context) returns weightByAsset[]
  checkRebalance: function(currentWeights, newWeights, dateIndex, lastRebalanceIndex, options, context) returns bool
  returnsByAsset: 2D array of returns by asset [ asset1Returns[], asset2Returns[], ... ]
  options (optional): object that gets passed to calcWeights and checkRebalance with strategy options
  context (optional): object that gets passed to calcWeights and checkRebalance with contextual data

Returns
 Array
  [
    returns[],
    weightsByAsset[][]
  ]
*/

import round from './math/round.js';

const precision = 14;

export default function backtester(
  returnsByAsset,
  calcWeights,
  checkRebalance,
  options = {},
  context = {}
) {
  if (returnsByAsset.some((el) => el.length !== returnsByAsset[0].length))
    throw new Error('returnsByAsset not uniform length');

  // initialize results
  const returns = [];
  const weightsByAsset = Array(returnsByAsset.length)
    .fill(0)
    .map(() => [0]);
  let lastRebalanceIndex = null;
  let initialWeights = Array(returnsByAsset.length).fill(0);

  // calc initial weights
  let newWeights = calcWeights(0, returnsByAsset, options, context);

  // sanity check
  let newWeightsSum = round(
    newWeights.reduce((sum, w) => w + sum, 0),
    precision
  );
  if (newWeightsSum !== 1 && newWeightsSum !== 0)
    throw new Error('New weights dont sum to 1 or 0');

  // check if should rebalance
  if (
    checkRebalance(
      initialWeights,
      newWeights,
      0,
      lastRebalanceIndex,
      options,
      context
    )
  ) {
    // check if new weight calculations differ from current
    if (initialWeights.some((cw, i) => cw !== newWeights[i])) {
      lastRebalanceIndex = 0;
      // record weights
      initialWeights = newWeights;
    }
  }

  // calc initial returns
  returns[0] = initialWeights.reduce((r, w, assetIndex) => {
    const curr = returnsByAsset[assetIndex][0];
    if (isNaN(curr)) throw new Error('NaN in returnsByAsset');
    return r + w * curr;
  }, 0);

  // record initial weights
  let totRet = 1 + returns[0];
  weightsByAsset.forEach((assetWeights, assetIndex) => {
    const ret = returnsByAsset[assetIndex][0];
    assetWeights[0] = (initialWeights[assetIndex] * (1 + ret)) / totRet || 0;
  });

  // iterate through dates
  for (let dateIndex = 1; dateIndex < returnsByAsset[0].length; dateIndex++) {
    // calc date's return
    returns[dateIndex] = weightsByAsset.reduce((r, weights, assetIndex) => {
      const curr = returnsByAsset[assetIndex][dateIndex];
      if (isNaN(curr)) throw new Error('NaN in returnsByAsset');
      return r + weights[dateIndex - 1] * curr;
    }, 0);

    // calc new weights
    newWeights = calcWeights(dateIndex, returnsByAsset, options, context);

    // sanity check
    newWeightsSum = round(
      newWeights.reduce((sum, w) => w + sum, 0),
      precision
    );
    if (newWeightsSum !== 1 && newWeightsSum !== 0)
      throw new Error('New weights dont sum to 1 or 0');

    // check if should rebalance
    if (
      checkRebalance(
        weightsByAsset[dateIndex - 1],
        newWeights,
        dateIndex,
        lastRebalanceIndex,
        options,
        context
      )
    ) {
      // check if new weight calculations differ from current
      if (
        weightsByAsset.some(
          (weights, assetIndex) =>
            weights[dateIndex - 1] !== newWeights[assetIndex]
        )
      ) {
        lastRebalanceIndex = dateIndex;
        // record new weights
        weightsByAsset.forEach(
          (assetWeights, assetIndex) =>
            (assetWeights[dateIndex] = newWeights[assetIndex])
        );
        continue;
      }
    }

    // record adjusted weights
    totRet = 1 + returns[dateIndex];
    weightsByAsset.forEach((assetWeights, assetIndex) => {
      const ret = returnsByAsset[assetIndex][dateIndex];
      assetWeights[dateIndex] =
        (assetWeights[dateIndex - 1] * (1 + ret)) / totRet || 0;
    });
  }

  return [returns, weightsByAsset];
}
