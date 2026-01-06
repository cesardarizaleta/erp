# Guía para Contribuidores

¡Gracias por tu interés en contribuir a este proyecto! Valoramos todas las formas de contribución, desde reportar bugs hasta proponer nuevas características y enviar pull requests.

## Cómo Contribuir

### Reportar Bugs

Si encuentras un bug, por favor:

1. Verifica que no haya un issue abierto similar en [Issues](https://github.com/[tu-usuario]/[tu-repo]/issues).
2. Abre un nuevo issue con:
   - Una descripción clara del problema
   - Pasos para reproducirlo
   - Información sobre tu entorno (navegador, OS, versión de Node.js, etc.)
   - Capturas de pantalla si es relevante

### Sugerir Características

Para sugerir nuevas características:

1. Abre un issue con la etiqueta "enhancement"
2. Describe la característica propuesta
3. Explica por qué sería útil
4. Si es posible, incluye mockups o ejemplos

### Contribuir Código

Para contribuir con código:

1. **Fork** el repositorio
2. **Clona** tu fork: `git clone https://github.com/[tu-usuario]/[tu-repo].git`
3. **Crea una rama** para tu contribución: `git checkout -b feature/nueva-caracteristica`
4. **Instala dependencias**: `npm install` o `bun install`
5. **Realiza tus cambios** siguiendo las mejores prácticas del proyecto
6. **Ejecuta tests**: `npm run test` o `bun run test`
7. **Verifica linting**: `npm run lint` o `bun run lint`
8. **Haz commit** de tus cambios: `git commit -m "Descripción clara del cambio"`
9. **Push** a tu rama: `git push origin feature/nueva-caracteristica`
10. **Abre un Pull Request** en GitHub

### Estándares de Código

- Sigue el estilo de código establecido (ESLint + Prettier)
- Usa TypeScript estrictamente
- Escribe tests para nuevas funcionalidades
- Mantén la cobertura de tests
- Documenta cambios significativos

### Commits

Usa mensajes de commit descriptivos en inglés o español, siguiendo el formato:

```
tipo: descripción breve

Descripción más detallada si es necesario.
```

Tipos comunes:

- `feat`: nueva característica
- `fix`: corrección de bug
- `docs`: cambios en documentación
- `style`: cambios de estilo (formateo, etc.)
- `refactor`: refactorización de código
- `test`: agregar o modificar tests
- `chore`: cambios en herramientas, configuración, etc.

### Pull Requests

- Describe claramente qué hace el PR
- Referencia issues relacionados
- Asegúrate de que todos los checks de CI pasen
- Mantén el PR pequeño y enfocado en una sola cosa

### Configuración del Entorno de Desarrollo

1. Instala Node.js (versión 18+)
2. Instala Bun (opcional, pero recomendado): `curl -fsSL https://bun.sh/install | bash`
3. Clona el repo
4. Instala dependencias: `bun install`
5. Copia `.env.example` a `.env` y configura variables
6. Ejecuta: `bun run dev`

### Tests

- Ejecuta `bun run test` para tests unitarios
- Ejecuta `bun run test:e2e` para tests end-to-end
- Asegúrate de que todos los tests pasen antes de enviar un PR

### Documentación

- Actualiza README.md si agregas nuevas características
- Documenta APIs nuevas
- Mantén la documentación actualizada

## Preguntas

Si tienes preguntas, abre un issue con la etiqueta "question" o contacta a los mantenedores.

¡Gracias por contribuir! 🎉
