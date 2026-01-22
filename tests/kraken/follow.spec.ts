import {test, expect} from "@playwright/test";
import { USER_A, USER_B} from "../../config/config";
import {SignupPage} from "../../pages/signupPage";
import {SigninPage} from "../../pages/signinPage";    
import { UserProfilePage } from "../../pages/userProfilePage";
const rand = Math.floor(Math.random() * 10000);

test("Follow Feed", async ({ page }) => {
  const signinPage = new SigninPage(page);

  await test.step("Sign up User A and User B", async () => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await signupPage.signup(
      `${USER_A.username}${rand}`,
      `${USER_A.email}${rand}`,
      USER_A.password,
    );
    console.log(
      `User A signed up with username: ${USER_A.username}${rand} and email: ${USER_A.email}${rand}`,
    );
    await signupPage.goto();
    await signupPage.signup(
      `${USER_B.username}${rand}`,
      `${USER_B.email}${rand}`,
      USER_B.password,
    );
    console.log(
      `User B signed up with username: ${USER_B.username}${rand} and email: ${USER_B.email}${rand}`,
    );
  });

  await test.step("User A follows User B", async () => {
    await signinPage.goto();
    await signinPage.signin(`${USER_A.email}${rand}`, USER_A.password);

    const userProfilePage = new UserProfilePage(page);
    await userProfilePage.goto(`${USER_B.username}${rand}`);
    await userProfilePage.followUser();
    console.log(`User A followed User B`);
    await signinPage.signout();
  });

  await test.step("User B publishes a new article", async () => {
    await signinPage.goto();
    await signinPage.signin(`${USER_B.email}${rand}`, USER_B.password);
    await page.getByText("New Article").click();
    await page
      .getByRole("textbox", { name: "Article Title" })
      .fill(`Test title${rand}`);
    await page
      .getByRole("textbox", { name: "What's this article about?" })
      .fill("description");
    await page
      .getByRole("textbox", { name: "Write your article (in" })
      .fill("test body");
    await page.getByRole("textbox", { name: "Enter tags" }).fill("testTag");
    await page.getByRole("textbox", { name: "Enter tags" }).press("Enter");
    await expect(
      page.getByRole("button", { name: "Publish Article" }),
    ).toBeEnabled();
    await page.getByRole("button", { name: "Publish Article" }).click();
    await expect(page.locator(".success-messages")).toContainText(
      "Published successfully!",
    );
    console.log(`User B published a new article titled: Test title${rand}`);
    await signinPage.signout();
  });
  await test.step("User A sees the new article in their feed", async () => {
    await signinPage.goto();
    await signinPage.signin(`${USER_A.email}${rand}`, USER_A.password);
    await page.locator(".nav-link").filter({ hasText: "My Feed" }).click();
    await expect(page.locator("app-articles-feed")).toContainText(
      `Test title${rand}`,
    );
  });
});
