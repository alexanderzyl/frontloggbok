export const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token || token === 'undefined') {
        // Redirect to login if no token
        window.location.href = '/';
        return;
    }
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };
}