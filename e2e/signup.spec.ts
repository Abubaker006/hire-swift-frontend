import { test, expect } from "@playwright/test";

test.describe("Sign-Up Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/signup", {
      waitUntil: "domcontentloaded",
    });
  });

  test("Should show validation errors when form is incomplete", async ({
    page,
  }) => {
    await page.click('button[type="submit"]');
    await expect(page.getByText("First Name is required")).toBeVisible();
    await expect(page.getByText("Last Name is required")).toBeVisible();
    await expect(page.getByText("Email is required")).toBeVisible();
  });

  test("Should signup and receive auth token", async ({ page }) => {
    const uniqueEmail = `user.tester.${Date.now()}@example.com`;

    await page.fill('input[name="firstName"]', "User");
    await page.fill('input[name="lastName"]', "Tester");
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="contactNumber"]', "1234567890");
    await page.fill('input[name="password"]', "Password123!");
    await page.fill('input[name="confirmPassword"]', "Password123!");
    await page.selectOption('select[name="role"]', "candidate");

    const submitButton = page.getByRole("button", { name: /sign up/i });
    await submitButton.click();

    await page.waitForTimeout(3000);

    const hasError = await page
      .locator("text=/Error|error occurred/i")
      .isVisible()
      .catch(() => false);
    if (hasError) {
      console.warn("Error message detected during signup attempt");
    }

    const cookies = await page.context().cookies();
    const tokenCookie = cookies.find(
      (cookie) => cookie.name === "access_token"
    );

    expect(tokenCookie).toBeDefined();
    expect(tokenCookie?.value).not.toBe("");
  });

  test("Should show error for existing user and not receive auth token", async ({
    page,
  }) => {
    const existingEmail = "john@example.com";

    await page.fill('input[name="firstName"]', "John");
    await page.fill('input[name="lastName"]', "Doe");
    await page.fill('input[name="email"]', existingEmail);
    await page.fill('input[name="contactNumber"]', "03114723588");
    await page.fill('input[name="password"]', "Pakistan@123");
    await page.fill('input[name="confirmPassword"]', "Pakistan@123");
    await page.selectOption('select[name="role"]', "recruiter");

    const submitButton = page.getByRole("button", { name: /sign up/i });
    await submitButton.click();

    await page.waitForTimeout(2000);

    const errorMessage = await page
      .locator("text=/Error|error occurred/i")
      .isVisible()
      .catch(() => false);

    expect(errorMessage).toBeTruthy();

    const cookies = await page.context().cookies();
    const tokenCookie = cookies.find(
      (cookie) => cookie.name === "access_token"
    );
    expect(tokenCookie).toBeUndefined();
  });

  test.skip("Debug: Capture page state after signup attempt", async ({
    page,
  }) => {
    const uniqueEmail = `debug.user.${Date.now()}@example.com`;

    await page.fill('input[name="firstName"]', "Debug");
    await page.fill('input[name="lastName"]', "User");
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="contactNumber"]', "1234567890");
    await page.fill('input[name="password"]', "Password123!");
    await page.fill('input[name="confirmPassword"]', "Password123!");
    await page.selectOption('select[name="role"]', "candidate");

    const submitButton = page.getByRole("button", { name: /sign up/i });
    await submitButton.click();

    await page.waitForTimeout(3000);

    await page.screenshot({ path: "debug-signup-attempt.png" });

    const pageContent = await page.content();
    console.log("Page content after signup attempt:", pageContent);
  });
});
