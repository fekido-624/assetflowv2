import { User } from './types';

// This is now only a session store to track the currently logged-in user in memory.
// All permanent data operations have been moved to Prisma Server Actions in src/lib/actions.ts.
class SessionStore {
  private currentUser: User | null = null;

  login(username: string, password?: string) {
    // Note: The actual validation is now done via Server Actions.
    // This local call is just to set the UI state.
    this.currentUser = { id: 0, username, role: username === 'admin' ? 'Admin' : 'User' };
    return true;
  }

  logout() {
    this.currentUser = null;
  }

  getCurrentUser() {
    return this.currentUser;
  }
}

export const store = new SessionStore();