import { ref } from "vue";
import axios from "axios";

export default function useUser() {
  const url = "http://localhost:8000/api/users";
  const userData = ref([]);
  const error = ref(null);

  const getAllUser = async () => {
    userData.value = [];
    error.value = null;
    try {
      const res = await axios(url);
      userData.value = res.data;
    } catch (err) {
      error.value = err;
    }
  };

  return {
    userData,
    error,
    getAllUser,
  };
}
