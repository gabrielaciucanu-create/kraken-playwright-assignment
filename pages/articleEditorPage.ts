import { expect, type Locator, type Page } from "@playwright/test";
import { BASE_URL } from "../config/config";

export class ArticleEditorPage {
  readonly page: Page;
  readonly titleInput: Locator;
  readonly aboutInput: Locator;
  readonly bodyInput: Locator;
  readonly tagsInput: Locator;
  readonly publishButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.titleInput = page.locator("input[formcontrolname='title']");
    this.aboutInput = page.locator("input[formcontrolname='description']");
    this.bodyInput = page.locator("textarea[formcontrolname='body']");
    this.tagsInput = page.locator("input[formcontrolname='tagInput']");
    this.publishButton = page.getByRole("button", { name: "Publish Article" });
  }

  async goto() {
    await this.page.goto(`${BASE_URL}/#/editor`);
  }

  async createArticle(title: string, about: string, body: string, tags: string[]) {
    await this.goto();
    await this.editArticle(title, about, body, tags);
  }

  async editArticle(title: string, about: string, body: string, tags: string[]) {
    console.log("Filling article form with title:", title);
    await this.titleInput.selectText();
    await this.titleInput.fill(title);
    await expect(this.titleInput).toHaveValue(title);

    await this.aboutInput.selectText;
    await this.aboutInput.fill(about);
    await expect(this.aboutInput).toHaveValue(about);

    await this.bodyInput.selectText();
    await this.bodyInput.fill(body);
    await expect(this.bodyInput).toHaveValue(body);

    await this.tagsInput.fill("");
    for (const tag of tags) {
      await this.tagsInput.fill(tag);
      await this.tagsInput.press("Enter");
    }
    await expect(
      this.page.getByRole("button", { name: "Publish Article" }),
    ).toBeEnabled();
   await this.page.getByRole("button", { name: "Publish Article" }).click();
    await expect(
      this.page.locator(".success-messages"),
    ).toContainText("Published successfully!");
    await this.page.waitForLoadState("networkidle");

  } 
} 
