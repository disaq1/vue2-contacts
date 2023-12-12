<template>
  <div class="auth">
    <h1>
      Авторизация
    </h1>
    <div>
      <label>
        <input type="radio" :value="{name: 'админ', value: 'admin'}" v-model="user">
        Admin
      </label>
      <label>
        <input type="radio" :value="{name: 'пользователь', value: 'user'}" v-model="user">
        User
      </label>
    </div>
    <button
      :disabled="!user.value"
      class="auth__button button"
      @click="doAuthorization()"
    >
      Войти как {{ user.name || '...' }}
    </button>
  </div>
</template>
<script setup>
// немного функционала на composition api
import { ref } from 'vue'
import { useRouter } from 'vue-router/composables'

const router = useRouter()

const user = ref({})

const doAuthorization = () => {
  localStorage.setItem('role', user.value.value)
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
    margin: 32px 0 0;
    max-width: 320px;
    width: 100%;
  }
}
</style>