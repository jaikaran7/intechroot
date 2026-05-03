import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,         // { id, email, name, role }
      role: null,         // 'super_admin' | 'admin' | 'ADMIN' | 'employee' | 'applicant'
      accessToken: null,
      applicationId: null, // For applicant role
      employeeId: null,    // For employee role

      setAuth: ({ user, role, accessToken, applicationId, employeeId }) => {
        localStorage.setItem('access_token', accessToken);
        if (role) {
          localStorage.setItem('role', role);
        } else {
          localStorage.removeItem('role');
        }
        set({ user, role, accessToken, applicationId: applicationId || null, employeeId: employeeId || null });
      },

      setAccessToken: (accessToken) => {
        localStorage.setItem('access_token', accessToken);
        set({ accessToken });
      },

      clearAuth: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('role');
        localStorage.removeItem('intech_auth');
        set({ user: null, role: null, accessToken: null, applicationId: null, employeeId: null });
      },

      isAuthenticated: () => !!get().accessToken,
      isAdmin: () => ['admin', 'ADMIN', 'super_admin'].includes(get().role),
      isEmployee: () => get().role === 'employee',
      isApplicant: () => get().role === 'applicant',
    }),
    {
      name: 'intech_auth',
      partialize: (state) => ({
        user: state.user,
        role: state.role,
        accessToken: state.accessToken,
        applicationId: state.applicationId,
        employeeId: state.employeeId,
      }),
    }
  )
);
