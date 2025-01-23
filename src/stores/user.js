import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const useUserStore = defineStore("user", () => {
    const email = ref("");
    function setEmail(data) {
        email.value = data;
    }
    const isLogin = computed(function () {
        if (email.value != null && email.value != "") {
            return true;
        } else {
            return false;
        }
    })
    return {
        email,
        setEmail,
        isLogin,
    }
},
    {
        persist: {
            storage: sessionStorage, path: ["email"]
        }
    });
export default useUserStore;