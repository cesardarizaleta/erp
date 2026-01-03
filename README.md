# ERP Template

Una suite completa de gestión empresarial diseñada para pequeñas y medianas empresas. Gestiona inventarios, ventas, clientes y cobranzas de manera eficiente y moderna.

## 🚀 Características

- **Gestión de Inventario**: Controla productos, stock, categorías y alertas de stock bajo.
- **Ventas**: Registra ventas con detalles de productos, calcula totales automáticamente.
- **Clientes**: Mantén un registro completo de clientes con información de contacto.
- **Cobranza**: Gestiona pagos pendientes, fechas de vencimiento y estados de cobranza.
- **Dashboard**: Visualiza estadísticas clave con gráficos y reportes en tiempo real.
- **Autenticación**: Sistema seguro de login/registro con roles (admin, vendedor, cobrador).
- **Interfaz Moderna**: UI responsiva y amigable con Tailwind CSS y shadcn-ui.

## 🛠 Tecnologías Utilizadas

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **UI/UX**: Tailwind CSS, shadcn-ui, Lucide Icons
- **Estado y API**: Servicios desacoplados para fácil migración
- **Despliegue**: Compatible con Vercel, Netlify, o cualquier plataforma que soporte Vite

## 📦 Instalación

### Prerrequisitos

- Node.js 18+ y npm
- Cuenta en [Supabase](https://supabase.com)

### Pasos de Instalación

1. **Clona el repositorio**:

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd carbon-example-suite
   ```

2. **Instala dependencias**:

   ```bash
   npm install
   ```

3. **Personaliza tu aplicación (Opcional)**:
   Ejecuta el script de personalización para configurar tu nombre y colores:

   ```bash
   npm run customize -- --name="Mi Empresa ERP" --primary="210 100% 50%"
   ```

4. **Configura variables de entorno**:
   Crea un archivo `.env` en la raíz del proyecto con:

   ```env
   VITE_SUPABASE_PROJECT_ID=tu_project_id
   VITE_SUPABASE_PUBLISHABLE_KEY=tu_clave_anonima
   VITE_SUPABASE_URL=https://tu-project-id.supabase.co
   VITE_DATABASE_URL=postgresql://postgres:tu_password@db.tu-project-id.supabase.co:5432/postgres
   ```

5. **Configura Supabase**:
   - Crea un proyecto en Supabase.
   - Ejecuta el SQL para crear tablas (ver sección Configuración).
   - Obtén la clave anónima del dashboard de Supabase.

6. **Ejecuta el proyecto**:

   ```bash
   npm run dev
   ```

   Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

## 🎨 Personalización Automática

Esta aplicación está diseñada para ser utilizada como una plantilla ERP. Puedes personalizar el nombre de la empresa y los colores del sistema con un solo comando:

```bash
npm run customize -- --name="Nombre de tu Empresa" --primary="210 100% 50%" --accent="280 100% 50%"
```

### Parámetros:

- `--name`: El nombre de tu empresa/aplicación. Actualiza títulos, meta tags, pie de página y configuración.
- `--primary`: (Opcional) Color principal en formato **HSL** (ej. `210 100% 50%` para azul).
- `--accent`: (Opcional) Color de acento en formato **HSL** (ej. `280 100% 50%` para púrpura).

Este comando actualizará automáticamente:

- Configuración de la marca (`app-config.json`).
- Metadatos de SEO y PWA (`index.html`, `vite.config.ts`).
- Variables de color CSS (`index.css`).
- Nombre del proyecto en `package.json`.

## ⚙️ Configuración de Supabase

### Inicialización Completa (SQL)

Copia y pega el siguiente script en el **SQL Editor** de Supabase para inicializar todas las tablas, buckets de almacenamiento y políticas de seguridad necesarias:

```sql
-- ==========================================
-- 1. EXTENSIONES Y LIMPIEZA (OPCIONAL)
-- ==========================================
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 2. TABLAS PRINCIPALES
-- ==========================================

-- Tabla de Perfiles (Extensión de auth.users)
CREATE TABLE IF NOT EXISTS perfiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre VARCHAR(255),
    email VARCHAR(255),
    telefono VARCHAR(20),
    avatar_url TEXT,
    role VARCHAR(20) CHECK (role IN ('admin', 'vendedor', 'cobrador')) DEFAULT 'vendedor',
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para clientes
CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telefono VARCHAR(20),
    direccion TEXT,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tabla para inventario (productos)
CREATE TABLE IF NOT EXISTS inventario (
    id SERIAL PRIMARY KEY,
    nombre_producto VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL, -- USD
    precio_bs DECIMAL(10, 2),       -- VES
    stock INTEGER NOT NULL DEFAULT 0,
    peso DECIMAL(10, 2),            -- kg
    categoria VARCHAR(100),
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para ventas
CREATE TABLE IF NOT EXISTS ventas (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES clientes(id) ON DELETE SET NULL,
    fecha_venta TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total DECIMAL(10, 2) NOT NULL,    -- USD
    total_bs DECIMAL(10, 2),          -- VES
    tasa_cambio_aplicada DECIMAL(10, 2),
    estado VARCHAR(50) DEFAULT 'completada',
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tabla para items de venta
CREATE TABLE IF NOT EXISTS venta_items (
    id SERIAL PRIMARY KEY,
    venta_id INTEGER REFERENCES ventas(id) ON DELETE CASCADE,
    producto_id INTEGER REFERENCES inventario(id) ON DELETE SET NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    precio_unitario_bs DECIMAL(10, 2),
    subtotal DECIMAL(10, 2) NOT NULL,
    subtotal_bs DECIMAL(10, 2)
);

-- Tabla para cobranza
CREATE TABLE IF NOT EXISTS cobranza (
    id SERIAL PRIMARY KEY,
    venta_id INTEGER REFERENCES ventas(id) ON DELETE CASCADE,
    monto_pendiente DECIMAL(10, 2) NOT NULL,
    monto_pendiente_bs DECIMAL(10, 2),
    fecha_vencimiento DATE,
    estado VARCHAR(50) DEFAULT 'pendiente',
    notas TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para gastos
CREATE TABLE IF NOT EXISTS gastos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fecha_gasto DATE NOT NULL DEFAULT CURRENT_DATE,
    descripcion TEXT NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    moneda VARCHAR(3) DEFAULT 'USD',
    beneficiario VARCHAR(255),
    referencia VARCHAR(100),
    metodo_pago VARCHAR(50),
    estado VARCHAR(50) DEFAULT 'pendiente',
    notas TEXT,
    comprobante_url TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para logs del sistema
CREATE TABLE IF NOT EXISTS logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    table_name VARCHAR(100),
    operation VARCHAR(20),
    record_id TEXT,
    query_text TEXT,
    session_id TEXT,
    execution_time_ms INTEGER,
    metadata JSONB
);

-- Tablas de Configuración
CREATE TABLE IF NOT EXISTS configuracion_empresa (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    nombre_empresa VARCHAR(255),
    rif_nit VARCHAR(50),
    telefono VARCHAR(50),
    email VARCHAR(255),
    direccion TEXT,
    logo_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS configuracion_notificaciones (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    stock_bajo BOOLEAN DEFAULT TRUE,
    facturas_vencidas BOOLEAN DEFAULT TRUE,
    nuevas_ventas BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 3. ÍNDICES PARA RENDIMIENTO
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_perfiles_role ON perfiles(role);
CREATE INDEX IF NOT EXISTS idx_clientes_user_id ON clientes(user_id);
CREATE INDEX IF NOT EXISTS idx_inventario_user_id ON inventario(user_id);
CREATE INDEX IF NOT EXISTS idx_ventas_user_id ON ventas(user_id);
CREATE INDEX IF NOT EXISTS idx_ventas_cliente_id ON ventas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_venta_items_venta_id ON venta_items(venta_id);
CREATE INDEX IF NOT EXISTS idx_cobranza_venta_id ON cobranza(venta_id);
CREATE INDEX IF NOT EXISTS idx_gastos_user_id ON gastos(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_logs_user_id ON logs(user_id);

-- ==========================================
-- 4. SEGURIDAD (RLS)
-- ==========================================

-- Habilitar RLS en todas las tablas
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventario ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE venta_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cobranza ENABLE ROW LEVEL SECURITY;
ALTER TABLE gastos ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion_empresa ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion_notificaciones ENABLE ROW LEVEL SECURITY;

-- Políticas genéricas: Solo el dueño puede ver/editar sus datos
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN SELECT table_name FROM information_schema.tables
             WHERE table_schema = 'public'
             AND table_name IN ('perfiles', 'clientes', 'inventario', 'ventas', 'venta_items', 'cobranza', 'gastos', 'logs', 'configuracion_empresa', 'configuracion_notificaciones')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Users can only access their own data" ON %I', t);
        IF t = 'perfiles' THEN
            EXECUTE format('CREATE POLICY "Users can only access their own data" ON %I FOR ALL USING (id = auth.uid())', t);
        ELSE
            EXECUTE format('CREATE POLICY "Users can only access their own data" ON %I FOR ALL USING (user_id = auth.uid())', t);
        END IF;
    END LOOP;
END $$;

-- ==========================================
-- 5. STORAGE BUCKETS
-- ==========================================

-- Crear buckets de almacenamiento
INSERT INTO storage.buckets (id, name, public)
VALUES ('comprobantes', 'comprobantes', true),
       ('logos', 'logos', true),
       ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas para Storage
-- Permitir acceso público a los archivos en buckets públicos
CREATE POLICY "Acceso público" ON storage.objects FOR SELECT USING (bucket_id IN ('comprobantes', 'logos', 'avatars'));

-- Permitir a usuarios autenticados subir archivos a sus carpetas
CREATE POLICY "Usuarios pueden subir archivos" ON storage.objects FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND
    (bucket_id IN ('comprobantes', 'logos', 'avatars'))
);

-- ==========================================
-- 6. TRIGGERS (OPCIONAL)
-- ==========================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger a tablas con updated_at
CREATE TRIGGER update_perfiles_modtime BEFORE UPDATE ON perfiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventario_modtime BEFORE UPDATE ON inventario FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cobranza_modtime BEFORE UPDATE ON cobranza FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gastos_modtime BEFORE UPDATE ON gastos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_config_empresa_modtime BEFORE UPDATE ON configuracion_empresa FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.perfiles (id, nombre, email, role)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'nombre', NEW.email, 'vendedor');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Configurar Seguridad (Manual)

- Ve a **Authentication > Policies** en Supabase.
- Verifica que las políticas RLS se hayan creado correctamente.

### Generar Tipos

- Una vez creadas las tablas, ve a **Settings > API > Generate types** para actualizar los tipos TypeScript.

## 📖 Uso

### Navegación

- **Dashboard**: Vista general con estadísticas.
- **Inventario**: Agrega/edita productos.
- **Ventas**: Registra nuevas ventas.
- **Clientes**: Gestiona base de clientes.
- **Cobranza**: Monitorea pagos pendientes.
- **Configuración**: Ajustes del sistema.

### API Services

Los servicios están desacoplados para fácil migración:

- `clienteService`: CRUD de clientes.
- `inventarioService`: Gestión de productos.
- `ventaService`: Operaciones de ventas.
- `cobranzaService`: Manejo de cobranzas.
- `authService`: Autenticación.

Ejemplo de uso:

```typescript
import { clienteService } from "@/services";

const clientes = await clienteService.getClientes();
```

## 🛠 Desarrollo

### Formateo de Código

Este proyecto utiliza **Prettier** para mantener un estilo de código consistente.

```bash
# Formatear todos los archivos
npm run format

# Verificar formato sin modificar archivos
npm run format:check
```

### Linting

Usamos ESLint integrado con Prettier para mantener la calidad del código.

```bash
# Ejecutar linting
npm run lint
```

### Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Vista previa de la build de producción
- `npm run lint` - Ejecuta ESLint
- `npm run format` - Formatea el código con Prettier
- `npm run format:check` - Verifica el formato del código

## 🤝 Contribución

1. Fork el proyecto.
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`).
3. Commit tus cambios (`git commit -m 'Agrega nueva funcionalidad'`).
4. Push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

Para preguntas o soporte, contacta al equipo de desarrollo.

---

¡Gracias por usar Carbon EXAMPLE Suite! 🚀
