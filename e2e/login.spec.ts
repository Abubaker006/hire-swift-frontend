import { test } from "@playwright/test";

test.describe("Login Tests", () => {
  test("Should log in successfully with correct credentials", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/login");

    await page.fill('input[name="email"]', "mohammadabubakerpk@gmail.com");
    await page.fill('input[name="password"]', "Pakistan@123");

    await page.click('button[type="submit"]');

    await page.waitForURL("http://localhost:3000/dashboard");
  });

  test("Should show an error for invalid credentials", async ({ page }) => {
    await page.goto("http://localhost:3000/login");

    await page.fill('input[name="email"]', "wrongemail@example.com");
    await page.fill('input[name="password"]', "wrongpassword");
    await page.click('button[type="submit"]');
    await page.waitForURL("http://localhost:3000/login");
  });
});
