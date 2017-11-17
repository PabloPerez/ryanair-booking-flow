import {$, browser, by, element, ElementFinder, ExpectedConditions as until} from 'protractor';
import {utilsActions} from '../utils';


export const seatSelectionSelectors = {
  seatPanel: () => $('.seat-map-header'),
  seatScrollablePanel: () => $('#scrollable'),
  seat: (type: string) => $('.seat-row-seat.' + type + ':not(.selected):not(.reserved)'),
  infantSeat: (type: string) => element(by.xpath("//span[contains(@class, 'seat-row-seat')][contains(@class,'" + type +
    "')][not(contains(@class, 'selected'))][not(contains(@class, 'reserved'))][.//img[contains(@bo-if, 'infant')]]")),
  nextButton: () => $('button.dialog-overlay-footer__ok-button'),
  mandatorySeatsPromptButton: () => $('.mandatory-seats-prompt button'),
  confirmSeats: () => $('div.confirm-seats-title'),
  buttonSameSeats: () => $('button.same-seats'),
  sameSeatsDialog: () => $('div.same-seats-prompt')
};

export const seatSelectionActions = {
  selectSeats,
  acceptMandatorySeats,
};

async function acceptMandatorySeats() {
  await browser.wait(until.presenceOf(seatSelectionSelectors.mandatorySeatsPromptButton()));
  await seatSelectionSelectors.mandatorySeatsPromptButton().click();
  await browser.wait(until.not(until.presenceOf(seatSelectionSelectors.mandatorySeatsPromptButton())));
}

async function selectSeats(types: string[], hasChild: boolean = false, infantNumber: number = 0, boundNumber: number = 1) {
  if (hasChild) {
    await seatSelectionActions.acceptMandatorySeats();
  }
  for (let i: number = 0; i < boundNumber; i++) {
    //fixed sleep as same seats dialog takes time to display and we cannot be sure if it will be displayed or not
    await browser.sleep(3000);
    const seatScrollablePanel: ElementFinder = seatSelectionSelectors.seatScrollablePanel();
    await browser.wait(until.presenceOf(seatSelectionSelectors.seatPanel()));
    if (await seatSelectionSelectors.sameSeatsDialog().isPresent()) {
      const sameSeatsButton: ElementFinder = await seatSelectionSelectors.buttonSameSeats();
      await sameSeatsButton.click();
      await browser.wait(until.not(until.visibilityOf(sameSeatsButton)));
    } else {
      // to enable infinitescroll, sometimes not every seat category is displayed
      await utilsActions.scrollFixedAmount(seatScrollablePanel, 600);
      for (let i = 0; i < types.length; i++) {
        //adults with infants have specific seats available
        const seat: ElementFinder = i < infantNumber ? seatSelectionSelectors.infantSeat(types[i]) :
          seatSelectionSelectors.seat(types[i]);
        await utilsActions.scrollParentUntilElementVisible(seatScrollablePanel, seat);
        await browser.wait(until.visibilityOf(seat));
        await seat.click();
      }
      await seatSelectionSelectors.nextButton().click();
    }
  }
  await browser.wait(until.visibilityOf(seatSelectionSelectors.confirmSeats()));
  await seatSelectionSelectors.nextButton().click();
}


