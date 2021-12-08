<script>
import RsSection from '../render/rs-section.vue';
import { mapGetters } from 'vuex';
export default {
  name: "RsSections",
  components: { RsSection },
  props: {
    filesUrl: { type: String, default: "" },
    shopUrl: { type: String, default: "" },
    sectionId: { type: String, default: "" },
    enableContact: { type: Boolean, default: true },
    sidenavLabel: { type: String, default: "section_sub_header" },
  },
  data: function () {
    return {
      sections: [],
      topOffset: 200,
      observer: undefined,
      observerOptions: {},
      intersecting: {},
      refs: [],
      headerHeight: 0,
      sideNavHeight: 0,
      isStuck: false
    }
  },
  computed: {
    ...mapGetters({
      windowWidth: 'window-width/WindowWidth'
    }),
    computedIntersections: function () {
      return JSON.stringify(this.intersecting);
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
    this.sections = this.initSections();
    this.topOffset = document.getElementById('header') ? document.getElementById('header').offsetHeight + 60 : 200;
    this.observerOptions = {
      root: null, // document.getElementById('scrollArea'),
      rootMargin: `-${this.topOffset}px 0px 0px 0px`,
      threshold: [...Array(100).keys()].map(x => x / 100)
    };
    document.addEventListener('vue::RsSections::updated', this.updateSections);
    document.addEventListener('scroll', this.checkStickyNav);
    window.addEventListener('resize', this.setHeaderHeight);
  },
  mounted: function () {
    this.intersecting = this.sections.reduce((a, s) => { a[s.sectionId] = false; return a; }, {});
    let observer = new IntersectionObserver(this.handleIntersection, this.observerOptions);
    this.refs = Array.from(document.querySelectorAll('[data-section]'));
    for (let el of this.refs) {
      observer.observe(el);
    }
    this.observer = observer;

    Array.from(document.querySelectorAll('[data-use-step] .next-step, [data-use-step] .prev-step')).forEach(node => {
      node.addEventListener('click', this.stepScroll);
    });

    this.setHeaderHeight();
  },
  beforeDestroy: function () {
    this.observer.disconnect();
    document.removeEventListener('vue::RsSections::updated', this.updateSections);
    document.removeEventListener('scroll', this.checkStickyNav);
    window.removeEventListener('resize', this.setHeaderHeight);
    
    Array.from(document.querySelectorAll('[data-use-step] .next-step, [data-use-step] .prev-step')).forEach(node => {
      node.removeEventListener('click', this.stepScroll);
    });
  },
  methods: {
    setHeaderHeight: function () {
      this.headerHeight = document.getElementById('header')?.offsetHeight;
    },
    checkStickyNav: function () {
      // let sideNavOffset = this.$refs['sidenav'].getBoundingClientRect().top;
      let rsSectionsOffset = this.$refs['rs-sections'].getBoundingClientRect().top;
      this.sideNavHeight = this.$refs['sidenav'].clientHeight;

      if (rsSectionsOffset < this.headerHeight) {
        this.isStuck = true;
      } else {
        this.isStuck = false;
      }
    },
    handleIntersection: function (entries) {
      entries.forEach(entry => {
        // console.log(entry.target.dataset.section, entry.intersectionRatio, entry.intersectionRect, entry.boundingClientRect);
        // if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
        // if (entry.intersectionRatio < 1 && entry.boundingClientRect.top < entry.intersectionRect.top) {
        if (entry.intersectionRatio <= 1 && entry.intersectionRatio > 0 && entry.boundingClientRect.top > 0 && entry.boundingClientRect.top <= entry.intersectionRect.top) {
          for (let key in this.intersecting) {
            if (key === entry.target.dataset.section) {
              this.$set(this.intersecting, entry.target.dataset.section, true);
            } else {
              this.$set(this.intersecting, key, false);
            }
          }
        }
      });
    },
    initSections: function () {
      return Array.from(document.querySelectorAll('[data-section-json]')).reduce((a, s) => {
        a.push({
          sectionSettings: JSON.parse(JSON.parse(s.innerHTML)),
          sectionId: s.dataset.sectionId,
          sectionHandle: s.dataset.sectionHandle
        });
        return a;
      }, []);
    },
    updateSections: async function (e) {
      for (let sIdx in this.sections) {
        if (this.sections[sIdx]?.sectionId === e?.detail?.sectionId) this.$set(this.sections, sIdx, e?.detail?.sectionSettings);
      }
      // await this.$nextTick();
      // this.$forceUpdate();
    },
    slugify: function (string) {
      return this.$options.filters.slugify(string);
    },
    stepScroll: function (e) {
      e.preventDefault();
      let node = e.target.closest('[data-section]');
      if (Array.from(e.target.classList).indexOf('next-step') !== -1) {
        if (node.nextSibling) this.scrollTo(node.nextSibling.offsetTop - (this.topOffset - 10), node.nextSibling.dataset['section']);
      } else if(Array.from(e.target.classList).indexOf('prev-step') !== -1) {
        if (node.previousSibling) this.scrollTo(node.previousSibling.offsetTop, node.previousSibling.dataset['section']);
      }
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
    },
    cloneNodeForSlot: function (html) {
      var dom = document.createElement('template');
      dom.innerHTML = this.decodeHTML(html);
      dom.content.firstChild.setAttribute('slot', `html-0`);
      return dom.content.firstChild.outerHTML;
    },
    decodeHTML: function (html) {
      var txt = document.createElement('textarea');
      txt.innerHTML = html;
      return txt.value;
    }
  },
  render: function (h) {
    return (
      <section ref="rs-sections" data-section-type="section-component" class="rs-sections">
        <div class="w-full lg:w-3/4 px-0 lg:px-10 mx-auto flex flex-col lg:flex-row">
          <div ref="sidenav" class={{'pale-mint-fill': this.windowWidth < 1024, 'sidenav': true, 'w-full': true, 'overflow-x-auto': true, 'lg:overflow-x-visible': true, 'lg:w-1/4': true, 'stuck': this.isStuck}} style={{'--header-height': `${this.headerHeight}px`}}>
            <div class="sticky sticky-right-nav top-48">
              <ul id="sidenav-list" class={{'px-8': true, 'pb-0': true, 'lg:px-0': true, 'lg:pb-0': true, 'w-max': true, 'lg:w-auto': true}}>
                {
                  this.sections.map((section, i) => (
                    <li
                      key={`nav-${section.sectionId}`}
                      class={{'is-active': this.intersecting[section.sectionId], 'pl-8': true, 'lg:pl-4': true, 'p-4': true, 'relative': true, 'cursor-pointer': true, 'inline-block': true, 'lg:block': true}}
                      vOn:click={() => this.scrollTo(this.refs.find(r => r.dataset.section === section.sectionId)?.offsetTop - (this.topOffset - 10), section.sectionId)}
                      data-counter={i + 1}
                    >
                      {section.sectionSettings[this.sidenavLabel]}
                    </li>
                  ))
                }
              </ul>
              {this.enableContact && <div class="hidden lg:block support p-4 mt-4">
                <div class="border-b-2 border-gray-500 py-2">
                  Help &amp; Support
                </div>
                <div class="py-2">
                  Email <a
                    class="neon-sky-stroke"
                    href="mailto:hello@lumossmile.com"
                  >hello@lumossmile.com</a> or hit the live chat icon
                </div>
              </div>}
            </div>
          </div>
          <div
            id="scrollArea"
            class="vue-rs-section w-full lg:w-3/4"
            style={{'--sidenav-height': `${this.sideNavHeight}px`}}
          >
            {
              this.sections.map((section, i) => (
                <RsSection { ...{
                  props: {
                    sectionSettings: section.sectionSettings,
                    filesUrl: this.filesUrl,
                    shopUrl: this.shopUrl,
                    sectionId: section.sectionId,
                    index: i,
                    lazyLoad: false,
                    // scopedSlots: {
                    //   'html-0': () => this.decodeHTML(window.sections[0].sectionSettings.blocks[0].html)
                    // }
                  },
                  attrs: {
                    'data-section': section.sectionId
                  }
                } }>
                  {/* <template slot="html-0">{ inputDomProps.innerHTML }</template> */}
                  {
                    section.sectionSettings.blocks.map((block, i) => (
                      <div slot={`html-${i}`} { ...{
                        domProps: {
                          innerHTML: this.decodeHTML(block.html)
                        }
                      } } />
                    ))
                  }
                </RsSection>
              ))
            }
          </div>
        </div>
      </section>
    )
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
      &.rs-sections {
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
        
          .sticky-right-nav {
            ul {
              scroll-behavior: smooth;
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

                @media screen and (min-width: 1024px) {
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
                }

                @media screen and (max-width: 1023px) {
                  &:not(:last-of-type) {
                    margin-right: 1rem;
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
        }

        .section-background {
          .section-overlay {
            .container {
              .customizable-blocks {
                &__heading {
                  padding-bottom: 1rem;
                }
                &__sub_heading {
                  @media screen and (min-width: 1024px) {
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
  }
</style>