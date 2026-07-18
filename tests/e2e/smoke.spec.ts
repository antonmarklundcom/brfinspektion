import { test, expect } from "@playwright/test";

const hasDb = Boolean(process.env.DATABASE_URL);
const hasOwnerCreds = Boolean(process.env.SEED_OWNER_EMAIL && process.env.SEED_OWNER_PASSWORD);

async function loginAsOwner(page: import("@playwright/test").Page) {
  await page.goto("/admin/logga-in");
  await page.fill("#email", process.env.SEED_OWNER_EMAIL!);
  await page.fill("#password", process.env.SEED_OWNER_PASSWORD!);
  await page.getByRole("button", { name: "Logga in" }).click();
  await page.waitForURL(/\/admin$/, { timeout: 10_000 });
}

test.describe("public site (architecture.md §9 test #5)", () => {
  test("homepage renders with title and FAQPage schema", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/BRF Inspektion/);
    await expect(page.locator("h1")).toContainText("bostadsrättsförening");

    const schemaTypes = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((nodes) => nodes.map((n) => JSON.parse(n.textContent ?? "{}")["@type"]));
    expect(schemaTypes).toContain("FAQPage");
    expect(schemaTypes).toContain("Organization");
  });

  test("garantibesiktning consolidates the keyword variants with Service + FAQPage schema", async ({
    page,
  }) => {
    await page.goto("/garantibesiktning");
    await expect(page.locator("h1")).toContainText("garantibesiktning");

    const schemas = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((nodes) => nodes.map((n) => JSON.parse(n.textContent ?? "{}")));
    const types = schemas.map((s) => s["@type"]);
    expect(types).toContain("Service");
    expect(types).toContain("FAQPage");

    const faq = schemas.find((s) => s["@type"] === "FAQPage");
    expect(faq.mainEntity.length).toBeGreaterThanOrEqual(5);
  });

  test("sitemap.xml and robots.txt respond and robots disallows /admin", async ({ request }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBeTruthy();

    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBeTruthy();
    expect(await robots.text()).toContain("Disallow: /admin");
  });

  test("unauthenticated /admin redirects to login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/logga-in/);
  });

  test("guides index links to a guide with Article + FAQPage schema", async ({ page }) => {
    await page.goto("/guider");
    await page.getByRole("link", { name: /Stambyte eller relining/ }).click();

    await expect(page).toHaveURL(/\/guider\/stambyte-eller-relining/);
    const schemaTypes = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((nodes) => nodes.map((n) => JSON.parse(n.textContent ?? "{}")["@type"]));
    expect(schemaTypes).toContain("Article");
    expect(schemaTypes).toContain("FAQPage");
  });
});

test.describe("calculator lead capture", () => {
  test.skip(!hasDb, "requires DATABASE_URL");

  test("happy path: fill form, submit, see risk result", async ({ page }) => {
    await page.goto("/kostnadskalkyl");

    await page.fill("#byggAr", "1965");
    await page.fill("#antalLagenheter", "24");
    await page.selectOption("#stamTyp", "GJUTJARN");
    await page.selectOption("#senasteStambyte", "ALDRIG");
    await page.fill("#brfNamn", `Brf Playwright ${Date.now()}`);
    await page.fill("#kontaktNamn", "Test Testsson");
    await page.fill("#epost", "playwright-test@example.com");
    await page.check("#consent");
    await page.click('button[type="submit"]');

    await expect(page.getByText(/SEK/)).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText("Boka en statusbesiktning")).toBeVisible();
  });
});

test.describe("contact form lead capture", () => {
  test.skip(!hasDb, "requires DATABASE_URL");

  test("submits and shows a thank-you message", async ({ page }) => {
    await page.goto("/kontakt");
    await page.fill("#brfNamn", `Brf Kontakt ${Date.now()}`);
    await page.fill("#kontaktNamn", "Kontaktperson Testsson");
    await page.fill("#epost", "playwright-kontakt@example.com");
    await page.check("#consent");
    await page.click('button[type="submit"]');

    await expect(page.getByText("Tack!")).toBeVisible({ timeout: 10_000 });
  });
});

test.describe("admin", () => {
  test.skip(!hasDb || !hasOwnerCreds, "requires DATABASE_URL and SEED_OWNER_EMAIL/PASSWORD");

  test("owner can log in and see the leads pipeline", async ({ page }) => {
    await page.goto("/admin/logga-in");
    await page.fill("#email", process.env.SEED_OWNER_EMAIL!);
    await page.fill("#password", process.env.SEED_OWNER_PASSWORD!);
    // Scoped to the login form itself — the authenticated admin shell (a
    // different route group as of this fix) also has a "submit" button
    // (sign out), so an unscoped selector is ambiguous.
    await page.getByRole("button", { name: "Logga in" }).click();

    await expect(page).toHaveURL(/\/admin$/, { timeout: 10_000 });
    await page.goto("/admin/leads");
    await expect(page.locator("h1")).toContainText("Leads");
  });

  test("owner can create a partner user in installningar", async ({ page }) => {
    await page.goto("/admin/logga-in");
    await page.fill("#email", process.env.SEED_OWNER_EMAIL!);
    await page.fill("#password", process.env.SEED_OWNER_PASSWORD!);
    await page.getByRole("button", { name: "Logga in" }).click();
    await expect(page).toHaveURL(/\/admin$/, { timeout: 10_000 });

    await page.goto("/admin/installningar");
    const email = `e2e-partner-${Date.now()}@example.com`;
    await page.fill("#name", "E2E Partner Person");
    await page.fill("#email", email);
    await page.fill("#password", "password123!");
    await page.selectOption("#role", "PARTNER");
    await page.selectOption("#partnerId", { index: 1 }); // first real partner option
    await page.getByRole("button", { name: "Skapa användare" }).click();

    await expect(page.getByText(email)).toBeVisible({ timeout: 10_000 });
  });

  test("owner can create a manual task and mark it done", async ({ page }) => {
    await page.goto("/admin/logga-in");
    await page.fill("#email", process.env.SEED_OWNER_EMAIL!);
    await page.fill("#password", process.env.SEED_OWNER_PASSWORD!);
    await page.getByRole("button", { name: "Logga in" }).click();
    await expect(page).toHaveURL(/\/admin$/, { timeout: 10_000 });

    await page.goto("/admin/uppgifter");
    const title = `E2E manuell uppgift ${Date.now()}`;
    await page.fill("#title", title);
    await page.fill("#dueDate", "2027-01-01");
    await page.getByRole("button", { name: "Lägg till uppgift" }).click();

    const taskItem = page.locator("li", { hasText: title });
    await expect(taskItem).toBeVisible({ timeout: 10_000 });

    await taskItem.getByRole("button", { name: "Markera klar" }).click();
    await expect(page.locator("li", { hasText: title })).toHaveCount(0, { timeout: 10_000 });
  });

  test("owner can set a project's contract value and add a customer note", async ({ page }) => {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    const customer = await prisma.customer.create({ data: { brfNamn: `Brf E2E ${Date.now()}` } });
    const project = await prisma.project.create({
      data: { customerId: customer.id, serviceType: "KONTROLLANSVARIG" },
    });

    await loginAsOwner(page);
    await page.goto(`/admin/kunder/${customer.id}`);

    await page.fill('input[name="contractValueSek"]', "275000");
    await page.getByRole("button", { name: "Spara", exact: true }).click();
    // toLocaleString("sv-SE") uses a non-breaking space as the thousands
    // separator — \s in JS regex matches it.
    await expect(page.getByText(/275\s000\sSEK/)).toBeVisible({ timeout: 10_000 });

    const noteText = `E2E-anteckning ${Date.now()}`;
    await page.fill('textarea[name="body"]', noteText);
    await page.getByRole("button", { name: "Spara anteckning" }).click();
    await expect(page.getByText(noteText)).toBeVisible({ timeout: 10_000 });

    await prisma.project.delete({ where: { id: project.id } });
    await prisma.note.deleteMany({ where: { customerId: customer.id } });
    await prisma.customer.delete({ where: { id: customer.id } });
    await prisma.$disconnect();
  });

  test("deactivating a user takes effect immediately on their existing session", async ({
    browser,
  }) => {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    const bcrypt = (await import("bcryptjs")).default;
    const partner = await prisma.partner.create({ data: { name: `Deactivate Test ${Date.now()}` } });
    const email = `deactivate-e2e-${Date.now()}@example.com`;
    const password = "password123!";
    const user = await prisma.user.create({
      data: {
        name: "To Be Deactivated",
        email,
        passwordHash: await bcrypt.hash(password, 12),
        role: "PARTNER",
        partnerId: partner.id,
        active: true,
      },
    });

    // Partner logs in in their own browser context (separate cookie jar).
    const partnerContext = await browser.newContext();
    const partnerPage = await partnerContext.newPage();
    await partnerPage.goto("/admin/logga-in");
    await partnerPage.fill("#email", email);
    await partnerPage.fill("#password", password);
    await partnerPage.getByRole("button", { name: "Logga in" }).click();
    await partnerPage.waitForURL(/\/admin$/, { timeout: 10_000 });

    // Owner deactivates them from a separate context.
    const ownerContext = await browser.newContext();
    const ownerPage = await ownerContext.newPage();
    await loginAsOwner(ownerPage);
    await ownerPage.goto("/admin/installningar");
    await ownerPage
      .locator("tr", { hasText: email })
      .getByRole("button", { name: "Inaktivera" })
      .click();
    await expect(ownerPage.locator("tr", { hasText: email })).toContainText("Inaktiv");

    // The partner's existing session cookie is still there, but the next
    // admin page load must bounce them to login (architecture.md §5).
    await partnerPage.goto("/admin/leads");
    await expect(partnerPage).toHaveURL(/\/admin\/logga-in/, { timeout: 10_000 });

    await partnerContext.close();
    await ownerContext.close();
    await prisma.user.delete({ where: { id: user.id } });
    await prisma.partner.delete({ where: { id: partner.id } });
    await prisma.$disconnect();
  });
});
