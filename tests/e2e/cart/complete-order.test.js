const { test, expect } = require("@playwright/test");
const { LEGIT } = require("../../fixtures/auth");
const exp = require("constants");

test.describe("Main success case (CEG)", () => {
  test("TC01", async ({ browser }) => {
    const context = await browser.newContext({
      permissions: ["geolocation"],
      geolocation: { latitude: 10.762622, longitude: 106.660172 }, // example: Ho Chi Minh City
      locale: "vi-VN",
    });

    const page = await context.newPage();
    // Step 1: Login
    await page.goto("http://localhost:3000/home");
    await page.waitForTimeout(5000);
    await page.getByRole("link", { name: "Đăng nhập" }).click();
    await page.getByRole("textbox", { name: "Nhập email của bạn" }).click();
    await page.getByRole("textbox", { name: "Nhập email của bạn" }).fill("ngocdatnguyen2404@gmail.com");
    await page.getByRole("textbox", { name: "Nhập mật khẩu của bạn" }).click();
    await page.getByRole("textbox", { name: "Nhập mật khẩu của bạn" }).fill("123456789");
    await page.getByRole("button", { name: "Đăng nhập" }).click();

    // Step 2: Click 'Tasty Bites'
    await page.waitForTimeout(15000);
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.getByRole("link", { name: "Tasty Bites" }).click();

    // Step 3: Add Dish with all toppings to cart
    await page.getByRole("link", { name: "Value Burger Tôm" }).click();
    await page
      .locator("div")
      .filter({ hasText: /^Sốt Đậu \(1 hủ\)$/ })
      .getByRole("img")
      .click();
    await page.getByRole("button", { name: "Increase" }).click();
    await page.getByRole("button", { name: "Increase" }).click();
    await page.getByText("Thêm vào giỏ hàng").click();
    await page.getByRole("link").filter({ hasText: /^$/ }).nth(1).click();
    await page.getByRole("link", { name: "Combo Burger Bulgogi" }).click();
    await page
      .locator("div")
      .filter({ hasText: /^Sốt Đậu \(1 hủ\)$/ })
      .getByRole("img")
      .click();
    await page
      .locator("div")
      .filter({ hasText: /^Sốt Đậu \(1 hủ\)$/ })
      .getByRole("img")
      .click();
    await page.getByText("Sốt H&S (1 hủ)").click();
    await page
      .locator("div")
      .filter({ hasText: /^Sốt Đậu \(1 hủ\)$/ })
      .click();
    await page.getByRole("button", { name: "Increase" }).click();
    await page.getByText("Thêm vào giỏ hàng").click();
    await page.getByText("Thêm vào giỏ hàng").click();
    await page.getByRole("link").filter({ hasText: /^$/ }).nth(1).click();
    await page.getByRole("link", { name: "Giỏ hàng" }).click();
    await page.getByRole("button", { name: "Lưu" }).click();
    await page
      .locator("div")
      .filter({ hasText: /^Đặt đơn$/ })
      .click();

    const successAlert = page.getByText("Đặt thành công", { exact: false });
    await expect(successAlert).toBeVisible();
  });
});
