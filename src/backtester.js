/*
Params
  calcWeights: function(dateIndex, pricesByAsset, options, context) returns weightByAsset[]
  checkRebalance: function(currentWeights, newWeights, dateIndex, lastRebalanceIndex, options, context) returns bool
  pricesByAsset: 2D array of prices by asset [ asset1Prices[], asset2Prices[], ... ]
  options (optional): object that gets passed to calcWeights and checkRebalance with strategy options
  context (optional): object that gets passed to calcWeights and checkRebalance with contextual data

Returns
 Array
  [
    returns[],
    weightsByAsset[][]
  ]
*/

export default function backtester(
  pricesByAsset,
  calcWeights,
  checkRebalance,
  options = {},
  context = {}
) {
  if (pricesByAsset.some((el) => el.length !== pricesByAsset[0].length))
    throw new Error('pricesByAsset not uniform length');

  // initialize results
  const returns = [0];
  const weightsByAsset = Array(pricesByAsset.length)
    .fill(0)
    .map((w) => [0]);

  let currentWeights = Array(pricesByAsset.length).fill(0);
  let lastRebalanceIndex = null;
  // iterate through dates
  for (let dateIndex = 1; dateIndex < pricesByAsset[0].length; dateIndex++) {
    // calc date's return from prev date
    returns[dateIndex] = currentWeights.reduce((r, w, assetIndex) => {
      const curr = pricesByAsset[assetIndex][dateIndex];
      if (isNaN(curr)) throw new Error('NaN in pricesByAsset');
      if (options.isReturns) return r + w * curr;
      const prev = pricesByAsset[assetIndex][dateIndex - 1];
      if (isNaN(prev)) throw new Error('NaN in pricesByAsset');
      if (prev <= 0 || curr <= 0) return r;
      return r + w * ((curr - prev) / prev);
    }, 0);

    // calc new weights
    const newWeights = calcWeights(dateIndex, pricesByAsset, options, context);

    // check if should rebalance
    if (
      checkRebalance(
        currentWeights,
        newWeights,
        dateIndex,
        lastRebalanceIndex,
        options,
        context
      )
    ) {
      // check if new weight calculations differ from current
      if (currentWeights.some((cw, i) => cw !== newWeights[i])) {
        currentWeights = newWeights;
        lastRebalanceIndex = dateIndex;
      }
    }

    // record date's weights
    weightsByAsset.forEach(
      (assetWeights, assetIndex) =>
        (assetWeights[dateIndex] = currentWeights[assetIndex])
    );
  }

  return [returns, weightsByAsset];
}
