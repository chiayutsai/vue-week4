export default {
  props: {
    pages: {
      type: Object,
    },
  },
  methods: {
    emitPage(page) {
      this.$emit('emit-page', page)
    },
  },
  template: `  <nav aria-label="Page navigation example">
  <ul v-if="pages.total_pages !== 1" class="pagination">
    <li class="page-item" :class="{'disabled': !pages.has_pre}"><a class="page-link" href="#" @click.prevent="emitPage">&laquo;</a></li>
    <li class="page-item" :class="{'disabled': !pages.has_pre}">
      <a class="page-link" href="#" @click.prevent="emitPage(pages.current_page - 1)"
        ><span class="material-icons align-text-bottom text-base"> chevron_left </span>
      </a>
    </li>
    <li v-for="(page,key) in pages.total_pages" class="page-item" :class="{'active': key+1 == pages.current_page}" :key='"page" + key'>
      <a class="page-link" href="#" @click.prevent="emitPage(key+1)">{{key + 1}}</a>
    </li>

    <li class="page-item" :class="{'disabled': !pages.has_next}">
      <a class="page-link" href="#" @click.prevent="emitPage(pages.current_page +1)"
        ><span class="material-icons align-text-bottom text-base"> chevron_right </span></a
      >
    </li>
    <li class="page-item" :class="{'disabled': !pages.has_next}">
      <a class="page-link" href="#" @click.prevent="emitPage(pages.total_pages)">&raquo;</a>
    </li>
  </ul>
</nav>`,
}
