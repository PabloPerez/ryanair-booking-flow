import {$, $$, browser, ElementFinder, ExpectedConditions as until} from 'protractor';
import {utilsActions} from '../utils';

export const homeSelectors = {
  oneWayRadioButton: () => $('#flight-search-type-option-one-way'),
  fromInput: () => $('.col-departure-airport input:not(.hidden)'),
  toInput: () => $('.col-destination-airport input:not(.hidden)'),
  airportListDeparture: () => $('.col-departure-airport core-linked-list'),
  airportListDestination: () => $('.col-destination-airport core-linked-list'),
  firstAirport: () => $('div.right div[bindonce]'),
  outboundCalendar: () => $('core-datepicker.start-date'),
  inboundCalendar: () => $('core-datepicker.end-date'),
  calendarDate: (date: string) => $('li[data-id="' + date + '"]:not(.unavailable)'),
  calendarNextMonth: () => $('div:not(.last-month)>button.right'),
  passengerDropdownButton: () => $('div[passenger-input] div.dropdown-handle'),
  passengerDropdown: () => $('div.popup-passenger-input.opened'),
  addPassengerButton: (type: number) => $$('button.inc').get(type),
  termsOfServiceCheckBox: () => $('.terms-conditions-checkbox-span'),
  continueButton: () => $('button>span[translate="common.buttons.lets_go"]'),
  infantsOkButton: () => $('button>span[translate="foh.home.flight_search_infant_popup.ok"]'),
  paymentError: () => $('prompt.error'),
  loggedIn: () => $('div.avatar-user'),
  logoutLink: () => $('a[ng-click="logout()"]'),
  cookieClose: () => $('div.cookie-popup core-icon')
};

export const homeActions = {
  selectOneWay,
  fillDeparture,
  fillDestination,
  acceptAndContinue,
  selectDates,
  fillPassengerNumber,
  closeFlyingWithInfants,
  logoutIfLogged,
  closeCookies,
};

async function logoutIfLogged() {
  if (await homeSelectors.loggedIn().isPresent()) {
    await homeSelectors.loggedIn().click();
    await homeSelectors.logoutLink().click();
    await browser.wait(until.not(until.presenceOf(homeSelectors.loggedIn())));
  }
}

async function fillDeparture(airport: string) {
  await homeSelectors.fromInput().clear();
  await utilsActions.sendKeyToInput(homeSelectors.fromInput(), airport);
  await utilsActions.scrollAndClickOn(homeSelectors.firstAirport());
  // we wait for the airport list to disappear before continuing
  await browser.wait(until.not(until.presenceOf(homeSelectors.airportListDeparture())));
}

async function fillDestination(airport: string) {
  await homeSelectors.toInput().clear();
  await utilsActions.sendKeyToInput(homeSelectors.toInput(), airport);
  await utilsActions.scrollAndClickOn(homeSelectors.firstAirport());
  // we wait for the airport list to disappear before continuing
  await browser.wait(until.not(until.presenceOf(homeSelectors.airportListDestination())));
}

async function selectDates(dates: string[]) {
  for (let i = 0; i < dates.length; i++) {
    let found: boolean = false;
    while (!found) {
      found = await homeSelectors.calendarDate(dates[i]).isPresent();
      if (found) {
        await homeSelectors.calendarDate(dates[i]).click();
        const calendar: ElementFinder = i ? await homeSelectors.inboundCalendar() : await homeSelectors.outboundCalendar();
        await browser.wait(until.invisibilityOf(calendar));
      } else {
        const lastMonth: boolean = !await homeSelectors.calendarNextMonth().isPresent();
        if (lastMonth) {
          console.log('Date ' + dates[i] + ' could not be selected');
          break;
        }
        await homeSelectors.calendarNextMonth().click();
      }
    }
  }
}

async function fillPassengerNumber(adtNum, teenNum, chdNum, infNum) {
  await homeSelectors.passengerDropdownButton().click();
  await browser.wait(until.presenceOf(homeSelectors.passengerDropdown()));
  const passengerArray: number[] = [adtNum, teenNum, chdNum, infNum];
  for (let i = 0; i < passengerArray.length; i++) {
    // There's already one adult by default
    let value = i ? passengerArray[i] : passengerArray[i] - 1;
    for (let j = 0; j < value; j++) {
      await homeSelectors.addPassengerButton(i).click();
    }
  }
  if (infNum > 0) {
    await homeActions.closeFlyingWithInfants();
  }
  //close dropdown so it doesn't overlap with agree terms checkbox
  await homeSelectors.passengerDropdownButton().click();
  await browser.wait(until.not(until.presenceOf(homeSelectors.passengerDropdown())));
}

async function selectOneWay() {
  homeSelectors.oneWayRadioButton().click();
}

async function acceptAndContinue() {
  homeSelectors.termsOfServiceCheckBox().click();
  homeSelectors.continueButton().click();
}

async function closeFlyingWithInfants() {
  homeSelectors.infantsOkButton().click();
  await browser.wait(until.not(until.presenceOf(homeSelectors.infantsOkButton())));
}

async function closeCookies() {
  await browser.wait(until.presenceOf(homeSelectors.cookieClose()));
  if (await homeSelectors.cookieClose().isDisplayed()) {
    await homeSelectors.cookieClose().click();
    await browser.wait(until.not(until.visibilityOf(homeSelectors.cookieClose())));
  }
}