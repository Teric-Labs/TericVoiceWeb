import { auth } from '../components/firebaseConfig';
import { subscriptionAPI } from '../services/api';

function notifyCreditsGranted(starterCredits) {
  window.dispatchEvent(
    new CustomEvent('app-notification', {
      detail: {
        type: 'success',
        title: 'Free trial activated',
        message: `${starterCredits} starter credits have been added to your account.`,
      },
    })
  );
}

/**
 * Ensure the signed-in user exists in Firestore and has one-time starter credits.
 * Safe to call on every sign-in — the backend only grants credits once.
 */
export async function provisionUserAccount(firebaseUser, { notify = true } = {}) {
  if (!firebaseUser) return null;

  const idToken = await firebaseUser.getIdToken();
  const result = await subscriptionAPI.provisionAccount({
    id_token: idToken,
    user_id: firebaseUser.uid,
    email: firebaseUser.email || '',
    display_name: firebaseUser.displayName || '',
  });

  const existing = JSON.parse(localStorage.getItem('user') || '{}');
  const userData = {
    ...existing,
    username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || existing.username,
    userId: firebaseUser.uid,
    uid: firebaseUser.uid,
    email: firebaseUser.email || existing.email,
    balance: result?.balance ?? existing.balance,
  };
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('loginAt', Date.now().toString());

  if (notify && result?.credits_granted) {
    notifyCreditsGranted(result.starter_credits || 100);
  }

  return result;
}

/** Provision from localStorage user (fallback when Firebase session is restoring). */
export async function provisionStoredUser({ notify = false } = {}) {
  const firebaseUser = auth.currentUser;
  if (firebaseUser) {
    return provisionUserAccount(firebaseUser, { notify });
  }

  const stored = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = stored.uid || stored.userId;
  if (!userId) return null;

  const result = await subscriptionAPI.provisionAccount({
    user_id: userId,
    email: stored.email || '',
    display_name: stored.username || '',
  });

  if (result?.balance != null) {
    localStorage.setItem('user', JSON.stringify({ ...stored, balance: result.balance }));
  }
  if (notify && result?.credits_granted) {
    notifyCreditsGranted(result.starter_credits || 100);
  }
  return result;
}
