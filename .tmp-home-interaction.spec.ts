import { expect, test } from "@playwright/test";

test("home entrance opens as an app window and enters the record store interior", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("http://localhost:4321/");
  await page.waitForLoadState("networkidle");

  const root = page.locator("#record-store-hero");
  await expect(root).toHaveAttribute("data-entry-state", "intro");
  await expect(page.locator(".retro-computer-canvas")).toBeVisible();

  await page.getByRole("button", { name: "Press Start" }).click();
  await expect(root).toHaveAttribute("data-entry-state", "open", { timeout: 5000 });
  await expect(page.locator(".record-store-app-window")).toBeVisible();
  await expect(page.locator(".record-store-app-titlebar__back")).toBeVisible();
  await page.screenshot({ path: "test-results/home-open.png", fullPage: false });

  await expect(root).toHaveAttribute("data-scroll-ready", "true", { timeout: 7000 });
  await page.locator("[data-record-store-door-trigger]").click();
  await expect(root).toHaveAttribute("data-scroll-phase", "interior", { timeout: 7000 });
  await expect(page.locator(".record-store-interior-scene-layer")).toBeVisible();
  await expect(page.locator(".record-store-dialog-layer")).toBeVisible();
  await page.screenshot({ path: "test-results/home-interior.png", fullPage: false });
});

test("home entrance still opens the app window on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://localhost:4321/");
  await page.waitForLoadState("networkidle");

  const root = page.locator("#record-store-hero");
  await page.getByRole("button", { name: "Press Start" }).click();
  await expect(root).toHaveAttribute("data-entry-state", "open", { timeout: 5000 });
  await expect(page.locator(".record-store-app-window")).toBeVisible();
  await page.screenshot({ path: "test-results/home-mobile-open.png", fullPage: false });
});
