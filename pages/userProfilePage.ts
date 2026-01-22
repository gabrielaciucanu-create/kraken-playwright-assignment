import { expect, Page } from '@playwright/test';
import { BASE_URL } from "../config/config";

export class UserProfilePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(username: string) {
    await this.page.goto(`${BASE_URL}/#/profile/${username}`);
  }

  async followUser() {
    await expect(this.page.locator(".btn-outline-secondary")).toBeVisible();
    await this.page.locator(".btn-outline-secondary").click();
    await this.page.waitForSelector('.btn-secondary');
    await expect(this.page.locator(".btn-secondary")).toBeVisible();
  }


  async unfollowUser() {
    await this.page.locator('.btn-secondary').click();
  }

  async isFollowing(): Promise<boolean> {
    const buttonText = await this.page.locator('.btn-outline-secondary, .btn-secondary').innerText();
    return buttonText.includes('Unfollow');
  }
}