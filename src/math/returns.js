// financial timeseries helpers

const calcReturns = (priceSeries) => {
  const returns = [];
  for (let i = 1; i < priceSeries.length; i++) {
    const curr = priceSeries[i];
    const prev = priceSeries[i - 1];
    let r = (curr - prev) / prev;
    if (isNaN(r) || !isFinite(r) || curr === 0) r = 0;
    returns.push(r);
  }
  return returns;
};

const calcTotalReturns = (returnsSeries) => {
  const totalReturns = [1];
  for (let i = 1; i < returnsSeries.length; i++) {
    const prev = totalReturns[i - 1];
    totalReturns[i] = prev + prev * returnsSeries[i - 1];
  }
  return totalReturns;
};

export { calcReturns, calcTotalReturns };
