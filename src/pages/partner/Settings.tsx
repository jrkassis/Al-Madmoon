import { useEffect, useState } from 'react';
import { DashboardLayout } from '../dashboards/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

export default function PartnerSettings() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [paypal, setPaypal] = useState('');
  const [initialName, setInitialName] = useState('');
  const [initialEmail, setInitialEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const PAYPAL_SETTINGS_KEY_PREFIX = 'partner_paypal_email:';

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);
        setSaveMessage(null);

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!user) throw new Error('You must be signed in.');

        const profileQuery = await supabase
          .from('users')
          .select('full_name, email')
          .eq('id', user.id)
          .maybeSingle();
        if (profileQuery.error) throw profileQuery.error;

        const profile = profileQuery.data as { full_name?: string | null; email?: string | null } | null;
        const loadedName = profile?.full_name ?? '';
        const loadedEmail = profile?.email ?? user.email ?? '';
        setName(loadedName);
        setEmail(loadedEmail);
        setInitialName(loadedName);
        setInitialEmail(loadedEmail);

        const { data: paypalSetting, error: paypalError } = await supabase
          .from('app_settings')
          .select('value')
          .eq('key', `${PAYPAL_SETTINGS_KEY_PREFIX}${user.id}`)
          .maybeSingle();
        if (paypalError) throw paypalError;

        setPaypal(String(paypalSetting?.value ?? ''));
      } catch (e: any) {
        setErrorMessage(e?.message ?? 'Failed to load settings.');
      } finally {
        setLoading(false);
      }
    };

    void loadSettings();
  }, []);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      setErrorMessage('Please fill in all required fields.');
      setSaveMessage(null);
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage(null);
      setSaveMessage(null);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('You must be signed in.');

      const trimmedName = name.trim();
      const trimmedEmail = email.trim();

      const profileUpdate = await supabase
        .from('users')
        .update({ full_name: trimmedName, email: trimmedEmail })
        .eq('id', user.id);
      if (profileUpdate.error) throw profileUpdate.error;

      if ((user.email ?? '') !== trimmedEmail) {
        const { error: emailUpdateError } = await supabase.auth.updateUser({ email: trimmedEmail });
        if (emailUpdateError) throw emailUpdateError;
      }

      if (password.trim()) {
        const { error: passwordUpdateError } = await supabase.auth.updateUser({ password: password.trim() });
        if (passwordUpdateError) throw passwordUpdateError;
      }

      setPassword('');
      setInitialName(trimmedName);
      setInitialEmail(trimmedEmail);
      setSaveMessage('Settings saved successfully.');
    } catch (e: any) {
      setErrorMessage(e?.message ?? 'Could not save settings.');
    } finally {
      setSubmitting(false);
    }
  };

  const hasChanges =
    name.trim() !== initialName.trim() || email.trim() !== initialEmail.trim() || password.trim().length > 0;

  return (
    <DashboardLayout role="partner">
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="mb-6 text-center text-2xl font-bold text-slate-900">Settings</h1>

        <div className="glass-panel p-6">
          {errorMessage && <div className="mb-4 text-sm font-medium text-red-600">{errorMessage}</div>}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSave();
            }}
            className="space-y-6"
          >
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading || submitting}
                className="w-full rounded-full border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || submitting}
                className="w-full rounded-full border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>

            <div>
              <label htmlFor="paypal" className="mb-1 block text-sm font-medium text-slate-700">
                PayPal Email (for withdrawals)
              </label>
              <input
                type="email"
                id="paypal"
                value={paypal}
                disabled
                className="w-full rounded-full border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>
   

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
                New Password (leave blank to keep current)
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || submitting}
                className="w-full rounded-full border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>

            {saveMessage && (
              <p className="text-sm font-medium text-slate-700" role="status">
                {saveMessage}
              </p>
            )}

            <div className="pt-2 text-center">
              <Button
                type="submit"
                variant="primary"
                disabled={loading || submitting || !hasChanges || !name.trim() || !email.trim()}
              >
                {loading ? 'Loading...' : submitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}