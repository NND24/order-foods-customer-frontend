const { test, expect } = require("@playwright/test");
const { LEGIT } = require("../../fixtures/auth");
const exp = require("constants");

test.describe("Dishes Quantity (BVA)", () => {
  test("TC02", async ({ browser }) => {
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
    await page.getByRole("textbox", { name: "Nhập email của bạn" }).fill(LEGIT.email);
    await page.getByRole("textbox", { name: "Nhập mật khẩu của bạn" }).click();
    await page.getByRole("textbox", { name: "Nhập mật khẩu của bạn" }).fill(LEGIT.password);
    await page.getByRole("button", { name: "Đăng nhập" }).click();

    // Step 2: Click 'Tasty Bites'
    await page.waitForTimeout(15000);
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.getByRole("link", { name: "Tasty Bites rating 3.0 (1 đá" }).click();

    // Step 3: Add Dish with all toppings to cart
    await page.waitForTimeout(5000);
    await page.evaluate(() => window.scrollBy(0, 150));
    await page.getByRole("link", { name: "Value Burger Tôm add Value" }).click();
    await page
      .locator("div")
      .filter({ hasText: /^Sốt Đậu \(1 hủ\)$/ })
      .getByRole("img")
      .click();
    await page.getByRole("button", { name: "Increase" }).click();
    await page.getByRole("button", { name: "Increase" }).click();
    await page.getByText("Thêm vào giỏ hàng").click();
    await page.getByRole("button", { name: "OK" }).click();
    await page.evaluate(() => window.scrollBy(0, -150));
    await page.getByRole("link").filter({ hasText: /^$/ }).nth(1).click();

    await page.waitForTimeout(5000);
    const cartDetailBtn = page.locator('a[name="cartDetailBtn"]');
    await cartDetailBtn.click();

    await page.waitForTimeout(5000);
    await page
      .locator("div")
      .filter({ hasText: /^Đặt đơn$/ })
      .click();

    const successAlert = page.getByText("Đặt thành công", { exact: false });
    await expect(successAlert).toBeVisible();
  });
  test("TC03", async ({ browser }) => {
    const context = await browser.newContext({
      permissions: ["geolocation"],
      geolocation: { latitude: 10.762622, longitude: 106.660172 }, // example: Ho Chi Minh City
      locale: "vi-VN",
    });

    const page = await context.newPage();
    // Step 1: Login

    await page.goto("http://localhost:3000/auth/login");
    await page.getByRole("textbox", { name: "Nhập email của bạn" }).click();
    await page.getByRole("textbox", { name: "Nhập email của bạn" }).fill(LEGIT.email);
    await page.getByRole("textbox", { name: "Nhập mật khẩu của bạn" }).click();
    await page.getByRole("textbox", { name: "Nhập mật khẩu của bạn" }).fill(LEGIT.password);
    await page.getByRole("button", { name: "Đăng nhập" }).click();

    // Step 2: Click 'Tasty Bites'
    await page.goto("http://localhost:3000/store/67c6e409f1c07122e88619d6");

    // Step 3: Add Dish with all toppings to cart
    const urlBefore = page.url();
    await page.getByRole("link", { name: "Value Burger Tôm" }).nth(1).click({ force: true });
    await expect(page).toHaveURL(urlBefore);
  });
  test("TC04", async ({ browser }) => {
    const context = await browser.newContext({
      permissions: ["geolocation"],
      geolocation: { latitude: 10.762622, longitude: 106.660172 }, // example: Ho Chi Minh City
      locale: "vi-VN",
    });

    const page = await context.newPage();
    // Step 1: Login

    await page.goto("http://localhost:3000/auth/login");
    await page.getByRole("textbox", { name: "Nhập email của bạn" }).click();
    await page.getByRole("textbox", { name: "Nhập email của bạn" }).fill(LEGIT.email);
    await page.getByRole("textbox", { name: "Nhập mật khẩu của bạn" }).click();
    await page.getByRole("textbox", { name: "Nhập mật khẩu của bạn" }).fill(LEGIT.password);
    await page.getByRole("button", { name: "Đăng nhập" }).click();

    // Step 2: Click 'Tasty Bites'
    await page.goto("http://localhost:3000/store/67c6e409f1c07122e88619d6");

    // Step 3: Add Dish with all toppings to cart
    await page.getByRole("link", { name: "Value Burger Tôm" }).nth(1).click();
    await page.getByRole("spinbutton").nth(0).fill("-1");

    const correctAlert = page.getByText("Số lượng tối thiểu là 0. Đã tự động điều chỉnh.", { exact: false });
    await expect(correctAlert).toBeVisible();
  });
  test("TC05", async ({ browser }) => {
    const context = await browser.newContext({
      permissions: ["geolocation"],
      geolocation: { latitude: 10.762622, longitude: 106.660172 }, // example: Ho Chi Minh City
      locale: "vi-VN",
    });

    const page = await context.newPage();
    // Step 1: Login

    await page.goto("http://localhost:3000/auth/login");
    await page.getByRole("textbox", { name: "Nhập email của bạn" }).click();
    await page.getByRole("textbox", { name: "Nhập email của bạn" }).fill(LEGIT.email);
    await page.getByRole("textbox", { name: "Nhập mật khẩu của bạn" }).click();
    await page.getByRole("textbox", { name: "Nhập mật khẩu của bạn" }).fill(LEGIT.password);
    await page.getByRole("button", { name: "Đăng nhập" }).click();

    // Step 2: Click 'Tasty Bites'
    await page.goto("http://localhost:3000/store/67c6e409f1c07122e88619d6");

    // Step 3: Add Dish with all toppings to cart
    await page.getByRole("link", { name: "Value Burger Tôm" }).nth(1).click();
    await page.getByRole("spinbutton").nth(0).fill("0");

    const goBackBtn = page.getByText("Quay lại cửa hàng", { exact: false });
    await expect(goBackBtn).toBeVisible();
  });
  test("TC06", async ({ browser }) => {
    const context = await browser.newContext({
      permissions: ["geolocation"],
      geolocation: { latitude: 10.762622, longitude: 106.660172 }, // example: Ho Chi Minh City
      locale: "vi-VN",
    });

    const page = await context.newPage();
    // Step 1: Login

    await page.goto("http://localhost:3000/auth/login");
    await page.getByRole("textbox", { name: "Nhập email của bạn" }).click();
    await page.getByRole("textbox", { name: "Nhập email của bạn" }).fill(LEGIT.email);
    await page.getByRole("textbox", { name: "Nhập mật khẩu của bạn" }).click();
    await page.getByRole("textbox", { name: "Nhập mật khẩu của bạn" }).fill(LEGIT.password);
    await page.getByRole("button", { name: "Đăng nhập" }).click();

    // Step 2: Click 'Tasty Bites'
    await page.goto("http://localhost:3000/store/67c6e409f1c07122e88619d6");

    // Step 3: Add Dish with all toppings to cart
    await page.getByRole("link", { name: "Value Burger Tôm" }).nth(1).click();
    await page.getByRole("spinbutton").nth(0).fill("1");

    const correctAlert = page.getByText("Đã tự động điều chỉnh.", { exact: false });
    if (await correctAlert.isVisible()) {
      // If alert is visible, test fails
      throw new Error("Alert should not be visible when quantity is set to 1");
    }

    const addCartBtn = page.locator('div[name="addCartBtn"]');
    await addCartBtn.click();
    await page.getByRole("button", { name: "OK" }).click();

    // Step 4: verify cart contents
    const cartDetailBtn = page.locator('a[name="cartDetailBtn"]');
    await cartDetailBtn.click();

    await page
      .locator("div")
      .filter({ hasText: /^Đặt đơn$/ })
      .click();

    const successAlert = page.getByText("Đặt thành công", { exact: false });
    await expect(successAlert).toBeVisible();
  });
  test("TC07", async ({ browser }) => {
    const context = await browser.newContext({
      permissions: ["geolocation"],
      geolocation: { latitude: 10.762622, longitude: 106.660172 }, // example: Ho Chi Minh City
      locale: "vi-VN",
    });

    const page = await context.newPage();
    // Step 1: Login

    await page.goto("http://localhost:3000/auth/login");
    await page.getByRole("textbox", { name: "Nhập email của bạn" }).click();
    await page.getByRole("textbox", { name: "Nhập email của bạn" }).fill(LEGIT.email);
    await page.getByRole("textbox", { name: "Nhập mật khẩu của bạn" }).click();
    await page.getByRole("textbox", { name: "Nhập mật khẩu của bạn" }).fill(LEGIT.password);
    await page.getByRole("button", { name: "Đăng nhập" }).click();

    // Step 2: Click 'Tasty Bites'
    await page.goto("http://localhost:3000/store/67c6e409f1c07122e88619d6");

    // Step 3: Add Dish with all toppings to cart
    await page.getByRole("link", { name: "Value Burger Tôm" }).nth(1).click();
    await page.getByRole("spinbutton").nth(0).fill("50");

    const correctAlert = page.getByText("Đã tự động điều chỉnh.", { exact: false });
    if (await correctAlert.isVisible()) {
      // If alert is visible, test fails
      throw new Error("Alert should not be visible when quantity is set to 50");
    }

    const addCartBtn = page.locator('div[name="addCartBtn"]');
    await addCartBtn.click();
    await page.getByRole("button", { name: "OK" }).click();

    // Step 4: verify cart contents
    const cartDetailBtn = page.locator('a[name="cartDetailBtn"]');
    await cartDetailBtn.click();

    await page
      .locator("div")
      .filter({ hasText: /^Đặt đơn$/ })
      .click();

    const successAlert = page.getByText("Đặt thành công", { exact: false });
    await expect(successAlert).toBeVisible();
  });
  test("TC08", async ({ browser }) => {
    const context = await browser.newContext({
      permissions: ["geolocation"],
      geolocation: { latitude: 10.762622, longitude: 106.660172 }, // example: Ho Chi Minh City
      locale: "vi-VN",
    });

    const page = await context.newPage();
    // Step 1: Login

    await page.goto("http://localhost:3000/auth/login");
    await page.getByRole("textbox", { name: "Nhập email của bạn" }).click();
    await page.getByRole("textbox", { name: "Nhập email của bạn" }).fill(LEGIT.email);
    await page.getByRole("textbox", { name: "Nhập mật khẩu của bạn" }).click();
    await page.getByRole("textbox", { name: "Nhập mật khẩu của bạn" }).fill(LEGIT.password);
    await page.getByRole("button", { name: "Đăng nhập" }).click();

    // Step 2: Click 'Tasty Bites'
    await page.goto("http://localhost:3000/store/67c6e409f1c07122e88619d6");

    // Step 3: Add Dish with all toppings to cart
    await page.getByRole("link", { name: "Value Burger Tôm" }).nth(1).click();
    await page.getByRole("spinbutton").nth(0).fill("51");

    const correctAlert = page.getByText("Số lượng tối đa là 50. Đã tự động điều chỉnh.", { exact: false });
    await expect(correctAlert).toBeVisible();
  });
});
