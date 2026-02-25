import { useAuth } from '../context/AuthContext';

/**
 * Returns whether the current user has access to the Tunisian job marketplace.
 *
 * Access is granted when:
 *   - The user is logged in AND
 *   - Their registered country is "Tunisia" (case-insensitive)
 *   OR
 *   - Their role is "admin" (always has full access)
 *
 * This is the single source of truth for marketplace eligibility.
 * Import this hook in any job-related page or component.
 */
export function useTunisianAccess() {
    const { user, isAuthenticated } = useAuth();

    const hasAccess =
        isAuthenticated &&
        (user?.role === 'admin' ||
            user?.country?.toLowerCase() === 'tunisia');

    return { hasAccess, isAuthenticated, user };
}
