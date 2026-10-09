/**
 * Authentication Service for Maanak Drishti
 * Manages client-side authentication states for Inspector and Consumer roles.
 *
 * GOVERNMENT-ADMINISTERED INSPECTOR ACCOUNT MODEL:
 * 1. An authorized government administrator creates inspector accounts centrally.
 * 2. The system assigns a unique Inspector ID and records the inspector's registered official email.
 * 3. The inspector receives access credentials through an approved secure administrative process.
 * 4. The inspector logs in using Inspector ID, Registered Email, and Password.
 * 5. Self-registration is strictly prohibited for the Inspector Portal.
 *
 * For prototype and judging demonstration, verified DEMO credentials are provided.
 * In production, validation connects to FastAPI with bcrypt hashing, JWT tokens, and RBAC.
 */

const STORAGE_KEY_USER = 'maanak_drishti_user';

// Authorized demonstration credentials for prototype judging
export const DEMO_INSPECTOR_CREDENTIALS = {
  inspectorId: 'INS-DEMO-001',
  email: 'inspector.demo@example.com',
  password: 'Demo@12345',
  name: 'Field Officer (Demo Account)',
  designation: 'Legal Metrology Compliance Inspector',
};

export const authService = {
  /**
   * Inspector Login: Validates Inspector ID, Registered Email, and Password together.
   * Inspectors cannot self-register. Accounts are government-administered.
   * @param {{ inspectorId: string, email: string, password: string, rememberMe?: boolean }} credentials
   */
  loginInspector: async ({ inspectorId, email, password, rememberMe = false }) => {
    // Simulated realistic verification latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (!inspectorId || !inspectorId.trim()) {
      throw new Error('Inspector ID is required.');
    }
    if (!email || !email.trim()) {
      throw new Error('Registered Email address is required.');
    }
    if (!password) {
      throw new Error('Password is required.');
    }

    const cleanId = inspectorId.trim().toUpperCase();
    const cleanEmail = email.trim().toLowerCase();

    // Verify against authorized prototype credentials
    if (
      cleanId === DEMO_INSPECTOR_CREDENTIALS.inspectorId &&
      cleanEmail === DEMO_INSPECTOR_CREDENTIALS.email.toLowerCase() &&
      password === DEMO_INSPECTOR_CREDENTIALS.password
    ) {
      // Create session without storing plaintext password
      const user = {
        inspectorId: DEMO_INSPECTOR_CREDENTIALS.inspectorId,
        email: DEMO_INSPECTOR_CREDENTIALS.email,
        name: DEMO_INSPECTOR_CREDENTIALS.name,
        designation: DEMO_INSPECTOR_CREDENTIALS.designation,
        role: 'inspector',
        isDemoAccount: true,
        authenticatedAt: new Date().toISOString(),
      };

      if (typeof window !== 'undefined') {
        const storage = rememberMe ? window.localStorage : window.sessionStorage;
        storage?.setItem(STORAGE_KEY_USER, JSON.stringify(user));
        if (rememberMe) {
          window.sessionStorage?.removeItem(STORAGE_KEY_USER);
        } else {
          window.localStorage?.removeItem(STORAGE_KEY_USER);
        }
      }

      return user;
    }

    throw new Error(
      'Invalid Inspector ID, registered email, or password. Please verify the credentials provided by your department or use the demonstration credentials panel.'
    );
  },

  /**
   * Consumer Login (Unchanged)
   * @param {string} email
   * @param {string} password
   */
  loginConsumer: async (email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (!email || !password) {
      throw new Error('Please provide both email and password.');
    }

    const user = {
      email,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      role: 'consumer',
      authenticatedAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      window.localStorage?.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    }
    return user;
  },

  /**
   * Consumer Sign Up (Self-registration supported for public citizens)
   * @param {{ name: string, email: string, password: string }} data
   */
  signupConsumer: async ({ name, email, password }) => {
    await new Promise((resolve) => setTimeout(resolve, 700));

    if (!name || !email || !password) {
      throw new Error('All fields are required.');
    }

    const user = {
      name,
      email,
      role: 'consumer',
      authenticatedAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      window.localStorage?.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    }
    return user;
  },

  /**
   * Generic login for backward compatibility
   */
  login: async (role, email, password) => {
    if (role === 'consumer') {
      return authService.loginConsumer(email, password);
    }
    return authService.loginInspector({ inspectorId: '', email, password });
  },

  /**
   * Log out current user from all client storages
   */
  logout: () => {
    if (typeof window !== 'undefined') {
      window.localStorage?.removeItem(STORAGE_KEY_USER);
      window.sessionStorage?.removeItem(STORAGE_KEY_USER);
    }
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: () => {
    if (typeof window === 'undefined') return null;
    try {
      const sessionData = window.sessionStorage?.getItem(STORAGE_KEY_USER);
      if (sessionData) return JSON.parse(sessionData);

      const localData = window.localStorage?.getItem(STORAGE_KEY_USER);
      return localData ? JSON.parse(localData) : null;
    } catch {
      return null;
    }
  },

  /**
   * Verify if a user is authenticated for a specific role
   * @param {'inspector' | 'consumer'} role
   */
  isAuthenticated: (role) => {
    const user = authService.getCurrentUser();
    if (!user) return false;
    return user.role === role;
  },
};
