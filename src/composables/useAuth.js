import { ref } from 'vue';
import axios from 'axios';

const isLoggedIn = ref(false);
const user = ref(null);

const login = async (email, password) => {
  try {
    const response = await axios.post('/api/auth/login', email, password);

    user.value = response.data.user;
    isLoggedIn.value = true;

    localStorage.setItem('token', response.data.accessToken);

    return true;
  } catch (error) {
    console.log('Sikertelen belépés', error);
    return false;
  }
};

const logout = async () => {
  try {
    await axios.post('/api/auth/logout');
    isLoggedIn.value = false;
    user.value = null;

    localStorage.removeItem('token');
  } catch (error) {
    console.log('Sikertelen kijelentkezés', error);
  }
};

export default {
  isLoggedIn,
  user,
  login,
  logout,
};