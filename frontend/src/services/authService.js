export const authService = {
    async register(email, password) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const users = JSON.parse(localStorage.getItem('edu_users') || '[]');

        if (users.find(u => u.email === email)) {
            return { error: { message: "User already exists with this email" } };
        }

        // First user ever registered becomes admin and is automatically approved
        const isFirstUser = users.length === 0;
        
        const newUser = { 
            id: Date.now().toString(), 
            email, 
            password,
            role: isFirstUser ? 'admin' : 'user',
            status: isFirstUser ? 'approved' : 'pending',
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('edu_users', JSON.stringify(users));

        return { data: { user: newUser }, error: null };
    },

    async login(email, password) {
        await new Promise(resolve => setTimeout(resolve, 500));

        const users = JSON.parse(localStorage.getItem('edu_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            return { error: { message: "Invalid email or password" } };
        }

        if (user.status === 'pending') {
            return { error: { message: "Your registration is pending admin approval. Please wait for the administrator to approve your account." } };
        }

        if (user.status === 'rejected') {
            return { error: { message: "Your registration request has been rejected. Please contact the administrator." } };
        }

        localStorage.setItem('edu_session', JSON.stringify({ user, isLoggedIn: true }));
        // Dispatch an event so other tabs/components can listen
        window.dispatchEvent(new Event('authChange'));

        return { data: { session: { user } }, error: null };
    },

    async logout() {
        await new Promise(resolve => setTimeout(resolve, 300));
        localStorage.removeItem('edu_session');
        window.dispatchEvent(new Event('authChange'));
        return { error: null };
    },

    async getSession() {
        // Return immediately for checking
        const sessionStr = localStorage.getItem('edu_session');
        if (!sessionStr) {
            return { data: { session: null }, error: null };
        }

        try {
            const session = JSON.parse(sessionStr);
            return { data: { session }, error: null };
        } catch {
            return { data: { session: null }, error: null };
        }
    },

    async getPendingUsers() {
        await new Promise(resolve => setTimeout(resolve, 300));
        const users = JSON.parse(localStorage.getItem('edu_users') || '[]');
        return { data: users.filter(u => u.status === 'pending'), error: null };
    },

    async approveUser(userId) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const users = JSON.parse(localStorage.getItem('edu_users') || '[]');
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex !== -1) {
            users[userIndex].status = 'approved';
            localStorage.setItem('edu_users', JSON.stringify(users));
            return { error: null };
        }
        return { error: { message: "User not found" } };
    },

    async rejectUser(userId) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const users = JSON.parse(localStorage.getItem('edu_users') || '[]');
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex !== -1) {
            users[userIndex].status = 'rejected';
            localStorage.setItem('edu_users', JSON.stringify(users));
            return { error: null };
        }
        return { error: { message: "User not found" } };
    },

    onAuthStateChange(callback) {
        // Provide a simple event listener mimic
        const handleAuthChange = () => {
            this.getSession().then(({ data: { session } }) => {
                callback('SIGNED_CHANGE', session);
            });
        };

        window.addEventListener('authChange', handleAuthChange);
        // Also listen to cross-tab changes
        window.addEventListener('storage', (e) => {
            if (e.key === 'edu_session') {
                handleAuthChange();
            }
        });

        return {
            data: {
                subscription: {
                    unsubscribe: () => {
                        window.removeEventListener('authChange', handleAuthChange);
                    }
                }
            }
        };
    }
};

