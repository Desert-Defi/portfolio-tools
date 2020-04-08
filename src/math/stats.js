export const semivariance = (series, b) => {
  const seriesLen = series.length;

  const seriesMean = mean(series);

  let sumSquareDiff = 0.0;
  let sumDiff = 0.0;
  for (let i = 0; i < seriesLen; i++) {
    const diff = Math.min(series[i] - b, 0);
    console.log('diff', diff);
    sumSquareDiff += diff ** 2;
    sumDiff += diff;
  }

  const correctedSumSquareDiff = sumSquareDiff - sumDiff ** 2 / seriesLen;

  //return corrected variance
  return correctedSumSquareDiff / seriesLen;
};

export const sampleSemivariance = (series, b) => {
  const seriesLen = series.length;

  return (semivariance(series, b) * seriesLen) / (seriesLen - 1);
};
