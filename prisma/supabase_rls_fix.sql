-- Script para solucionar errores de seguridad / Linter en Supabase (RLS & Sensitive Columns Exposed)
-- Ejecutar en el SQL Editor de Supabase: https://supabase.com/dashboard/project/_/sql

-- Habilitar RLS (Row Level Security) en todas las tablas del esquema público
ALTER TABLE IF EXISTS public."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Template" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Invitation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."GuestPass" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Rsvp" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."FinanceCategory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."FinanceRecord" ENABLE ROW LEVEL SECURITY;

-- Explicación:
-- Al habilitar RLS sin definir políticas públicas (policies), Supabase bloquea 
-- por completo el acceso público a través de su API REST (PostgREST), 
-- resolviendo los 7 errores de RLS y la exposición de columnas sensibles (password/email).
--
-- Como tu app utiliza Prisma en Next.js (Server Components / API Routes), 
-- Prisma se conecta con las credenciales de la base de datos (usuario postgres), 
-- por lo que ignora el RLS y tu app seguirá funcionando exactamente igual sin interrupciones.
