import { test, expect } from "@playwright/test";
import { USER_A } from "../../config/config";
import { SignupPage } from "../../pages/signupPage";
import { SigninPage } from "../../pages/signinPage";    
const rand = Math.floor(Math.random() * 10000);

test.describe("Sign-up & Login", () => {
  test.describe.configure({ mode: "serial" });

  test("Register a new user", { tag: "@signup" }, async ({ page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await signupPage.signup(
      `${USER_A.username}${rand}`,
      `${USER_A.email}${rand}`,
      USER_A.password,
    );
  });

  test("Log in successfully", async ({ page }) => {
    const signinPage = new SigninPage(page);
    await signinPage.goto();
    await signinPage.signin(`${USER_A.email}${rand}`, USER_A.password);

    await expect(page.locator('a[href="#/my-profile"]')).toContainText(
      `${USER_A.username}${rand}`,
    );
  });

  test("Attempt login with a wrong password", async ({ page }) => {
    const signinPage = new SigninPage(page);
    await signinPage.goto();

    await page.getByRole("link", { name: "Sign in" }).click();
    await page.getByRole("textbox", { name: "Email" }).fill(`${USER_A.email}${rand}`);
    await page.getByRole("textbox", { name: "Password" }).fill("wrongpass");
    const [loginResponse] = await Promise.all([
      page.waitForResponse(
        (response) =>
          response.url().includes("/login") &&
          response.request().method() === "POST",
      ),
      page.getByRole("button", { name: "Sign in" }).click(),
    ]);

    //TODO: change to 401 once backend is fixed
    expect(loginResponse.status()).toBe(422);
    await expect(page.locator(".error-messages li")).toContainText(
      "Invalid email or password",
    );
  });
});
