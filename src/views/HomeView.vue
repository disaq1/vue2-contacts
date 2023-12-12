<template>
  <div class="home">
    <div class="home__header">
      <button class="button" @click="updateUsersStore()">Update</button>
      <div
          :class="['toggle-button', tableStyle === 'line' ? 'toggle-button--line' : 'toggle-button--tile']"
          @click="toggleTableStyle()"
      >
        <span class="toggle-button__item" />
        <span class="toggle-button__item" />
        <span class="toggle-button__item" />
        <span class="toggle-button__item" />
      </div>
      <button class="button" @click="logout()">Выйти</button>
    </div>
    <div class="mt-3">
      <div>Сортировка</div>
      <button class="button" @click="sortByIncreasing()">отAдоZ</button>
      <button class="button" @click="sortByDecreasing()">отZдоA</button>
      <button class="button" @click="resetSort()">Изначальный порядок</button>
    </div>
    <div v-if="role === 'admin'" class="mt-3">
      <div>Фильтрация</div>
      <label for="byName">
        По имени
        <input
          v-model="$store.state.searchByName"
          id="byName"
          type="text"
        />
      </label>
      <label for="byGender">
        По гендеру
        <input
          v-model="$store.state.searchByGender"
          id="byGender"
          type="text"
        />
      </label>
      <label for="byNationality">
        По национальности
        <input
          v-model="$store.state.searchByNationality"
          id="byNationality"
          type="text"
        />
      </label>
    </div>
    <div :class="['mt-3 users', tableStyle === 'line' ? 'users--line' : 'users--tile']">
      <div class="users__header">
        <div class="users__table-header">
          <p>Avatar</p>
          <p>Fullname</p>
          <p>Birthday</p>
          <p>Email</p>
          <p>Phone</p>
          <p>Location</p>
          <p>Nationality</p>
        </div>
      </div>
      <div v-if="getDataLoadingStatus" class="mt-3">
        Loading
      </div>
      <div v-else-if="searchedUsers.length" class="mt-3 users__clients">
        <div v-for="(user, index) in searchedUsers" :key="`${user.id.value}-${index}`" class="user-wrapper">
          <div v-if="index !==0" class="divider"/>
          <UserCard :user="user"/>
        </div>
        <div>
          <div>
            Кол-во элементов
            <select v-model="pagination.perPage">
              <option>5</option>
              <option>10</option>
              <option>20</option>
            </select>
          </div>
          <div>
            Страница
            <select v-model="pagination.currentPage">
              <option v-for="item in pagesCount">{{ item }}</option>
            </select>
          </div>
        </div>
      </div>
      <div v-else>
        Список пуст
      </div>
      <div v-if="!getDataLoadingStatus" class="home__statistic statistic">
        <div>{{ getUsers.length }} - размер коллекции</div>
        <div>{{ maleUsersLength }} - кол-во мужчин, {{ femaleUsersLength }} - женщин и {{ noGenderUsersLength }} неопределившихся</div>
        <div>{{ whichGenderIsMore }} - вывести кого больше</div>
        <div>- кол-во контактов по каждой национальности
          <div v-for="item in usersByNationality" :key="item.nationality">{{ item }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import UserCard from '@/components/UserCard.vue'

export default {
  name: 'home',
  components: { UserCard },
  data() {
    return {
      pagination: {
        perPage: 10,
        currentPage: 1,
      },
      role: localStorage.getItem('role'),
      tableStyle: localStorage.getItem('tableStyle') || 'line',
    }
  },
  watch: {
    'pagination.perPage'() {
      this.pagination.currentPage = 1
      this.displayList(this.pagination)
    },
    'pagination.currentPage'() {
      this.displayList(this.pagination)
    },
  },
  computed: {
    ...mapGetters(['searchedUsers', 'getDataLoadingStatus', 'getPaginatedUsers', 'getUsers']),
    pagesCount() { // число страниц в пагинации
      return Math.ceil(this.getUsers.length / this.pagination.perPage)
    },
    maleUsersLength() { // число пользователей муж. гендера
      return this.getUsers.filter(item => item.gender === 'male').length
    },
    femaleUsersLength() { // число пользователей жен. гендера
      return this.getUsers.filter(item => item.gender === 'female').length
    },
    noGenderUsersLength() { // число пользователей неопр. гендера
      return this.getUsers.filter(item => (item.gender !== 'male' && item.gender !== 'female')).length
    },
    whichGenderIsMore() { // вывод "кого больше"
      return this.maleUsersLength > this.femaleUsersLength 
          ? `Муж. больше на ${this.maleUsersLength - this.femaleUsersLength}` 
          : `Жен. больше на ${this.femaleUsersLength - this.maleUsersLength}`
    },
    usersByNationality() { // вывод количества пользователей по национальности
      const allNationality = this.getUsers.map(item => item.nat)
      const uniqCollection = new Set(allNationality)
      const resultArray = []

      for (let i = 0; i < [...uniqCollection].length; i++) {
        const length = this.getUsers.filter(item => item.nat === [...uniqCollection][i]).length
        resultArray.push({
          nationality: [...uniqCollection][i],
          count: length,
        })
      }

      return resultArray
    },
  },
  async mounted() {
    if (!localStorage.getItem('tableStyle')) localStorage.setItem('tableStyle', 'line')

    await this.updateUsersStore()
    this.displayList(this.pagination)
  },
  methods: {
    ...mapActions(['fetchUsers']),
    ...mapMutations(['sortByIncreasing', 'sortByDecreasing', 'resetSort', 'updateSearchByName', 'updateSearchByGender', 'updateSearchByNationality', 'displayList']),
    logout() {
      localStorage.clear()
      this.$router.push('/auth')
    },
    toggleTableStyle() { // тоггл стиля таблицы
      this.tableStyle = this.tableStyle === 'tile' ? 'line' : 'tile'
      localStorage.setItem('tableStyle', this.tableStyle === 'tile' ? 'tile' : 'line')
    },
    async updateUsersStore() { // функция обновления списка пользователей
      this.pagination = {
        perPage: 10,
        currentPage: 1,
      }
      await this.fetchUsers()
    },
    formatDate(date) { // форматирование даты
      if (!date) return ''

      const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        weekday: 'short',
        timezone: 'UTC',
        hour: 'numeric',
        minute: 'numeric',
      }

      return new Date(date).toLocaleString('en-US', options)
    },
  },
}
</script>

<style lang="scss">
.home {
  max-width: 2520px;
  margin: 60px auto 0;
  padding: 8px;
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.users--tile .users {

  &__table-header {
    display: none;
  }
  &__clients {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;

    @media screen and (max-width: 900px){
      grid-template-columns: repeat(2, 1fr);
    }
    @media screen and (max-width: 600px){
      grid-template-columns: 1fr;
    }
  }
}

.users--line .users {
  position: relative;

  &__header {
    position: sticky;
    top: 0;
    border: 1px solid red;
    border-radius: 8px;
    background: white;
  }
  &__table-header {
    display: grid;
    grid-template-columns: 150px 1fr 250px 1fr 150px 1fr 100px;
    padding: 12px;
    color: white;
    background: red;

    @media screen and (max-width: 1200px){
      display: none;
    }
  }
  &__clients {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 12px 0 0;
  }
}

.users--line .divider {
  width: 100%;
  height: 2px;
  background: blue;
  margin: 0 4px;
}
.toggle-button {
  position: relative;
  width: 40px;
  height: 40px;
  background: red;
}
.toggle-button--line {
  & .toggle-button__item {
    position: absolute;
    background: blue;
    &:nth-child(1) {
      width: 30px;
      height: 5px;
      top: 5px;
      left: 5px;
    }
    &:nth-child(2) {
      width: 30px;
      height: 5px;
      top: 50%;
      left: 5px;
      transform: translateY(-50%);
    }
    &:nth-child(3) {
      width: 30px;
      height: 5px;
      bottom: 5px;
      left: 5px;
    }
    &:nth-child(4) {
      display: none;
    }
  }
}
.toggle-button--tile {
  & .toggle-button__item {
    position: absolute;
    background: green;
    &:nth-child(1) {
      width: 10px;
      height: 10px;
      top: 5px;
      left: 5px;
    }
    &:nth-child(2) {
      width: 10px;
      height: 10px;
      top: 5px;
      right: 5px;
    }
    &:nth-child(3) {
      width: 10px;
      height: 10px;
      bottom: 5px;
      left: 5px;
    }
    &:nth-child(4) {
      width: 10px;
      height: 10px;
      bottom: 5px;
      right: 5px;
    }
  }
}
</style>
