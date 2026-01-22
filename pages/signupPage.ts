import { expect, type Locator, type Page } from "@playwright/test";

export class SignupPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signupButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByRole("textbox", { name: "Username" });
    this.emailInput = page.getByRole("textbox", { name: "Email" });
    this.passwordInput = page.getByRole("textbox", { name: "Password" });
    this.signupButton = page.getByRole("button", { name: "Sign up" });
  }

  async goto() {
    await this.page.goto(`/#/register`);
  }

  async signup(username: string, email: string, password: string) {
    await this.usernameInput.fill(username);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signupButton.click();
    await this.page.waitForLoadState("networkidle");
    await expect(this.page.locator("h1")).toContainText("Sign in");
    
  }
}
