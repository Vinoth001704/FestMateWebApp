import api from './api';

export async function getRegistrations() {
  // returns raw response from API
  return api.get('/api/registerEvent/get');
}

export async function getRegistrationCountForUser(userId) {
  if (!userId) return 0;
  try {
    const data = await getRegistrations();
    // normalize list
    const list = Array.isArray(data) ? data : (data.registrations || data.items || data.data || []);

    return list.filter((it) => {
      // support multiple possible shapes
      if (!it) return false;
      if (it.user_id && String(it.user_id) === String(userId)) return true;
      if (it.userId && String(it.userId) === String(userId)) return true;
      if (it.registeredBy && String(it.registeredBy) === String(userId)) return true;
      if (it.user && (String(it.user._id) === String(userId) || String(it.user.id) === String(userId))) return true;
      return false;
    }).length;
  } catch (err) {
    console.error('Failed to get registrations', err);
    return 0;
  }
}

export default { getRegistrations, getRegistrationCountForUser };
