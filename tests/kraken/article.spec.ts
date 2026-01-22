import { test, expect } from "@playwright/test";
import { USER_A } from "../../config/config";
import { SigninPage } from "../../pages/signinPage";
import { ArticleEditorPage } from "../../pages/artcleEditorPage";
import { SignupPage } from "../../pages/signupPage";
const rand = Math.floor(Math.random() * 10000);

test.describe("Write Article", () => {
  test.describe.configure({ mode: "serial" });
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await signupPage.signup(
      `${USER_A.username}${rand}`,
      `${USER_A.email}${rand}`,
      USER_A.password,
    );
    await context.close();
  });
  test.beforeEach(async ({ page }) => {
    const signinPage = new SigninPage(page);
    await signinPage.goto();
    await signinPage.signin(`${USER_A.email}${rand}`, USER_A.password);
  });

  test("Logged-in user creates an article", async ({ page }) => {
    const articleEditorPage = new ArticleEditorPage(page);

    await articleEditorPage.createArticle(
      `Test title${rand}`,
      "description",
      "test body",
      ["testTag"],
    );

    await page.getByRole("link", { name: "Home" }).click();
    await expect(page.locator("app-articles-feed")).toContainText(
      `Test title${rand}`,
    );
    await expect(page.locator("app-articles-feed")).toContainText(
      "description",
    );
    await expect(page.locator("app-articles-feed")).toContainText("testTag");
    await page
      .getByRole("link", {
        name: `User profile image ${USER_A.username}${rand}`,
      })
      .click();
    await expect(
      page.getByRole("link", { name: `Test title${rand} description Read` }),
    ).toBeVisible();
    await expect(page.locator("h1").first()).toContainText(`Test title${rand}`);
  });

  test("Edit article", async ({ page }) => {
    const articleEditorPage = new ArticleEditorPage(page);

    await page.locator('a[href="#/my-profile"]').click();
    await page
      .locator("h1")
      .filter({ hasText: `Test title${rand}` })
      .click();
    await page.getByRole("button", { name: "Edit Article" }).first().click();
    await articleEditorPage.editArticle(
      `Edited title${rand}`,
      "edited description",
      "edited test body",
      ["editedTag"],
    );

    await page.getByRole("link", { name: "Home" }).click();
    await page.waitForLoadState("networkidle");
    await expect(page.locator("app-articles-feed")).toContainText(
      `Edited title${rand}`,
    );
    await expect(page.locator("app-articles-feed")).toContainText(
      "edited description",
    );
    await expect(page.locator("app-articles-feed")).toContainText("editedTag");
    await page
      .getByRole("link", {
        name: `User profile image ${USER_A.username}${rand}`,
      })
      .click();
    await expect(
      page.getByRole("link", {
        name: `Edited title${rand} edited description Read`,
      }),
    ).toBeVisible();
    await expect(page.locator("h1").first()).toContainText(
      `Edited title${rand}`,
    );
  });

  test("Add comment to article", async ({ page }) => {
    await page.locator('a[href="#/my-profile"]').click();
    await page
      .locator("h1")
      .filter({ hasText: `Edited title${rand}` })
      .click();

    const commentText = `This is a test comment ${rand}`;
    await page
      .getByRole("textbox", { name: "Write a comment..." })
      .fill(commentText);
    await page.getByRole("button", { name: "Post Comment" }).click();

    await expect(page.locator(".card-text")).toContainText(commentText);
  });

  test("Delete comment from article", async ({ page }) => {
    await page.locator('a[href="#/my-profile"]').click();
    await page
      .locator("h1")
      .filter({ hasText: `Edited title${rand}` })
      .click();

    const commentText = `This is a test comment ${rand}`;
    await expect(page.locator(".card-text")).toContainText(commentText);

    await page
      .locator(".card")
      .filter({ hasText: commentText })
      .locator(".ion-trash-a")
      .click();

    await expect(page.locator(".card-text")).toHaveCount(0);
  });

  test("Delete article", async ({ page }) => {
    await page.locator('a[href="#/my-profile"]').click();
    await page
      .locator("h1")
      .filter({ hasText: `Edited title${rand}` })
      .click();
    await page.getByRole("button", { name: "Delete Article" }).first().click();

    await page.getByRole("link", { name: "Home" }).click();
    await expect(page.locator("app-articles-feed")).not.toContainText(
      `Edited title${rand}`,
    );
    await page
      .getByRole("link", {
        name: `User profile image ${USER_A.username}${rand}`,
      })
      .click();
    await expect(
      page.getByRole("link", {
        name: `Edited title${rand} edited description Read`,
      }),
    ).not.toBeVisible();
  });
});
