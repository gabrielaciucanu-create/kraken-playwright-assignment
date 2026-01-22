import { type Locator, type Page } from "@playwright/test";
import { BASE_URL } from "../config/config";

export class SigninPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signinButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByRole("textbox", { name: "Email" });
    this.passwordInput = page.getByRole("textbox", { name: "Password" });
    this.signinButton = page.getByRole("button", { name: "Sign in" });
  }

  async goto() {
    await this.page.goto(`${BASE_URL}/#/login`);
  } 
  async signin(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signinButton.click();
  }

  async signout() {
    await this.page.locator('a[href="#/settings"]').click();
    await this.page.getByRole("button", { name: "Or click here to logout." }).click();
  }
}
