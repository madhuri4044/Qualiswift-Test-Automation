# SauceDemo Playwright Test Suite

This test suite uses Playwright with JavaScript to automate login functionality tests for the SauceDemo application.

## Setup Instructions

1. Install Node.js (https://nodejs.org/)
2. Clone this repository.
3. Run `npm install` to install dependencies.
4. Configure environment variable `BASE_URL` with the base URL of the SauceDemo application, for example:
   - On macOS/Linux: `export BASE_URL=https://www.saucedemo.com`
   - On Windows CMD: `set BASE_URL=https://www.saucedemo.com`
5. Run tests using `npx playwright test`.

## Notes

- The tests use `data-test` attributes for stable selectors.
- Screenshots, videos, and traces are retained on failure.
- Tests cover login with different user credentials and validate error messages and UI behavior.
- The exact error message texts are not asserted due to missing evidence; visibility is checked instead.
