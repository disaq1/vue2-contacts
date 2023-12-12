import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    unsortedUsers: [],
    users: [],
    isDataLoading: false,
    searchByName: '',
    searchByGender: '',
    searchByNationality: '',
    paginatedUsers: [],
  },
  getters: {
    getUsers(state) { // возвращает всех полученных в запросе пользователей
      return state.users
    },
    getPaginatedUsers(state) { // возвращает выбранное кол-во (по стандарту 10) пользователей на заданной странице
      return state.paginatedUsers
    },
    getDataLoadingStatus(state) { // возвращает стейт загрузки (пока идёт запрос на странице можно выводить условный скелетон (ну иил просто слово loading))
      return state.isDataLoading
    },
    searchedUsers(state) { // поиск по всем пользователям, используя фильтрацию по Имени (user.name.first), Гендеру (male or female), Национальности (user.nat)
      if (!state.searchByName && !state.searchByGender && !state.searchByNationality) return state.paginatedUsers
      return state.users.filter(item => {
        if (item.name.first.toLowerCase().includes(state.searchByName.toLowerCase())) return item
      }).filter(item => {
        if (item.gender.toLowerCase().startsWith(state.searchByGender.toLowerCase())) return item
      }).filter(item => {
        if (item.nat.toLowerCase().includes(state.searchByNationality.toLowerCase())) return item
      })
    },
  },
  mutations: {
    displayList(state, options) { // осуществление пагинации (просто режем общий список пользователей и его присваиваем paginatedUsers)
      const start = Number(options.perPage) * (Number(options.currentPage) - 1)
      const end = start + Number(options.perPage)
      state.paginatedUsers = state.users.slice(start, end)
    },
    setUsers(state, users) { // присваивание полученных данных соответствующим полям
      state.users = users
      state.unsortedUsers = users
    },
    changeDataLoadingStatus(state) { // тоггл статуса загрузки
      state.isDataLoading = !state.isDataLoading
    },
    sortByIncreasing(state) { // сортировка отAдоZ
      const sortingArray = JSON.parse(JSON.stringify(state.users))

      state.paginatedUsers = sortingArray.sort(function (a, b) {
        const currentName = a.name.first.toLowerCase()
        const nextName = b.name.first.toLowerCase()
        return currentName.localeCompare(nextName)
      })
    },
    sortByDecreasing(state) { // сортировка отZдоA
      const sortingArray = JSON.parse(JSON.stringify(state.users))

      state.paginatedUsers = sortingArray.sort(function (a, b) {
        const currentName = a.name.first.toLowerCase()
        const nextName = b.name.first.toLowerCase()
        return nextName.localeCompare(currentName)
      })
    },
    resetSort(state) { // сброс сортировки
      state.paginatedUsers = state.unsortedUsers
    },
  },
  actions: {
    async fetchUsers(context, data = { count: 200, page: 1 }) { // запрос списка пользователей
      try {
        context.commit('changeDataLoadingStatus')
        const response = await axios(`https://randomuser.me/api/?results=${data.count}&page=${data.page}`)
        context.commit('setUsers', response.data.results)
      } catch (error) {
        console.error(error)
      } finally {
        context.commit('changeDataLoadingStatus')
      }
    },
  },
})
