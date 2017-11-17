import {homeActions} from './page-objects/Homepage';

import {defineSupportCode} from 'cucumber';
import {browser} from 'protractor';
import {flightSelectionActions} from './page-objects/flight-selection';
import {FARES, SEATS} from './utils';
import {additionalServicesActions} from './page-objects/additional-services';
import {seatSelectionActions} from './page-objects/seat-selection';
import {passengerPaymentDetailsActions, passengerPaymentDetailsChecks} from './page-objects/passenger-payment-details';

defineSupportCode(({Given, When, Then}) => {

  Given('I make a booking from {string} to {string} on {customDate} ' +
    'for {int} adults {int} teens {int} children {int} infants', givenBooking);
  async function givenBooking(from: string, to: string, dates, adtNum, teenNum, chdNum, infNum): Promise<void> {
    //protractor will wait for angular scripts to finish
    await browser.waitForAngularEnabled(true);

    //HOMEPAGE
    await performHomePageActions(from, to, dates, adtNum, teenNum, chdNum, infNum);

    //FLIGHT SELECTION
    //In this demo we just select first option and basic fare
    const flightIndexes = Array(dates.length).fill('0');
    const flightFares = Array(dates.length).fill(FARES.STANDARD);
    await performFlightSelection(flightIndexes, flightFares);

    //ADDITIONAL SERVICES SELECTION
    //Will have seat selection if fare includes them or we travel with children
    await performAdditionalServices(flightFares, adtNum, teenNum, chdNum, infNum);
    //disable to not wait 1minute due to angular chat script
    await browser.waitForAngularEnabled(false);

    //PASSENGER AND PAYMENT
    await performPassengerPayment(adtNum, teenNum, chdNum, infNum);
  }

  When('I pay for booking with card details {string}, {string} and {string}', payBooking);
  async function payBooking(cardNum: string, expDate: string, cvv: string) {
    await passengerPaymentDetailsActions.fillPaymentDetails(cardNum, expDate, cvv);
    await passengerPaymentDetailsActions.fillBillingAddress();
    await passengerPaymentDetailsActions.acceptAndContinue();
  }

  Then('I should get payment declined message', checkPaymentDeclined);
  async function checkPaymentDeclined() {
    await passengerPaymentDetailsChecks.checkPaymentDeclined();
  }

  async function performHomePageActions(from: string, to: string, dates, adtNum, teenNum, chdNum, infNum){
    await browser.get('https://www.ryanair.com/ie/en/');
    await homeActions.closeCookies();
    await homeActions.logoutIfLogged();
    if (dates.length == 1) {
      await homeActions.selectOneWay();
    }
    await homeActions.fillDeparture(from);
    await homeActions.fillDestination(to);
    await homeActions.selectDates(dates);
    await homeActions.fillPassengerNumber(adtNum, teenNum, chdNum, infNum);
    await homeActions.acceptAndContinue();
  }

  async function performFlightSelection(indexes:number[], fares:string[]){
    await flightSelectionActions.selectFlights(indexes, fares);
    await flightSelectionActions.clickContinue();
    await flightSelectionActions.closeSignInIfDisplayed();
  }

  async function performAdditionalServices(flightFares:string[], adtNum:number, teenNum:number, chdNum:number, infNum:number) {
    //Will have seat selection if fare includes them or we travel with children
    if (!flightFares.every(fare => fare == FARES.STANDARD) || chdNum > 0) {
      const paxNum: number = adtNum + teenNum + chdNum; //infants dont have separate seats
      const seatTypes: string[] = Array(paxNum).fill(SEATS.ONSALE);
      await seatSelectionActions.selectSeats(seatTypes, chdNum > 0, infNum, flightFares.length);
      await additionalServicesActions.closePriorityBoardingIfDisplayed();
      await additionalServicesActions.clickCheckout();
    } else {
      await additionalServicesActions.clickCheckout();
      await additionalServicesActions.closeSeatReminder();
    }
  }

  async function performPassengerPayment(adtNum:number, teenNum:number, chdNum:number, infNum:number) {
    await passengerPaymentDetailsActions.login();
    await passengerPaymentDetailsActions.fillPassengerData(adtNum, teenNum, chdNum, infNum);
    await passengerPaymentDetailsActions.fillContactDetails();
  }
});
