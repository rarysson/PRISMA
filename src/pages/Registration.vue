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
          id="user-name"
          :class="{ empty: !user.name }"
          type="text"
          v-model="user.name"
          required
        />
        <label for="user-name">Nome</label>
      </div>
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
      <div class="input-container">
        <input
          id="user-password-check"
          :class="{ empty: !user.password_check }"
          type="password"
          v-model="user.password_check"
          required
        />
        <label for="user-password-check">Confirme a senha</label>
      </div>

      <button type="submit">Cadastrar</button>
    </form>
  </div>
</template>

<script>
import api from "@/util/api";

export default {
  name: "Registration",

  data() {
    return {
      user: {
        name: "",
        email: "",
        password: "",
        password_check: ""
      }
    };
  },

  methods: {
    async send_form() {
      if (this.user.password !== this.user.password_check) {
        this.$toast.error("Senha de confimação não bate com a senha digitada");
      } else {
        try {
          await api.post("", this.user);
          this.$router.replace("/");
        } catch (e) {
          this.$toast.error(e.message);
        }
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
