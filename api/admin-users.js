export default async function handler(req, res) {
  const { createClient } = await import('@supabase/supabase-js');

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  if (req.method === 'GET') {
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ users: data.users });
  }

  if (req.method === 'POST') {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ user: data.user });
  }

  if (req.method === 'DELETE') {
    const { userId } = req.body;
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
