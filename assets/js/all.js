const app = {
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/admin/signin',
      user: {
        username: '',
        password: '',
      },
    }
  },
  methods: {
    login() {
      if (this.user.username === '' || this.user.password === '') {
        alert('請輸入帳號密碼')
        return
      }
      axios
        .post(this.apiUrl, this.user)
        .then((res) => {
          console.log(res)
          if (res.data.success) {
            const { token, expired } = res.data
            document.cookie = `chiayuToken=${token}; expires=${new Date(expired)}`
            this.user.username = ''
            this.user.password = ''
            window.location = 'backstage.html'
          } else {
            alert(`登入失敗: ${res.data.error.message}`)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
}
Vue.createApp(app).mount('#app')
