/* eslint-disable no-unused-vars */
const fs = require('fs');
const estimator = require('./estimator');

exports.estimateJson = (req, res, next) => {
  const { data } = req.body;
  const resData = estimator.covid19ImpactEstimator(data);
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(resData);
};

exports.getLog = (req, res, next) => {
  fs.readFile('./logs/requests.log', 'utf8', (err, data) => {
    if (err) throw err;
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(data);
  });
};

exports.estimateXML = (req, res, next) => {
  const { data } = req.body;
  const resData = estimator.covid19ImpactEstimator(data);
  const { impact, severeImpact } = resData;
  const xmlRes = `<root>
  <impact>
  <currentlyInfected>${impact.currentlyInfected}</currentlyInfected>
  <infectionsByRequestedTime>${impact.infectionsByRequestedTime}</infectionsByRequestedTime>
  <severeCasesByRequestedTime>${impact.severeCasesByRequestedTime}</severeCasesByRequestedTime>
  <hospitalBedsByRequestedTime>${impact.hospitalBedsByRequestedTime}</hospitalBedsByRequestedTime>
  <casesForICUByRequestedTime>${impact.casesForICUByRequestedTime}</casesForICUByRequestedTime>
  <casesForVentilatorsByRequestedTime>${impact.casesForVentilatorsByRequestedTime}</casesForVentilatorsByRequestedTime>  
  <dollarsInFlight>${impact.dollarsInFlight}</dollarsInFlight>  
  </impact>
  <severeImpact>
  <currentlyInfected>${severeImpact.currentlyInfected}</currentlyInfected>
  <infectionsByRequestedTime>${severeImpact.infectionsByRequestedTime}</infectionsByRequestedTime>
  <severeCasesByRequestedTime>${severeImpact.severeCasesByRequestedTime}</severeCasesByRequestedTime>
  <hospitalBedsByRequestedTime>${severeImpact.hospitalBedsByRequestedTime}</hospitalBedsByRequestedTime>
  <casesForICUByRequestedTime>${severeImpact.casesForICUByRequestedTime}</casesForICUByRequestedTime>
  <casesForVentilatorsByRequestedTime>${severeImpact.casesForVentilatorsByRequestedTime}</casesForVentilatorsByRequestedTime>  
  <dollarsInFlight>${severeImpact.dollarsInFlight}</dollarsInFlight>
  </severeImpact>
  </root>`;
  res.setHeader('Content-Type', 'application/xml');
  res.status(200).send(xmlRes);
};
