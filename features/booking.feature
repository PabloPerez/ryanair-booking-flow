Feature: Booking
  As a user
  I want to make bookings with different passenger and airport configuration and wrong card details
  So that I check booking is correctly done until payment and I receive payment error

  Scenario: Given example
    Given I make a booking from "DUB" to "SXF" on 12/03/2018 for 2 adults 0 teens 1 children 0 infants
    When I pay for booking with card details "5555 5555 5555 5557", "10/18" and "265"
    Then I should get payment declined message

  Scenario: Different citypair, fixed dates, round trip
    Given I make a booking from "MAD" to "DUB" on 15/03/2018-20/03/2018 for 2 adults 0 teens 0 children 0 infants
    When I pay for booking with card details "5555 5555 5555 5557", "10/18" and "265"
    Then I should get payment declined message

  Scenario: Relative dates, round trip, all passenger types
    Given I make a booking from "DUB" to "SXF" on +22-+39 for 2 adults 1 teens 1 children 1 infants
    When I pay for booking with card details "5555 5555 5555 4444", "10/18" and "265"
    Then I should get payment declined message
