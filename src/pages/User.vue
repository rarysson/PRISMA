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
          :class="{ empty: !user_input.name }"
          type="text"
          v-model="user_input.name"
          required
        />
        <label for="user-name">Nome</label>
      </div>
      <div class="input-container">
        <input
          id="user-email"
          :class="{ empty: !user_input.email }"
          type="email"
          v-model="user_input.email"
          required
        />
        <label for="user-email">Email</label>
      </div>
      <div class="input-container">
        <input
          id="user-old-password"
          :class="{ empty: !user_input.old_password }"
          type="password"
          v-model="user_input.old_password"
          required
        />
        <label for="user-old-password">Senha</label>
      </div>
      <div class="input-container">
        <input
          id="user-password"
          :class="{ empty: !user_input.password }"
          type="password"
          v-model="user_input.password"
          required
        />
        <label for="user-password">Nova senha</label>
      </div>
      <div class="input-container">
        <input
          id="user-password-check"
          :class="{ empty: !user_input.password_check }"
          type="password"
          v-model="user_input.password_check"
          required
        />
        <label for="user-password-check">Confirme a senha</label>
      </div>

      <button type="submit">Atualizar</button>
      <button class="danger" type="button" @click="delete_user">Excluir</button>
      <button type="button" @click="$router.go(-1)">
        Cancelar
      </button>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import api from "@/util/api";

export default {
  name: "User",

  data() {
    return {
      user_input: {
        name: "",
        old_email: "",
        email: "",
        old_password: "",
        password: "",
        password_check: ""
      }
    };
  },

  beforeMount() {
    this.user_input.name = this.user.name;
    this.user_input.email = this.user.email;
    this.user_input.old_email = this.user.email;

    if (!this.user_logged) {
      this.$router.replace("/");
    }
  },

  computed: {
    ...mapGetters(["user", "user_logged"])
  },

  methods: {
    ...mapActions(["log_out", "set_user"]),

    async send_form() {
      try {
        const response = await api.post("/login", {
          email: this.user_input.old_email,
          password: this.user_input.old_password
        });

        if (response.data) {
          if (this.user_input.password !== this.user_input.password_check) {
            this.$toast.error(
              "Senha de confimação não bate com a senha digitada"
            );
          } else {
            delete this.user_input.old_email;
            delete this.user_input.old_password;
            delete this.user_input.password_check;

            await api.put(`/${this.user.id}`, this.user_input);
            this.set_user({
              name: this.user_input.name,
              email: this.user_input.email,
              id: this.user.id
            });
            this.$toast.success("Usuário atualizado");
            this.$router.replace("/");
          }
        } else {
          this.$toast.error("A senha antiga não confere!");
        }
      } catch (e) {
        this.$toast.error(e.message);
      }
    },

    async delete_user() {
      try {
        await api.delete(`/${this.user.id}`);
        this.log_out();
        this.$toast.success("Usuário excluido");
        this.$router.replace("/");
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

.danger {
  margin: 15px 0;
  border-color: var(--danger);
  background-color: var(--danger);
}

.danger:hover {
  color: var(--danger);
}
</style>
