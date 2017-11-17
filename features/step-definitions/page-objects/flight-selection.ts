import {$, browser, ElementFinder, ExpectedConditions as until} from 'protractor';
import {utilsActions} from '../utils';

export const flightSelectionSelectors = {
  outboundTable: () => $('#outbound'),
  inboundTable: () => $('#inbound'),
  flightOption: (boundTable: ElementFinder, index: number) => boundTable.$$('.flight-header__min-price flights-table-price').get(index),
  fare: (boundTable: ElementFinder, fare: string) => boundTable.$('.fare-select.' + fare),
  continueButton: () => $('#continue'),
  signInDialogLink: () => $('div.signup-modal div.signup-home-footer a'),
};


export const flightSelectionActions = {
  selectFlights,
  clickContinue,
  closeSignInIfDisplayed
};

async function selectFlights(indexes: number[], fares: string[]) {
  for (let i = 0; i < indexes.length; i++) {
    const table: ElementFinder = i ? flightSelectionSelectors.inboundTable() : flightSelectionSelectors.outboundTable();
    const flightOption: ElementFinder = flightSelectionSelectors.flightOption(table, indexes[i]);
    await browser.wait(until.presenceOf(flightOption));
    await flightOption.click();
    const fareOption: ElementFinder = flightSelectionSelectors.fare(table, fares[i]);
    await browser.wait(until.presenceOf(fareOption));
    await fareOption.click();
  }
}

async function clickContinue() {
  await utilsActions.scrollAndClickOn(flightSelectionSelectors.continueButton());
}

async function closeSignInIfDisplayed() {
  if (await flightSelectionSelectors.signInDialogLink().isPresent()) {
    await flightSelectionSelectors.signInDialogLink().click();
    await browser.wait(until.not(until.presenceOf(flightSelectionSelectors.signInDialogLink())));
  }
}