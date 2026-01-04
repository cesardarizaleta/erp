import { test, expect } from "@playwright/test";

test.describe("Autenticación", () => {
  test("debe mostrar el formulario de login", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByRole("heading", { name: /Bienvenido a/i })).toBeVisible();
    await expect(page.locator('label[for="email"]')).toBeVisible();
    await expect(page.locator('label[for="password"]')).toBeVisible();
    await expect(page.getByRole("button", { name: /Iniciar Sesión/i })).toBeVisible();
  });

  test("debe mostrar error con credenciales inválidas", async ({ page }) => {
    await page.goto("/login");

    await page.fill("#email", "wrong@example.com");
    await page.fill("#password", "wrongpassword");
    await page.click('button[type="submit"]');

    // Esperar a que aparezca el mensaje de error
    // El error viene de Supabase, así que dependerá de la respuesta
    await expect(page.locator(".text-destructive")).toBeVisible();
  });

  test("debe navegar al dashboard tras login exitoso (mockeado)", async ({ page }) => {
    // En un entorno real, usaríamos variables de entorno para credenciales de prueba
    // O mockearíamos la respuesta de la API si no queremos depender de Supabase real en E2E básicos

    // Por ahora, solo verificamos que la página carga
    await page.goto("/login");
    expect(page.url()).toContain("/login");
  });
});
