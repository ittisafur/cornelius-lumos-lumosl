<template>
  <div
    ref="rs-faqs"
    class="w-full lg:w-3/4 pb-20 px-0 lg:px-10 mx-auto flex flex-col lg:flex-row"
  >
    <div
      class="w-full lg:w-1/4"
      :class="{ 'hidden': single }"
    >
      <div
        ref="sidenav"
        :class="{ 'pale-mint-fill': windowWidth < 1024, 'sidenav': true, 'w-full': true, 'overflow-x-auto': true, 'lg:overflow-x-visible': true, 'lg:h-full': true, 'stuck': isStuck }"
        :style="{ '--header-height': `${headerHeight}px` }"
      >
        <div class="sticky top-48">
          <ul
            id="sidenav-list"
            :class="{ 'px-8': true, 'pb-0': true, 'lg:px-0': true, 'lg:pb-0': true, 'w-max': true, 'lg:w-auto': true }"
          >
            <li
              v-for="(faqGroup, heading) in formattedFaqs"
              :key="`nav-${slugify(heading)}`"
              :class="{ 'is-active': intersecting[slugify(heading)] }"
              class="p-4 relative cursor-pointer inline-block lg:block"
              @click="scrollTo($refs.items.find(r => r.dataset.section === slugify(heading)).offsetTop - (topOffset - 10), slugify(heading))"
            >
              {{ heading }}
            </li>
          </ul>
          <div class="hidden lg:block support p-4 mt-4">
            <div class="border-b-2 border-gray-500 py-2">
              Help &amp; Support
            </div>
            <div class="py-2">
              Email <a
                class="neon-sky-stroke"
                href="mailto:hello@lumossmile.com"
              >hello@lumossmile.com</a> or hit the live chat icon
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      id="scrollArea"
      class="w-full px-10 lg:px-0"
      :class="{ 'lg:w-3/4': !single }"
    >
      <div
        v-for="(faqGroup, heading) in formattedFaqs"
        :key="slugify(heading)"
        ref="items"
        class="faqGroupContainer"
        :data-section="`${slugify(heading)}`"
      >
        <h2 class="sage-stroke text-xl p-4">
          {{ heading }}
        </h2>
        <tabs-accordions
          :data="faqGroup"
          type="accordions"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import TabsAccordions from './tabs-accordions';
export default {
  name: "Faqs",
  components: { TabsAccordions },
  props: {
    title: {
      type: String,
      required: false,
      default: "FAQ"
    },
    data: {
      type: Object,
      default: () => {}
    },
    startAccordionOpen: {
      type: Boolean,
      required: false,
      default: false 
    },
    single: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      topOffset: 200,
      faqs: {},
      observer: undefined,
      observerOptions: {},
      intersecting: {},
      headerHeight: 0,
      isStuck: false
    }
  },
  computed: {
    ...mapGetters({
      windowWidth: 'window-width/WindowWidth'
    }),
    computedIntersections: function () {
      return JSON.stringify(this.intersecting);
    },
    formattedFaqs: function () {
      return !this.single ? this.faqs.reduce((a, f) => { a = { ...a, ...JSON.parse(f) }; return a; }, {}) : this.data;
    }
  },
  watch: {
    computedIntersections: async function (after, before) {
      const activeListItem = this.$refs['sidenav'].getElementsByClassName('is-active');
      if (after !== before && this.windowWidth < this.BREAKPOINTS.lg && activeListItem.length) {
        await this.$nextTick();
        if (activeListItem[0]) this.$refs['sidenav'].scrollTo({ left: activeListItem[0].offsetLeft - 10, behavior: 'smooth' });
      }
    }
  },
  created: function () {},
  beforeMount: function () {
    this.faqs = this.data || window.faqs || [];
    this.topOffset = document.getElementById('header') ? document.getElementById('header').offsetHeight + 60 : 200;
    this.observerOptions = {
      root: null, // document.getElementById('scrollArea'),
      rootMargin: `-${this.topOffset}px 0px 0px 0px`,
      threshold: [...Array(100).keys()].map(x => x / 100)
    };
    document.addEventListener('scroll', this.checkStickyNav);
    window.addEventListener('resize', this.setHeaderHeight);
  },
  mounted: function () {
    if (!this.single) {
      this.intersecting = Object.keys(this.formattedFaqs).reduce((a, i) => { a[this.slugify(i)] = false; return a; }, {});
      let observer = new IntersectionObserver(this.handleIntersection, this.observerOptions);
      for (let el of this.$refs.items) {
        observer.observe(el);
      }
      this.observer = observer;
    }
    this.setHeaderHeight();
  },
  beforeDestroy: function () {
    if (this.observer) this.observer.disconnect();
    document.removeEventListener('scroll', this.checkStickyNav);
    window.removeEventListener('resize', this.setHeaderHeight);
  },
  methods: {
    setHeaderHeight: function () {
      this.headerHeight = document.getElementById('header')?.offsetHeight;
    },
    checkStickyNav: function () {
      // let sideNavOffset = this.$refs['sidenav'].getBoundingClientRect().top;
      let rsFaqsOffset = this.$refs['rs-faqs'].getBoundingClientRect().top;
      this.sideNavHeight = this.$refs['sidenav'].clientHeight;

      if (rsFaqsOffset < this.headerHeight) {
        this.isStuck = true;
      } else {
        this.isStuck = false;
      }
    },
    handleIntersection: function (entries) {
      entries.forEach(entry => {
        // console.log(entry.target.dataset.section, entry.intersectionRatio, entry.intersectionRect, entry.boundingClientRect);
        // if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
        // if (entry.intersectionRatio <= 1 && entry.intersectionRatio > 0 && entry.boundingClientRect.top > 0 && entry.boundingClientRect.top <= entry.intersectionRect.top) {
        if (entry.intersectionRatio < 1 && entry.boundingClientRect.top < entry.intersectionRect.top) {
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
    &[data-section-type="faq"] {
      .sidenav {
        transition: padding .2s ease-in-out, background .2s ease-in-out, box-shadow .2s ease-in-out;
        @media screen and (max-width: 1023px) {
          &.stuck {
            position: fixed;
            top: var(--header-height);
            background: $pale-mint;
            z-index: 2;
            box-shadow: 0 0 5px rgb(0 0 0 / 15%);

            ul#sidenav-list {
              padding-bottom: 0;
            }

            + #scrollArea {
              padding-top: calc(var(--sidenav-height) + 2rem);
            }
          }
        }

        .sticky {
          ul {
            li {
              &.is-active {
                color: $dark-green;
                font-weight: bold;

                &:marker { content: ''; }
                &:before {
                  content: "•";
                  color: $dark-green;
                  font-weight: bold;
                  display: block;
                  width: 1.5rem;
                  margin-left: -1rem;
                  font-size: 1.5rem;
                  line-height: 10px;
                  top: 50%;
                  transform: translateY(-50%);
                  position: absolute;
                }
              }
            }
          }
          .support {
            max-width: 16rem;
          }
        }
      }
    }
  }
</style>