#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const params = {};

args.forEach(arg => {
  if (arg.startsWith("--")) {
    const [key, value] = arg.split("=");
    params[key.replace("--", "")] = value;
  }
});

if (!params.name) {
  console.error("Uso: node scripts/customize.cjs --name=\"Mi Empresa\" [--primary=\"50 100% 50%\"] [--accent=\"0 85% 55%\"]");
  process.exit(1);
}

const appName = params.name;
const primaryColor = params.primary || "50 100% 50%"; // Default yellow-ish
const accentColor = params.accent || "0 85% 55%";   // Default red-ish

console.log(`🚀 Personalizando aplicación para: ${appName}`);

// 1. Actualizar src/config/app-config.json
const configPath = path.join(__dirname, "..", "src", "config", "app-config.json");
if (fs.existsSync(configPath)) {
  let config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  config.BRAND.NAME = appName;
  config.BRAND.SHORT_NAME = appName;
  config.BRAND.FOOTER_TEXT = `Sistema de gestión empresarial • ${appName} © ${new Date().getFullYear()}`;
  config.NAME = appName;
  config.DESCRIPTION = `Sistema de gestión para ${appName}`;
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log("✅ src/config/app-config.json actualizado");
}

// 2. Actualizar index.html
const htmlPath = path.join(__dirname, "..", "index.html");
if (fs.existsSync(htmlPath)) {
  let html = fs.readFileSync(htmlPath, "utf8");
  html = html.replace(/<title>.*?<\/title>/, `<title>${appName} - Sistema de Gestión<\/title>`);
  html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="Sistema de gestión integral para ${appName} - Inventario, Ventas, Clientes y Cobranza" \/>`);
  html = html.replace(/<meta name="author" content=".*?" \/>/, `<meta name="author" content="${appName}" \/>`);
  html = html.replace(/<meta name="apple-mobile-web-app-title" content=".*?" \/>/, `<meta name="apple-mobile-web-app-title" content="${appName}" \/>`);
  html = html.replace(/<meta property="og:site_name" content=".*?" \/>/, `<meta property="og:site_name" content="${appName}" \/>`);
  html = html.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${appName} - Sistema de Gestión" \/>`);
  html = html.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="Sistema de gestión integral para ${appName} - Inventario, Ventas, Clientes y Cobranza" \/>`);
  html = html.replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${appName} - Sistema de Gestión" \/>`);
  html = html.replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="Sistema de gestión integral para ${appName}" \/>`);
  fs.writeFileSync(htmlPath, html);
  console.log("✅ index.html actualizado");
}

// 3. Actualizar package.json
const pkgPath = path.join(__dirname, "..", "package.json");
if (fs.existsSync(pkgPath)) {
  let pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  pkg.name = appName.toLowerCase().replace(/\s+/g, "-");
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  console.log("✅ package.json actualizado");
}

// 4. Actualizar vite.config.ts
const viteConfigPath = path.join(__dirname, "..", "vite.config.ts");
if (fs.existsSync(viteConfigPath)) {
  let viteConfig = fs.readFileSync(viteConfigPath, "utf8");
  viteConfig = viteConfig.replace(/name: ".*?"/g, `name: "${appName} - Sistema de Gestión"`);
  viteConfig = viteConfig.replace(/short_name: ".*?"/g, `short_name: "${appName}"`);
  viteConfig = viteConfig.replace(/description: ".*?"/g, `description: "Sistema de gestión integral para ${appName} - Inventario, Ventas, Clientes y Cobranza"`);
  fs.writeFileSync(viteConfigPath, viteConfig);
  console.log("✅ vite.config.ts actualizado");
}

// 5. Actualizar src/index.css (Colores)
const cssPath = path.join(__dirname, "..", "src", "index.css");
if (fs.existsSync(cssPath)) {
  let css = fs.readFileSync(cssPath, "utf8");
  
  // Reemplazar variables de color en :root
  css = css.replace(/--primary: .*?;/g, `--primary: ${primaryColor};`);
  css = css.replace(/--ring: .*?;/g, `--ring: ${primaryColor};`);
  css = css.replace(/--sidebar-primary: .*?;/g, `--sidebar-primary: ${primaryColor};`);
  css = css.replace(/--sidebar-ring: .*?;/g, `--sidebar-ring: ${primaryColor};`);
  css = css.replace(/--chart-1: .*?;/g, `--chart-1: ${primaryColor};`);
  
  css = css.replace(/--accent: .*?;/g, `--accent: ${accentColor};`);
  css = css.replace(/--chart-2: .*?;/g, `--chart-2: ${accentColor};`);

  fs.writeFileSync(cssPath, css);
  console.log("✅ src/index.css actualizado con nuevos colores");
}

console.log(`\n✨ ¡Personalización completada! La aplicación ahora se llama "${appName}".`);
console.log(`🎨 Colores aplicados: Primary(${primaryColor}), Accent(${accentColor})`);
