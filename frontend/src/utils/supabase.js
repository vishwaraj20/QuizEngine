// Mock Supabase client to run the application completely offline on localhost
export const supabase = {
  auth: {
    signInWithPassword: async ({ email, password }) => {
      // Small artificial delay for realism
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const users = JSON.parse(localStorage.getItem('mock_registered_users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        return { data: { user: null }, error: new Error('Invalid email or password.') };
      }
      
      return {
        data: {
          user: {
            id: user.id,
            user_metadata: {
              role: user.role,
              full_name: user.full_name
            }
          }
        },
        error: null
      };
    },
    signUp: async ({ email, password, options }) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const users = JSON.parse(localStorage.getItem('mock_registered_users') || '[]');
      const existing = users.find(u => u.email === email);
      
      if (existing) {
        return { data: { user: null }, error: new Error('User already exists.') };
      }
      
      const newUser = {
        id: 'user_' + Math.random().toString(36).substring(2, 11),
        email,
        password,
        role: options?.data?.role || 'student',
        full_name: options?.data?.full_name || 'User'
      };
      
      users.push(newUser);
      localStorage.setItem('mock_registered_users', JSON.stringify(users));
      
      return {
        data: {
          user: {
            id: newUser.id,
            user_metadata: {
              role: newUser.role,
              full_name: newUser.full_name
            }
          }
        },
        error: null
      };
    },
    signOut: async () => {
      return { error: null };
    }
  }
};
