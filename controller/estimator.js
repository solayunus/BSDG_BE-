const toWholeNumber = (number) => parseFloat(number.toString().split('.')[0]);

const covid19ImpactEstimator = (data) => {
  const currentlyInfected = data.reportedCases * 10;
  const sCurrentlyInfected = data.reportedCases * 50;
  const totalBed = data.totalHospitalBeds;
  const avgIncome = data.region.avgDailyIncomeInUSD;
  const avgIncPop = data.region.avgDailyIncomePopulation;

  let daysValue = data.timeToElapse;
  let dollarsInFlight;
  let sDollarsInFlight;
  if (data.periodType === 'weeks') {
    daysValue *= 7;
  }
  if (data.periodType === 'months') {
    daysValue *= 30;
  }

  const infectionsByRequestedTime = currentlyInfected * (2 ** parseInt(daysValue / 3, 10));
  const sInfectionsByRequestedTime = sCurrentlyInfected * (2 ** parseInt(daysValue / 3, 10));

  const severeCasesByRequestedTime = Math.trunc(0.15 * infectionsByRequestedTime);

  const sSevereCasesByRequestedTime = Math.trunc(
    0.15 * sInfectionsByRequestedTime
  );

  // const hospitalBedsByRequestedTime = Math.trunc(0.35 * totalBed) - severeCasesByRequestedTime;
  let hospitalBedsByRequestedTime = parseFloat(0.35 * parseFloat(totalBed))
  - parseFloat(0.15 * parseFloat(infectionsByRequestedTime));
  hospitalBedsByRequestedTime = toWholeNumber(hospitalBedsByRequestedTime);


  let sBedsByRequestedTime = parseFloat(0.35 * parseFloat(totalBed))
  - parseFloat(0.15 * parseFloat(sInfectionsByRequestedTime));
  sBedsByRequestedTime = toWholeNumber(sBedsByRequestedTime);


  const casesForICUByRequestedTime = Math.trunc(0.05 * infectionsByRequestedTime);
  const sCasesForICUByRequestedTime = Math.trunc(
    0.05 * sInfectionsByRequestedTime
  );

  const casesForVentilatorsByRequestedTime = Math.trunc(
    0.02 * infectionsByRequestedTime
  );

  const sCasesForVentilatorsByRequestedTime = Math.trunc(
    0.02 * sInfectionsByRequestedTime
  );

  dollarsInFlight = (infectionsByRequestedTime * avgIncPop * avgIncome) / daysValue;
  // dollarsInFlight_ = parseFloat(dollarsInFlight.toFixed(2));
  dollarsInFlight = Math.trunc(dollarsInFlight);

  sDollarsInFlight = (sInfectionsByRequestedTime * avgIncPop * avgIncome) / daysValue;
  // sDollarsInFlight = parseFloat(sDollarsInFlight.toFixed(2));;
  sDollarsInFlight = Math.trunc(sDollarsInFlight);

  return {
    // data: { ...data },

    impact: {
      currentlyInfected,
      infectionsByRequestedTime,
      severeCasesByRequestedTime,
      hospitalBedsByRequestedTime,
      casesForICUByRequestedTime,
      casesForVentilatorsByRequestedTime,
      dollarsInFlight
    }, // your best case estimation
    severeImpact: {
      currentlyInfected: sCurrentlyInfected,
      infectionsByRequestedTime: sInfectionsByRequestedTime,
      severeCasesByRequestedTime: sSevereCasesByRequestedTime,
      hospitalBedsByRequestedTime: sBedsByRequestedTime,
      casesForICUByRequestedTime: sCasesForICUByRequestedTime,
      casesForVentilatorsByRequestedTime: sCasesForVentilatorsByRequestedTime,
      dollarsInFlight: sDollarsInFlight
    } // your severe case estimation


  };
};
//export default covid19ImpactEstimator;
