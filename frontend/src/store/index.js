import { createStore } from 'vuex'
import { authAPI } from '@/utils/api'

export default createStore({
  state: {
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user')) || null,
    isGuest: false
  },
  
  getters: {
    isAuthenticated: state => !!state.token || state.isGuest,
    currentUser: state => state.user,
    isGuest: state => state.isGuest,
    canAccess: state => (feature) => {
      if (state.isGuest) {
        // 游客只能访问资料广场
        return feature === 'square'
      }
      return !!state.token
    }
  },
  
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    SET_USER(state, user) {
      state.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    SET_GUEST(state, isGuest) {
      state.isGuest = isGuest
    },
    CLEAR_AUTH(state) {
      state.token = ''
      state.user = null
      state.isGuest = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  },
  
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await authAPI.login(credentials)
        const { token, user } = response.data
        commit('SET_TOKEN', token)
        commit('SET_USER', user)
        return response
      } catch (error) {
        commit('CLEAR_AUTH')
        throw error
      }
    },
    
    async register({ commit }, userData) {
      try {
        const response = await authAPI.register(userData)
        const { token, user } = response.data
        commit('SET_TOKEN', token)
        commit('SET_USER', user)
        return response
      } catch (error) {
        commit('CLEAR_AUTH')
        throw error
      }
    },
    
    async logout({ commit }) {
      try {
        await authAPI.logout()
      } finally {
        commit('CLEAR_AUTH')
      }
    }
  }
})
