import { ref } from "vue";
import Cookies from "js-cookie";

const isLoggedIn = ref(false);

if (Cookies.get("user") != null && Cookies.get("token") != null) {
  isLoggedIn.value = true;
}

const user = ref(null);

export default {
  isLoggedIn,
  user,
};
