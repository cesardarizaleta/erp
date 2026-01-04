export default function (plop) {
  plop.setGenerator("feature", {
    description: "Generar una nueva funcionalidad (feature)",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Nombre de la funcionalidad (ej. productos):",
      },
    ],
    actions: [
      {
        type: "addMany",
        destination: "src/features/{{lowerCase name}}",
        base: "templates/feature",
        templateFiles: "templates/feature/**/*",
        globOptions: { dot: true },
      },
      {
        type: "modify",
        path: "src/services/index.ts",
        pattern: /$/,
        template:
          'export { {{lowerCase name}}Service } from "@/features/{{lowerCase name}}/services/{{lowerCase name}}Service";\n',
      },
      {
        type: "modify",
        path: "src/features/index.ts",
        pattern: /$/,
        template: 'export * from "./{{lowerCase name}}";\n',
      },
    ],
  });
}
