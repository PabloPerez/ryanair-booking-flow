import {browser, ElementFinder} from 'protractor';
import {defineSupportCode} from 'cucumber';
import * as moment from 'moment';

export const FARES = {
  'STANDARD': 'standard',
  'PLUS': 'leisure-plus',
  'FLEXIPLUS': 'business-plus'
};

export const SEATS = {
  'ONSALE': 'onsale',
  'STANDARD': 'standard',
  'PRIORITY': 'priority',
  'EXTRALEGROOM': 'extra-leg'

};

export const LOGINDATA: string = 'cnlhbmFpcmF1dG9tYXRlZGJvb2tpbmdAZ21haWwuY29tOjR1dDBtNHQzZFJZQU5BSVI=';

defineSupportCode(({setDefaultTimeout}) => {
  setDefaultTimeout(1200 * 1000);
});


defineSupportCode(({defineParameterType}) => {
  defineParameterType({
    // Different options
    // - Relative date, one way: +34 (departure in 34 days)
    // - Relative date, roundtrip: +30-+60 (departure in 30 days, arrival in 60)
    // - Absolute date, one way: 30/01/2018
    // - Absolute date, roundtrip: 30/01/2018-10/02/2018
    regexp: /\+\d+|\+\d+-\+\d+|\d{2}\/\d{2}\/\d{4}|\d{2}\/\d{2}\/\d{4}-\d{2}\/\d{2}\/\d{4}/,
    transformer: s => utilsActions.convertToDateArray(s),
    typeName: 'customDate'
  })
});

export const utilsActions = {
  scrollTo,
  scrollFixedAmount,
  scrollParentUntilElementVisible,
  scrollAndClickOn,
  sendKeyToInput,
  convertToDateArray,
  getInfantBirthDate,
};

async function scrollTo(el: ElementFinder) {
  const element = await el.getWebElement();
  await browser.executeScript('arguments[0].scrollIntoView()', element);
}

async function scrollFixedAmount(el: ElementFinder, px: number) {
  const element = await el.getWebElement();
  await browser.executeScript('arguments[0].scrollTop =' + px, element);
}

async function scrollParentUntilElementVisible(par: ElementFinder, el: ElementFinder) {
  const parent = await par.getWebElement();
  const element = await el.getWebElement();
  //We scroll the parent element so the element is no longer hidden in the scrollable part of the screen
  await browser.executeScript('arguments[0].scrollTop = arguments[1].offsetTop - arguments[0].offsetTop', parent, element);
}

async function scrollAndClickOn(element: ElementFinder) {
  await scrollTo(element);
  await element.click();
}

async function sendKeyToInput(element: ElementFinder, ...inputs) {
  await scrollTo(element);
  await element.sendKeys(...inputs);
}

function convertToDateArray(dateStr: string): string[] {
  const dates: string[] = dateStr.split('-');
  dates.forEach(function (value, index) {
    //relative dates
    if (value.indexOf('+') > -1) {
      dates[index] = moment().add(parseInt(value), 'days').format('DD-MM-YYYY');
    }
    else {
      dates[index] = moment(value, 'DD/MM/YYYY').format('DD-MM-YYYY');
    }
  });
  return dates;
}

function getInfantBirthDate(): string[] {
  return moment().subtract(1, 'year').format('D-MMM-YYYY').split(/-/g);
}