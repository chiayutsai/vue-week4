import 'https://unpkg.com/mitt/dist/mitt.umd.js'

import pagination from './pagination.js'
const apiUrl = 'https://vue3-course-api.hexschool.io/'
const apiPath = 'chiayu'
const emitter = mitt()
let productModal = null
let delModal = null

const loading = {
  template: `#loading`,
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
}
const productModalComponent = {
  props: {
    isAdd: {
      type: Boolean,
      default: false,
    },

    tempProduct: {
      type: Object,
    },
    productsCategory: {
      type: Array,
      default: [],
    },
    isUploads: {
      type: Array,
    },
    pages: {
      type: Object,
    },
  },
  data() {
    return {
      isAddCategory: false,
      tempCategory: '',
      isUpload: false,
    }
  },
  template: '#productModal',
  methods: {
    addCategory() {
      this.productsCategory.push(this.tempCategory)
      alert(`新增${this.tempCategory}分類`)
      this.tempCategory = ''
      this.isAddCategory = false
    },
    uploadImage(key, e) {
      const file = e.target.files[0]

      const formData = new FormData()
      formData.append('file-to-upload', file)
      if (key === 'main') {
        this.isUpload = true
      } else {
        this.isUploads[key] = true
      }
      axios.post(`${apiUrl}api/${apiPath}/admin/upload`, formData).then((res) => {
        console.log(res)
        if (res.data.success) {
          if (key === 'main') {
            this.tempProduct.imageUrl = res.data.imageUrl
            this.isUpload = false
          } else {
            this.tempProduct.imagesUrl[key] = res.data.imageUrl
            this.isUploads[key] = false
          }
        }
      })
    },
    deleteImage(id) {
      this.tempProduct.imagesUrl.splice(id, 1)
      this.isUploads.pop()
    },
    createImage() {
      if (this.tempProduct.imagesUrl == undefined) {
        this.tempProduct.imagesUrl = []
      }
      this.tempProduct.imagesUrl.push('')
      this.isUploads.push(false)
    },
    emitUpdate(tempProduct) {
      this.$emit('emit-update', tempProduct)
    },
  },
  mounted() {
    productModal = new bootstrap.Modal(document.getElementById('productModal'))
  },
}
const deleteModal = {
  props: {
    tempProduct: {
      type: Object,
    },
    pages: {
      type: Object,
    },
  },
  template: '#deleteModal',
  mounted() {
    delModal = new bootstrap.Modal(document.getElementById('deleteModal'))
  },
  methods: {
    deleteProduct() {
      axios
        .delete(`${apiUrl}api/${apiPath}/admin/product/${this.tempProduct.id}`)
        .then((res) => {
          console.log(res)
          if (res.data.success) {
            alert(res.data.message)
            delModal.hide()
            this.$emit('delete', this.pages.current_page)
          } else {
            alert(res.data.message)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
}
const app = {
  data() {
    return {
      isLoading: false,
      isAdd: false,
      isOpen: {
        id: null,
        open: false,
      },
      isUploads: [],
      products: [],
      totalAmount: '',
      productsCategory: [],
      pagination: {},
      totalAmount: 0,
      tempProduct: {
        imagesUrl: [],
      },
    }
  },

  methods: {
    checkUser() {
      axios
        .post(`${apiUrl}api/user/check`)
        .then((res) => {
          console.log(res)
          if (res.data.success) {
            this.getData()
          } else {
            alert('驗證錯誤，請重新登入')
            window.location = 'index.html'
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getData(page = 1) {
      this.isLoading = true
      axios
        .get(`${apiUrl}api/${apiPath}/admin/products?page=${page}`)
        .then((res) => {
          console.log(res)
          this.isLoading = false
          if (res.data.success) {
            this.products = res.data.products
            this.pagination = res.data.pagination
          } else {
            alert(res.data.messages)
          }
        })
        .catch((err) => {
          console.log(err)
        })
      axios
        .get(`${apiUrl}api/${apiPath}/admin/products/all`)
        .then((res) => {
          if (res.data.success) {
            let productsAll = Object.values(res.data.products)
            this.totalAmount = productsAll.length
            productsAll.forEach((product) => {
              if (!this.productsCategory.includes(product.category)) {
                this.productsCategory.push(product.category)
              }
            })
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    openCollapse(id) {
      if (this.isOpen.id == id) {
        this.isOpen.open = !this.isOpen.open
      } else {
        this.isOpen.id = id
        this.isOpen.open = true
      }

      let collapseElementList = [].slice.call(document.querySelectorAll('.collapse'))
      let collapseList = collapseElementList.map((collapseEl, key) => {
        if (key == id) {
          return new bootstrap.Collapse(collapseEl, { toggle: false }).toggle()
        } else {
          return new bootstrap.Collapse(collapseEl, { toggle: false }).hide()
        }
      })
    },
    openModal(type, item) {
      if (type === 'add') {
        this.tempProduct = {
          imagesUrl: [],
        }
        this.isAdd = true
        this.isUploads = []
        productModal.show()
      } else if (type === 'edit') {
        this.tempProduct = {
          ...item,
          imagesUrl: item.imagesUrl == undefined ? [] : [...item.imagesUrl],
        }
        this.isAdd = false
        this.isUploads = new Array(this.tempProduct.imagesUrl.length).fill(false)
        productModal.show()
      } else if (type === 'delete') {
        this.tempProduct = { ...item }
        delModal.show()
      }
    },
    changeStatus(item) {
      this.tempProduct = {
        ...item,
      }
      this.updateProduct(this.tempProduct)
    },
    updateProduct(tempProduct) {
      let data = {
        data: tempProduct,
      }

      let api = `${apiUrl}api/${apiPath}/admin/product`
      let apiMethod = 'post'
      let page = 1
      if (!this.isAdd) {
        api = `${apiUrl}api/${apiPath}/admin/product/${this.tempProduct.id}`
        apiMethod = 'put'
        page = this.pagination.current_page
      }
      axios[apiMethod](api, data)
        .then((res) => {
          console.log(res)
          if (res.data.success) {
            alert(res.data.message)
            productModal.hide()
            this.getData(page)
          } else {
            alert(res.data.message)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
  created() {
    const cookieToken = document.cookie.replace(/(?:(?:^|.*;\s*)chiayuToken\s*\=\s*([^;]*).*$)|^.*$/, '$1')
    axios.defaults.headers.common['Authorization'] = cookieToken

    this.checkUser()
    this.isLoading = true
  },

  components: {
    loading,
    pagination,
    productModalComponent,
    deleteModal,
  },
}

Vue.createApp(app).mount('#app')
