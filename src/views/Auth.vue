<template>
  <div class="auth">
    <h1>
      Авторизация
    </h1>
    <div>
      <label>
        <input type="radio" value="admin" v-model="client">
        Admin
      </label>
      <label>
        <input type="radio" value="user" v-model="client">
        User
      </label>
    </div>
    <button
      :disabled="!client"
      class="mt-8 auth__button button"
      @click="doAuthorization()"
    >
      Войти как {{ client || '...' }}
    </button>
  </div>
</template>
<script setup>
// немного функционала на composition api
import { ref } from 'vue'
import { useRouter } from 'vue-router/composables'

const router = useRouter()

const client = ref('')

const doAuthorization = () => {
  localStorage.setItem('role', client.value)
  router.push('/')
}
</script>

<style lang="scss">
.auth {
  max-width: 500px;
  width: 100%;
  margin: 150px auto;
  padding: 16px;
  border: 1px solid red;
  border-radius: 8px;

  &__button {
    max-width: 320px;
    width: 100%;
  }
}
</style>