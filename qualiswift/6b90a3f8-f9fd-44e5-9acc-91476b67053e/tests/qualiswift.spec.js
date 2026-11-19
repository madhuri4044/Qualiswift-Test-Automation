const { test, expect } = require('@playwright/test');

// Page Object for SauceDemo Login Page
class LoginPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.usernameField = page.getByTestId('username');
    this.passwordField = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
    this.errorMessage = page.getByTestId('error');
    this.productsTitle = page.getByTestId('title').filter({ hasText: 'Products' });
  }

  async goto() {
    await this.page.goto('/');
  }

  async enterUsername(username) {
    await this.usernameField.fill(username);
  }

  async enterPassword(password) {
    await this.passwordField.fill(password);
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async clearCredentials() {
    await this.usernameField.fill('');
    await this.passwordField.fill('');
  }

  async isOnLoginPage() {
    // Confirm login button visible
    return await this.loginButton.isVisible();
  }

  async isErrorMessageVisible() {
    return await this.errorMessage.isVisible();
  }

  async isOnProductsPage() {
    // The 'Products' title is unique on products page
    try {
      return await this.productsTitle.isVisible();
    } catch {
      return false;
    }
  }

  async getPasswordFieldType() {
    return await this.passwordField.getAttribute('type');
  }
}

// 1. Login with valid username and password
test('1. Login with valid username and password', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.enterUsername('standard_user');
  await loginPage.enterPassword('secret_sauce');
  await loginPage.clickLogin();
  await expect(loginPage.productsTitle).toBeVisible();
  expect(await loginPage.isOnProductsPage()).toBe(true);
});

// 2. Login with invalid username
test('2. Login with invalid username', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.enterUsername('invalid_user');
  await loginPage.enterPassword('secret_sauce');
  await loginPage.clickLogin();
  expect(await loginPage.isOnLoginPage()).toBe(true);
  expect(await loginPage.isErrorMessageVisible()).toBe(true);
});

// 3. Login with invalid password
test('3. Login with invalid password', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.enterUsername('standard_user');
  await loginPage.enterPassword('invalid_password');
  await loginPage.clickLogin();
  expect(await loginPage.isOnLoginPage()).toBe(true);
  expect(await loginPage.isErrorMessageVisible()).toBe(true);
});

// 4. Login with empty username and password fields
test('4. Login with empty username and password fields', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.clearCredentials();
  await loginPage.clickLogin();
  expect(await loginPage.isOnLoginPage()).toBe(true);
  expect(await loginPage.isErrorMessageVisible()).toBe(true);
});

// 5. Login with empty username only
test('5. Login with empty username only', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.enterUsername('');
  await loginPage.enterPassword('secret_sauce');
  await loginPage.clickLogin();
  expect(await loginPage.isOnLoginPage()).toBe(true);
  expect(await loginPage.isErrorMessageVisible()).toBe(true);
});

// 6. Login with empty password only
test('6. Login with empty password only', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.enterUsername('standard_user');
  await loginPage.enterPassword('');
  await loginPage.clickLogin();
  expect(await loginPage.isOnLoginPage()).toBe(true);
  expect(await loginPage.isErrorMessageVisible()).toBe(true);
});

// 7. Login with locked-out user credentials
test('7. Login with locked-out user credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.enterUsername('locked_out_user');
  await loginPage.enterPassword('secret_sauce');
  await loginPage.clickLogin();
  expect(await loginPage.isOnLoginPage()).toBe(true);
  expect(await loginPage.isErrorMessageVisible()).toBe(true);
});

// 8. Verify password field masks input characters
test('8. Verify password field masks input characters', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.enterPassword('anytext');
  const typeAttr = await loginPage.getPasswordFieldType();
  expect(typeAttr).toBe('password');
});

// 9. Login with problem user credentials
test('9. Login with problem user credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.enterUsername('problem_user');
  await loginPage.enterPassword('secret_sauce');
  await loginPage.clickLogin();
  expect(await loginPage.isOnProductsPage()).toBe(true);
});

// 10. Login with performance glitch user credentials
test('10. Login with performance glitch user credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.enterUsername('performance_glitch_user');
  await loginPage.enterPassword('secret_sauce');
  await loginPage.clickLogin();
  // Wait longer for delayed page load
  await page.waitForSelector('[data-test=title]', { state: 'visible', timeout: 10000 });
  expect(await loginPage.isOnProductsPage()).toBe(true);
});
