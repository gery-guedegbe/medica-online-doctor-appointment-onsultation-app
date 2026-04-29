-- ============================================================
-- MIGRATION: Corriger la récursion infinie dans les politiques RLS
-- de la table users
--
-- PROBLÈME: La politique admin_can_view_all_users faisait une
-- subquery sur users elle-même → infinite recursion (code 42P17)
--
-- SOLUTION: Fonction SECURITY DEFINER qui s'exécute avec les
-- droits élevés et bypass le RLS lors de la vérification du rôle
-- ============================================================

-- Supprimer la politique récursive
DROP POLICY IF EXISTS admin_can_view_all_users ON users;

-- Créer une fonction SECURITY DEFINER pour lire le rôle sans récursion
-- SECURITY DEFINER = s'exécute avec les droits du créateur (bypass RLS)
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$;

-- Recréer la politique admin sans récursion
CREATE POLICY admin_can_view_all_users
ON users FOR SELECT
USING (public.get_my_role() = 'admin');

-- Politique admin pour INSERT (créer des docteurs, etc.)
DROP POLICY IF EXISTS admin_can_insert_users ON users;
CREATE POLICY admin_can_insert_users
ON users FOR INSERT
WITH CHECK (public.get_my_role() = 'admin');

-- Politique admin pour UPDATE (modifier les rôles, etc.)
DROP POLICY IF EXISTS admin_can_update_users ON users;
CREATE POLICY admin_can_update_users
ON users FOR UPDATE
USING (public.get_my_role() = 'admin');
