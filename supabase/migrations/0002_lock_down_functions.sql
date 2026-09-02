-- Internal helper functions must not be callable through the REST RPC endpoint.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
grant execute on function public.handle_new_user() to supabase_auth_admin;

revoke execute on function public.school_for_email(text) from public, anon, authenticated;
revoke execute on function public.is_allowed_email(text) from public, anon, authenticated;
