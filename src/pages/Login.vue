<template>
  <div class="page-wrapper">
    <form @submit.prevent="send_form">
      <img
        class="logo"
        src="@/assets/logo.svg"
        alt="prisma logo"
        width="50"
        height="50"
      />

      <div class="input-container">
        <input
          id="user-email"
          :class="{ empty: !user.email }"
          type="email"
          v-model="user.email"
          required
        />
        <label for="user-email">Email</label>
      </div>
      <div class="input-container">
        <input
          id="user-password"
          :class="{ empty: !user.password }"
          type="password"
          v-model="user.password"
          required
        />
        <label for="user-password">Senha</label>
      </div>

      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import api from "@/util/api";

export default {
  name: "Login",

  data() {
    return {
      user: {
        email: "",
        password: ""
      }
    };
  },

  methods: {
    ...mapActions(["set_user", "log_in"]),

    async send_form() {
      try {
        const response = await api.post("/login", this.user);
        const data = response.data;

        if (data) {
          this.log_in();
          this.set_user(data);
          this.$toast.success("Usuário logado");
          this.$router.replace("/");
        } else {
          this.$toast.error("Credenciais incorretas");
        }
      } catch (e) {
        this.$toast.error(e.message);
      }
    }
  }
};
</script>

<style scoped>
.page-wrapper {
  width: 100vw;
  height: 100vh;
  display: grid;
  place-items: center;
}

form {
  padding: 20px;
  width: 350px;
  border: 2px solid black;
  border-radius: 10px;
}

.logo {
  display: block;
  margin: 0 auto 20px;
}

.input-container {
  position: relative;
  margin-bottom: 30px;
}

label {
  position: absolute;
  top: 50%;
  left: 10px;
  font-size: 1.2rem;
  font-weight: bold;
  color: gray;
  transform: translateY(-50%);
  transition: all 250ms;
}

input {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
}

input:focus + label,
input:valid + label,
input:not(.empty):invalid + label {
  font-size: 1rem;
  color: var(--dark);
  transform: translateY(-200%);
}

input:not(.empty):invalid + label {
  color: var(--danger);
}

button {
  width: 100%;
  padding: 10px 20px;
  border-radius: 5px;
  border: 1px solid var(--dark);
  color: var(--light);
  background-color: var(--dark);
}

button:hover {
  color: var(--dark);
  background-color: var(--light);
}
</style>
