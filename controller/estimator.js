exports.covid19ImpactEstimator = (data) => {
  const currentlyInfected = data.reportedCases * 10;
  const svrCurrentlyInfected = data.reportedCases * 50;
  const totalBed = data.totalHospitalBeds;
  const avgIncome = data.region.avgDailyIncomeInUSD;
  const avgIncPop = data.region.avgDailyIncomePopulation;

  let numDays = data.timeToElapse;
  let dollarsInFlight;
  let svrDollarsInFlight;
  if (data.periodType === 'weeks') {
    numDays *= 7;
  }
  if (data.periodType === 'months') {
    numDays *= 30;
  }

  const infectionsByRequestedTime = currentlyInfected * (2 ** parseInt(numDays / 3, 10));
  const svrInfectionsByRequestedTime = svrCurrentlyInfected * (2 ** parseInt(numDays / 3, 10));

  const severeCasesByRequestedTime = Math.trunc(0.15 * infectionsByRequestedTime);

  const svrSevereCasesByRequestedTime = Math.trunc(
    0.15 * svrInfectionsByRequestedTime,
  );

  const hospitalBedsByRequestedTime = Math.trunc(0.35 * totalBed) - severeCasesByRequestedTime + 1;


  const svrBedsByRequestedTime = Math.trunc(0.35 * totalBed) - svrSevereCasesByRequestedTime + 1;


  const casesForICUByRequestedTime = Math.trunc(0.05 * infectionsByRequestedTime);
  const svrCasesForICUByRequestedTime = Math.trunc(
    0.05 * svrInfectionsByRequestedTime,
  );

  const casesForVentilatorsByRequestedTime = Math.trunc(
    0.02 * infectionsByRequestedTime,
  );

  const svrCasesForVentilatorsByRequestedTime = Math.trunc(
    0.02 * svrInfectionsByRequestedTime,
  );

  dollarsInFlight = (infectionsByRequestedTime * avgIncPop * avgIncome) / numDays;
  // dollarsInFlight = parseFloat(dollarsInFlight.toFixed(2));
  dollarsInFlight = Math.trunc(dollarsInFlight);

  svrDollarsInFlight = (svrInfectionsByRequestedTime * avgIncPop * avgIncome) / numDays;
  // svrDollarsInFlight = parseFloat(svrDollarsInFlight.toFixed(2));;
  svrDollarsInFlight = Math.trunc(svrDollarsInFlight);

  return {
    // data: { ...data },

    impact: {
      currentlyInfected,
      infectionsByRequestedTime,
      severeCasesByRequestedTime,
      hospitalBedsByRequestedTime,
      casesForICUByRequestedTime,
      casesForVentilatorsByRequestedTime,
      dollarsInFlight,
    }, // your best case estimation
    severeImpact: {
      currentlyInfected: svrCurrentlyInfected,
      infectionsByRequestedTime: svrInfectionsByRequestedTime,
      severeCasesByRequestedTime: svrSevereCasesByRequestedTime,
      hospitalBedsByRequestedTime: svrBedsByRequestedTime,
      casesForICUByRequestedTime: svrCasesForICUByRequestedTime,
      casesForVentilatorsByRequestedTime: svrCasesForVentilatorsByRequestedTime,
      dollarsInFlight: svrDollarsInFlight,
    }, // your severe case estimation


  };
};
// export default covid19ImpactEstimator;
