<script>
import RsSection from '../render/rs-section.vue';
export default {
  name: "RsSectionsContainer",
  components: { RsSection },
  props: {
    sections: {
      type: String,
      default: ""
    }
  },
  data: function () {
    return {
      topOffset: 200,
      observer: undefined,
      observerOptions: {},
      intersecting: {},
      refs: []
    }
  },
  computed: {
    formattedSections: function () {
      // return this.sections.reduce((a, s) => { let section = JSON.parse(s); a = { ...a, ...{ [section.section_header]: section} }; return a; }, {});
      return JSON.parse(this.sections).reduce((a, s) => { let section = JSON.parse(s); a = { ...a, ...{ [section.section_header]: section} }; return a; }, {});
    }
  },
  created: function () {},
  beforeMount: function () {
    this.topOffset = document.getElementById('header') ? document.getElementById('header').offsetHeight + 60 : 200;
    this.observerOptions = {
      root: null, // document.getElementById('scrollArea'),
      rootMargin: `-${this.topOffset}px 0px 0px 0px`,
      threshold: [...Array(100).keys()].map(x => x / 100)
    };
  },
  mounted: function () {
    this.intersecting = Object.keys(this.formattedSections).reduce((a, i) => { a[this.slugify(i)] = false; return a; }, {});
    let observer = new IntersectionObserver(this.handleIntersection, this.observerOptions);
    this.refs = Array.from(document.querySelectorAll('[data-section]'));
    for (let el of this.refs) {
      observer.observe(el);
    }
    this.observer = observer;
  },
  beforeDestroy: function () {
    this.observer.disconnect();
  },
  methods: {
    handleIntersection: function (entries) {
      entries.forEach(entry => {
        // console.log(entry.target.dataset.section, entry.intersectionRatio, entry.intersectionRect, entry.boundingClientRect);
        // if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
        // if (entry.intersectionRatio < 1 && entry.boundingClientRect.top < entry.intersectionRect.top) {
        if (entry.intersectionRatio <= 1 && entry.intersectionRatio > 0 && entry.boundingClientRect.top > 0 && entry.boundingClientRect.top <= entry.intersectionRect.top) {
          for (let key in this.intersecting) {
            if (key === entry.target.dataset.section) {
              this.$set(this.intersecting, entry.target.dataset.section, true );
            } else {
              this.$set(this.intersecting, key, false );
            }
          }
        }
      });
    },
    slugify: function (string) {
      return this.$options.filters.slugify(string);
    },
    scrollTo: function (top=0, set=null) {
      const self = this;
      const fixedOffset = top.toFixed();
      const onScroll = function () {
        if (window.pageYOffset.toFixed() === fixedOffset) {
          window.removeEventListener('scroll', onScroll);
          if (set) setTimeout(() => {
            for (let key in self.intersecting) { self.$set(self.intersecting, key, false ); }
            self.intersecting[set] = true;
          }, 10);
        }
      }

      window.addEventListener('scroll', onScroll);
      onScroll()
      window.scrollTo({
        top: top,
        behavior: 'smooth'
      });
    }
  },
  render () {
    return this.$scopedSlots.default({
      topOffset: this.topOffset,
      sections: this.sections,
      observer: this.observer,
      observerOptions: this.observerOptions,
      intersecting: this.intersecting,
      formattedSections: this.formattedSections,
      handleIntersection: this.handleIntersection,
      slugify: this.slugify,
      scrollTo: this.scrollTo,
      refs: this.refs
    })
  }
}
</script>

<style lang="scss">
  $color-primary: #BFFAEA;
  $color-secondary: #F0F8F6;
  $mint: #BFFAEA;
  $pale-mint: #F0F8F6;
  $sage: #7DADA0;
  $dark-green: #21493E;
  $blue: #3991F2;
  $black: #29302E;
  $white: #FFFFFF;

  section {
    &[data-section-type="section-component"] {
      &.vue-rs-sections-container {
        .sticky-right-nav {
          ul {
            li {
              &:marker { content: ''; }
              &:before {
                position: absolute;
                display: flex;
                align-items: center;
                justify-content: center;
                content: attr(data-counter);
                font-weight: 400;
                color: $sage;
                background: $pale-mint;
                width: 1.5rem;
                height: 1.5rem;
                border: 1px solid $sage;
                border-radius: 50%;
                margin-left: -2rem;
                font-size: 1.15rem;
                top: 50%;
                -webkit-transform: translateY(-50%);
                transform: translateY(-50%);
              }

              &:not(:last-of-type) {
                &:after {
                  position: absolute;
                  display: block;
                  content: "";
                  color: $sage;
                  width: 1.5rem;
                  height: 1.5rem;
                  border-left: 1px solid $sage;
                  margin-left: calc(-1.25rem - 1px);
                  margin-top: .25rem;
                }
              }

              &.is-active {
                color: $dark-green;
                font-weight: bold;
              
                &:before {
                  color: $white;
                  background: $dark-green;
                  border: 1px solid $dark-green;
                  font-weight: bold;
                }
              }
            }
          }
          .support {
            max-width: 16rem;
          }
        }

        .section-background {
          .section-overlay {
            .container {
              .customizable-blocks {
                &__heading {
                  padding-bottom: 1rem;
                }
                &__sub_heading {
                  padding-bottom: 1rem;
                  border-bottom: 1px solid $sage;
                }
              }
            }
          }
        }
      }
    }
  }
</style>