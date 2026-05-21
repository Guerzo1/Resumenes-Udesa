# UdeSA Resumenes

Aplicacion web real en Next.js para que estudiantes de la Universidad de San Andres suban, busquen y compartan PDFs de estudio.

## Stack

- Next.js 14 con App Router
- React + TypeScript
- TailwindCSS
- Supabase Database + Storage
- Deploy optimizado para Vercel

## Importante

Este proyecto no se abre con un archivo HTML. Es una aplicacion Next.js y debe ejecutarse con el servidor de desarrollo o desplegarse en Vercel.

## Configuracion local

1. Instalar dependencias:

```bash
npm install
```

En Windows PowerShell, si `npm` esta bloqueado por execution policy, usar:

```bash
npm.cmd install
```

2. Crear un archivo `.env.local` en la raiz del proyecto:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

El cliente de Supabase esta configurado en:

```text
lib/supabase/client.ts
lib/supabase/server.ts
```

y usa:

```ts
process.env.NEXT_PUBLIC_SUPABASE_URL
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
```

3. En Supabase, abrir SQL Editor y ejecutar:

```text
supabase/schema.sql
```

Ese script crea la tabla `documents`, indices, politicas RLS, bucket publico `documents`, limite de 12 MB y funcion para contar descargas.

4. Iniciar el proyecto:

```bash
npm run dev
```

En Windows:

```bash
npm.cmd run dev
```

La app queda disponible en:

```text
http://localhost:3000
```

## Deploy en Vercel

1. Subir el proyecto a GitHub.
2. Importar el repositorio en Vercel.
3. Agregar `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en `Project Settings > Environment Variables`.
4. Deploy con framework preset `Next.js`.

## Estructura

- `app/`: rutas, paginas y API routes.
- `components/`: componentes de interfaz.
- `hooks/`: logica cliente reutilizable.
- `lib/`: Supabase, tipos y consultas.
- `utils/`: sanitizacion, formato y validacion de archivos.
- `styles/`: estilos globales.
- `supabase/`: SQL de base de datos y Storage.

## Seguridad basica incluida

- Validacion de campos requeridos.
- Sanitizacion simple contra caracteres HTML en inputs.
- Solo PDFs por MIME type o extension.
- Limite de archivo de 12 MB en frontend y Supabase Storage.
- RLS habilitado para lectura y subida publica sin login.

Para produccion real con mucho trafico conviene sumar moderacion, rate limiting y revision de contenido reportado.
