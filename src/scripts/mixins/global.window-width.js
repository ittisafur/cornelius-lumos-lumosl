import { mapActions } from 'vuex'
import _ from '../helpers/lo';
const types = { WINDOW_WIDTH: 'WindowWidth' };

export default {
  data () {
    return {
      env: process.env.NODE_ENV
    }
  },
  created: function () {
    window.addEventListener('resize', this.handleResize(this))
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleResize(this))
  },
  methods: {
    ...mapActions({
      [types.WINDOW_WIDTH]: `window-width/${types.WINDOW_WIDTH}`,
    }),
    handleResize: (vm) => {
      return _.debounce(() => {
        if ( vm.$store !== undefined ) vm[types.WINDOW_WIDTH]()
      }, 500)
    }
  }
}