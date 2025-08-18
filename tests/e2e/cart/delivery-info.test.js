const { test, expect } = require("@playwright/test");
const { LEGIT } = require("../../fixtures/auth");
const exp = require("constants");

test.describe("Delivery infomation (DT)", () => {
  test("TC09", async ({ browser }) => {
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
    await page.waitForTimeout(2000);
    // Step 2: Click 'Tasty Bites'
    await page.goto("http://localhost:3000/store/67c6e409f1c07122e88619d6");

    // Step 3: Add Dish with all toppings to cart
    await page.getByRole("link", { name: "Value Burger Tôm add Value" }).click();

    await page.getByRole("button", { name: "Increase" }).click();
    await page.getByText("Thêm vào giỏ hàng").click();
    await page.waitForTimeout(2000);
    await page.getByRole("button", { name: "OK" }).click();
    await page.getByRole("link").filter({ hasText: /^$/ }).nth(1).click(); // Exit

    await page.waitForTimeout(2000);
    const cartDetailBtn = page.locator('a[name="cartDetailBtn"]');
    await cartDetailBtn.click();

    await page.waitForTimeout(2000);
    await page
      .locator("div")
      .filter({ hasText: /^Đặt đơn$/ })
      .click();

    const successAlert = page.getByText("Đặt thành công", { exact: false });
    await expect(successAlert).toBeVisible();
  });
  test("TC10", async ({ page }) => {
    // Step 1: Login
    await page.goto("http://localhost:3000/auth/login");
    await page.getByRole("textbox", { name: "Nhập email của bạn" }).click();
    await page.getByRole("textbox", { name: "Nhập email của bạn" }).fill(LEGIT.email);
    await page.getByRole("textbox", { name: "Nhập mật khẩu của bạn" }).click();
    await page.getByRole("textbox", { name: "Nhập mật khẩu của bạn" }).fill(LEGIT.password);
    await page.getByRole("button", { name: "Đăng nhập" }).click();
    await page.waitForTimeout(2000);
    // Step 2: Click 'Tasty Bites'
    await page.goto("http://localhost:3000/store/67c6e409f1c07122e88619d6");

    // Step 3: Add Dish with all toppings to cart
    await page.getByRole("link", { name: "Value Burger Tôm add Value" }).click();

    await page.getByRole("button", { name: "Increase" }).click();
    await page.getByText("Thêm vào giỏ hàng").click();
    await page.waitForTimeout(2000);
    await page.getByRole("button", { name: "OK" }).click();
    await page.getByRole("link").filter({ hasText: /^$/ }).nth(1).click(); // Exit

    await page.waitForTimeout(2000);
    const cartDetailBtn = page.locator('a[name="cartDetailBtn"]');
    await cartDetailBtn.click();

    await page.waitForTimeout(2000);
    await page
      .locator("div")
      .filter({ hasText: /^Đặt đơn$/ })
      .click();

    const failAlert = page.getByText("Vui lòng chọn địa chỉ giao hàng", { exact: false });
  });
  test("TC11", async ({ page }) => {
    // Step 1: Login
    await page.goto("http://localhost:3000/auth/login");
    await page.getByRole("textbox", { name: "Nhập email của bạn" }).click();
    await page.getByRole("textbox", { name: "Nhập email của bạn" }).fill(LEGIT.email);
    await page.getByRole("textbox", { name: "Nhập mật khẩu của bạn" }).click();
    await page.getByRole("textbox", { name: "Nhập mật khẩu của bạn" }).fill(LEGIT.password);
    await page.getByRole("button", { name: "Đăng nhập" }).click();
    await page.waitForTimeout(5000);
    // Step 2: Click 'Tasty Bites'
    await page.goto("http://localhost:3000/store/67c6e409f1c07122e88619d6");

    // Step 3: Add Dish with all toppings to cart
    await page.getByRole("link", { name: "Value Burger Tôm add Value" }).click();

    await page.getByRole("button", { name: "Increase" }).click();
    await page.getByText("Thêm vào giỏ hàng").click();
    await page.waitForTimeout(2000);
    await page.getByRole("button", { name: "OK" }).click();
    await page.getByRole("link").filter({ hasText: /^$/ }).nth(1).click(); // Exit

    await page.waitForTimeout(2000);
    const cartDetailBtn = page.locator('a[name="cartDetailBtn"]');
    await cartDetailBtn.click();

    await page.waitForTimeout(2000);

    await page.waitForSelector('a:has-text("Thêm chi tiết địa chỉ")');
    await page.getByRole("link", { name: "Thêm chi tiết địa chỉ và hướ" }).click();
    await page.waitForTimeout(2000);
    await page.locator('input[name="contactPhonenumber"]').fill("0935013555");

    await page.getByRole("button", { name: "Lưu" }).click();
    await page
      .locator("div")
      .filter({ hasText: /^Đặt đơn$/ })
      .click();

    const failAlert = page.getByText("Vui lòng chọn địa chỉ giao hàng", { exact: false });
    await expect(failAlert).toBeVisible();
  });
  test("TC12", async ({ page }) => {
    // Step 1: Login
    await page.goto("http://localhost:3000/auth/login");
    await page.getByRole("textbox", { name: "Nhập email của bạn" }).click();
    await page.getByRole("textbox", { name: "Nhập email của bạn" }).fill(LEGIT.email);
    await page.getByRole("textbox", { name: "Nhập mật khẩu của bạn" }).click();
    await page.getByRole("textbox", { name: "Nhập mật khẩu của bạn" }).fill(LEGIT.password);
    await page.getByRole("button", { name: "Đăng nhập" }).click();
    await page.waitForTimeout(5000);
    // Step 2: Click 'Tasty Bites'
    await page.goto("http://localhost:3000/store/67c6e409f1c07122e88619d6");

    // Step 3: Add Dish with all toppings to cart
    await page.getByRole("link", { name: "Value Burger Tôm add Value" }).click();

    await page.getByRole("button", { name: "Increase" }).click();
    await page.getByText("Thêm vào giỏ hàng").click();
    await page.waitForTimeout(2000);
    await page.getByRole("button", { name: "OK" }).click();
    await page.getByRole("link").filter({ hasText: /^$/ }).nth(1).click(); // Exit

    await page.waitForTimeout(2000);
    const cartDetailBtn = page.locator('a[name="cartDetailBtn"]');
    await cartDetailBtn.click();

    await page.waitForTimeout(2000);

    await page.waitForSelector('a:has-text("Thêm chi tiết địa chỉ")');
    await page.getByRole("link", { name: "Thêm chi tiết địa chỉ và hướ" }).click();
    await page.waitForTimeout(2000);
    await page.locator('input[name="contactName"]').fill("Nguyễn Văn A");

    await page.getByRole("button", { name: "Lưu" }).click();
    await page
      .locator("div")
      .filter({ hasText: /^Đặt đơn$/ })
      .click();

    const failAlert = page.getByText("Vui lòng chọn địa chỉ giao hàng", { exact: false });
    await expect(failAlert).toBeVisible();
  });
  test("TC13", async ({ page }) => {
    // Step 1: Login
    await page.goto("http://localhost:3000/auth/login");
    await page.getByRole("textbox", { name: "Nhập email của bạn" }).click();
    await page.getByRole("textbox", { name: "Nhập email của bạn" }).fill(LEGIT.email);
    await page.getByRole("textbox", { name: "Nhập mật khẩu của bạn" }).click();
    await page.getByRole("textbox", { name: "Nhập mật khẩu của bạn" }).fill(LEGIT.password);
    await page.getByRole("button", { name: "Đăng nhập" }).click();
    await page.waitForTimeout(5000);
    // Step 2: Click 'Tasty Bites'
    await page.goto("http://localhost:3000/store/67c6e409f1c07122e88619d6");

    // Step 3: Add Dish with all toppings to cart
    await page.getByRole("link", { name: "Value Burger Tôm add Value" }).click();

    await page.getByRole("button", { name: "Increase" }).click();
    await page.getByText("Thêm vào giỏ hàng").click();
    await page.waitForTimeout(2000);
    await page.getByRole("button", { name: "OK" }).click();
    await page.getByRole("link").filter({ hasText: /^$/ }).nth(1).click(); // Exit

    await page.waitForTimeout(2000);
    const cartDetailBtn = page.locator('a[name="cartDetailBtn"]');
    await cartDetailBtn.click();

    await page.waitForTimeout(2000);
    await page.getByRole("link", { name: "Nhấn chọn để thêm địa chỉ" }).click();
    await page.waitForTimeout(2000);
    await page.getByRole("heading", { name: "Nhà" }).first().click();
    await page.waitForTimeout(2000);

    await page
      .locator("div")
      .filter({ hasText: /^Đặt đơn$/ })
      .click();

    const failAlert = page.getByText("Vui lòng nhập tên người nhận", { exact: false });
    await expect(failAlert).toBeVisible();
  });
  test("TC14", async ({ page }) => {
    // Step 1: Login
    await page.goto("http://localhost:3000/auth/login");
    await page.getByRole("textbox", { name: "Nhập email của bạn" }).click();
    await page.getByRole("textbox", { name: "Nhập email của bạn" }).fill(LEGIT.email);
    await page.getByRole("textbox", { name: "Nhập mật khẩu của bạn" }).click();
    await page.getByRole("textbox", { name: "Nhập mật khẩu của bạn" }).fill(LEGIT.password);
    await page.getByRole("button", { name: "Đăng nhập" }).click();
    await page.waitForTimeout(10000);
    // Step 2: Click 'Tasty Bites'
    await page.goto("http://localhost:3000/store/67c6e409f1c07122e88619d6");

    // Step 3: Add Dish with all toppings to cart
    await page.getByRole("link", { name: "Value Burger Tôm add Value" }).click();

    await page.getByRole("button", { name: "Increase" }).click();
    await page.getByText("Thêm vào giỏ hàng").click();
    await page.waitForTimeout(2000);
    await page.getByRole("button", { name: "OK" }).click();
    await page.getByRole("link").filter({ hasText: /^$/ }).nth(1).click(); // Exit

    await page.waitForTimeout(2000);
    const cartDetailBtn = page.locator('a[name="cartDetailBtn"]');
    await cartDetailBtn.click();

    await page.waitForTimeout(2000);

    await page.waitForSelector('a:has-text("Thêm chi tiết địa chỉ")');
    await page.getByRole("link", { name: "Thêm chi tiết địa chỉ và hướ" }).click();
    await page.waitForTimeout(2000);
    await page.locator('input[name="contactName"]').fill("Nguyễn Văn A");
    await page.locator('input[name="contactPhonenumber"]').fill("0935013555");

    await page.getByRole("button", { name: "Lưu" }).click();
    await page
      .locator("div")
      .filter({ hasText: /^Đặt đơn$/ })
      .click();

    const failAlert = page.getByText("Vui lòng chọn địa chỉ giao hàng", { exact: false });
    await expect(failAlert).toBeVisible();
  });
  test("TC15", async ({ page }) => {
    // Step 1: Login
    await page.goto("http://localhost:3000/auth/login");
    await page.getByRole("textbox", { name: "Nhập email của bạn" }).click();
    await page.getByRole("textbox", { name: "Nhập email của bạn" }).fill(LEGIT.email);
    await page.getByRole("textbox", { name: "Nhập mật khẩu của bạn" }).click();
    await page.getByRole("textbox", { name: "Nhập mật khẩu của bạn" }).fill(LEGIT.password);
    await page.getByRole("button", { name: "Đăng nhập" }).click();
    await page.waitForTimeout(5000);
    // Step 2: Click 'Tasty Bites'
    await page.goto("http://localhost:3000/store/67c6e409f1c07122e88619d6");

    // Step 3: Add Dish with all toppings to cart
    await page.getByRole("link", { name: "Value Burger Tôm add Value" }).click();

    await page.getByRole("button", { name: "Increase" }).click();
    await page.getByText("Thêm vào giỏ hàng").click();
    await page.waitForTimeout(2000);
    await page.getByRole("button", { name: "OK" }).click();
    await page.getByRole("link").filter({ hasText: /^$/ }).nth(1).click(); // Exit

    await page.waitForTimeout(2000);
    const cartDetailBtn = page.locator('a[name="cartDetailBtn"]');
    await cartDetailBtn.click();

    await page.waitForTimeout(2000);
    await page.getByRole("link", { name: "Nhấn chọn để thêm địa chỉ" }).click();
    await page.waitForTimeout(2000);
    await page.getByRole("heading", { name: "Nhà" }).first().click();
    await page.waitForTimeout(2000);
    await page.waitForSelector('a:has-text("Thêm chi tiết địa chỉ")');
    await page.getByRole("link", { name: "Thêm chi tiết địa chỉ và hướ" }).click();
    await page.waitForTimeout(2000);
    await page.locator('input[name="contactName"]').fill("Nguyễn Văn A");
    await page.getByRole("button", { name: "Lưu" }).click();

    await page
      .locator("div")
      .filter({ hasText: /^Đặt đơn$/ })
      .click();

    const failAlert = page.getByText("Vui lòng nhập số điện thoại người nhận", { exact: false });
    await expect(failAlert).toBeVisible();
  });
  test("TC16", async ({ page }) => {
    // Step 1: Login
    await page.goto("http://localhost:3000/auth/login");
    await page.getByRole("textbox", { name: "Nhập email của bạn" }).click();
    await page.getByRole("textbox", { name: "Nhập email của bạn" }).fill(LEGIT.email);
    await page.getByRole("textbox", { name: "Nhập mật khẩu của bạn" }).click();
    await page.getByRole("textbox", { name: "Nhập mật khẩu của bạn" }).fill(LEGIT.password);
    await page.getByRole("button", { name: "Đăng nhập" }).click();
    await page.waitForTimeout(5000);
    // Step 2: Click 'Tasty Bites'
    await page.goto("http://localhost:3000/store/67c6e409f1c07122e88619d6");

    // Step 3: Add Dish with all toppings to cart
    await page.getByRole("link", { name: "Value Burger Tôm add Value" }).click();

    await page.getByRole("button", { name: "Increase" }).click();
    await page.getByText("Thêm vào giỏ hàng").click();
    await page.waitForTimeout(2000);
    await page.getByRole("button", { name: "OK" }).click();
    await page.getByRole("link").filter({ hasText: /^$/ }).nth(1).click(); // Exit

    await page.waitForTimeout(2000);
    const cartDetailBtn = page.locator('a[name="cartDetailBtn"]');
    await cartDetailBtn.click();

    await page.waitForTimeout(2000);
    await page.getByRole("link", { name: "Nhấn chọn để thêm địa chỉ" }).click();
    await page.waitForTimeout(2000);
    await page.getByRole("heading", { name: "Nhà" }).first().click();
    await page.waitForTimeout(2000);
    await page.waitForSelector('a:has-text("Thêm chi tiết địa chỉ")');
    await page.getByRole("link", { name: "Thêm chi tiết địa chỉ và hướ" }).click();
    await page.waitForTimeout(2000);
    await page.locator('input[name="contactPhonenumber"]').fill("0935013555");
    await page.getByRole("button", { name: "Lưu" }).click();

    await page
      .locator("div")
      .filter({ hasText: /^Đặt đơn$/ })
      .click();

    const failAlert = page.getByText("Vui lòng nhập tên người nhận", { exact: false });
    await expect(failAlert).toBeVisible();
  });
});
