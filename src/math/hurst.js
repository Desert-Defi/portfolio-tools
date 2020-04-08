import math from 'mathjs';
import SS from 'simple-statistics';
const { linearRegression } = SS;
import PortfolioAnalytics from 'portfolio-analytics';

export const hurstExponent = (series) => {
  let s = series;
  let y = [];
  let u = [...s];
  let k = Array(Math.log2(s.length))
    .fill(0)
    .map((e, i) => i);
  for (const i in k) {
    y.push(PortfolioAnalytics.sampleStddev_(u));
    u = 0.5 * (u.filter((v, i) => i % 2 == 0) + u.filter((v, i) => i % 2 != 0));
  }
  let xy = [math.add(k, 1), y.map((e) => Math.log2(e))].reduce((a, b) =>
    a.map((v, i) => [v, b[i]])
  );
  const p = linearRegression(xy);
  // return p[0]; look at simple statistics
};
