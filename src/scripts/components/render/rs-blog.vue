<template>
  <transition name="fade">
    <div class="blog container relative">
      <div
        v-if="gridLoading"
        v-html="bubbles"
      />
      <div class="blog__filters py-8">
        <button
          class="blog__filters__button button dark-green-fill white-stroke mx-auto flex"
          @click="filters.open = !filters.open"
        >
          <span>
            {{ filters.open ? 'Hide Categories' : 'Show Categories' }}
          </span>
        </button>
        <div
          class="blog__filters__categories py-4 flex flex-wrap justify-center items-center"
          :class="{ show: filters.open }"
        >
          <template v-if="blog.all_tags.length">
            <div
              v-for="(selected, tag) in filters.categories"
              :key="tag"
              class="blog__filters__categories--tag rounded-full py-1 px-2 m-1 cursor-pointer"
              :class="{ selected: selected }"
              @click="filters.categories[tag] = !filters.categories[tag]"
            >
              {{ tag }}
            </div>
          </template>
          <div v-else>
            There are no tags for this blog.
          </div>
        </div>
      </div>
      <div
        ref="infiniteScroll"
        class="blog__articles grid grid-cols-1 lg:grid-cols-2 gap-16 auto-rows-fr"
        :class="{ loaded: loaded }"
      >
        <template v-for="(article,i) in paginatedArticles">
          <AtomArticleItem
            :key="article.id"
            :article="article"
            :featured="i === 0"
          />
        </template>
      </div>
      <div
        v-if="totalPages > 0"
        class="paginator py-16"
      >
        <div class="flex justify-center">
          <div
            class="paginator__item nav nav__prev"
            :class="{ disabled: page === 1 }"
            @click="goToPage(page - 1)"
          >
            &larr;
          </div>
          <div class="paginator__items flex justify-between">
            <template
              v-for="p in totalPages"
            >
              <div
                v-if="checkPaginationRange(p)"
                :key="p"
                class="paginator__item"
                :class="{ current: p === page, iso: ((p === 1 && (page - halfPaginationRange > 1)) || (p === totalPages && (page < totalPages - halfPaginationRange))) }"
                @click="goToPage(p)"
              >
                {{ p }}
              </div>
            </template>
          </div>
          <div
            class="paginator__item nav nav__next"
            :class="{ disabled: page === totalPages }"
            @click="goToPage(page + 1)"
          >
            &rarr;
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  // import _ from '../../helpers/lo';
  // import helpers from "../../helpers/helpers";
  // import axios from "axios";
  import AtomArticleItem from "./atoms/atom-article-item.vue"

  const PAGINATION_ITEMS = 6;
  // const $mobile = 768;

  export default {
    name: "RsBlog",
    components: { AtomArticleItem },
    props: { blog: { type: Object, default: () => {} } },
    data: function () {
      return {
        loaded: false,
        page: 1,
        pagination: PAGINATION_ITEMS,
        paginationRange: 6,
        gridLoading: false,
        filters: { open: false, categories: {} }
      }
    },
    computed: {
      ...mapGetters({
        windowWidth: 'window-width/WindowWidth'
      }),
      gridCount: function () {
        return this.blog.articles_count // + this.numEditorialImages;
      },
      totalPages: function () {
        return Math.ceil(this.filteredArticles.length / this.pagination);
      },
      halfPaginationRange: function () {
        return Math.ceil(this.paginationRange / 2);
      },
      wrapperClasses: function () {
        return { class: { 'h-full': true, 'w-full': true } };
      },
      selectedFilters: function () {
        return Object.keys(this.filters?.categories).reduce((a, t) => { const selected = this.filters?.categories[t];  if (selected) (a.push(t)); return a; }, []);
      },
      filteredArticles: function () {
        return this.blog?.articles?.filter(a => { return !this.selectedFilters.length ? true : this.arrayIntersection([a?.tags?.split(',').map(t => t.trim()), this.selectedFilters]).length > 0; });
      },
      paginatedArticles: function () {
        // let startIdx = ((this.page - 1) * this.pagination);
        return this.filteredArticles
          .slice(
            // 0,
            // startIdx + this.pagination
            (this.page - 1) * this.pagination,
            (this.page) * this.pagination
          );
      },
    },
    watch: {
      filteredArticles: async function (after, before) {
        if (JSON.stringify(after) !== JSON.stringify(before)) {
          await this.$nextTick();
          this.goToPage(1);
          this.scrollTo(0);
        }
      },
      page: function (after, before) {
        if (after !== before) {
          this.scrollTo(0);
        }
      },
      paginatedArticles: async function (after, before) {
        if (JSON.stringify(after) !== JSON.stringify(before)) {
          await this.$nextTick();
          this.gridLoading = false;
        }
      }
    },
    created () {},
    destroyed () {},
    beforeMount: function () {
      this.gridLoading = true;
      this.initFilters();
    },
    mounted: function () {
      this.gridLoading = false;
    },
    methods: {
      ...mapActions({}),
      initFilters: function () {
        this.filters = { ...this.filters, ...{ categories: this.blog.all_tags.reduce((a, t) => { a[t] = false; return a; }, {}) } };
      },
      goToPage: function (page) {
        this.gridLoading = true;
        if (page >= 1 && page <= this.totalPages) this.page = page;
      },
      checkPaginationRange(page) {
        if (page === 1 || page === this.totalPages) {
          return true;
        } else if (this.page - this.halfPaginationRange < 1) {
          return page <= this.paginationRange;
        } else if (this.page + this.halfPaginationRange > this.totalPages) {
          return page > (this.totalPages - this.paginationRange);
        } else {
          return page > (this.page - this.halfPaginationRange) && page < (this.page + this.halfPaginationRange);
        }
      }
    }
  }
</script>

<style lang="scss">
  @import 'src/styles/base/colors';

  $color-primary: #000;
  $color-secondary: #eceaeb;
  $offwhite: #f9f8f7;
  $mobile: 767px;
  $border-color: #e2e2e2;
  $desktop-up: 1024px;

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  body.template-blog {
    [data-section-type="blog-template"] {
      .blog {
        max-width: 1024px;

        &__filters {
          &__button {}
          &__categories {
            transition: all .3s ease-in-out;
            max-height: 0;
            visibility: hidden;
            opacity: 0;
            overflow: hidden;

            &.show {
              max-height: 20rem;
              visibility: visible;
              opacity: 1;
            }

            &--tag {
              transition: all .2s ease-in-out;
              color: $color-dark-green;
              border: 1px solid $color-dark-green;

              &.selected {
                color: $color-white;
                background: $color-black;
                border: 1px solid $color-black;
              }
            }
          }
        }

        &__articles {

        }

        .paginator {
          &__item {
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            height: 2rem;
            width: 2rem;
            border: 1px solid rgba(0, 0, 0, 0.1);
            color: rgba(0, 0, 0, 0.3);
            transition: all .3s ease-in-out;

            &:not(:last-child) {
              margin-right: 1rem;
            }

            &.disabled {
              background: rgba(0, 0, 0, 0.3);
              color: $color-white;
              opacity: 0.5;
            }

            &.nav {
              &__prev { margin-right: 1rem; }
              &__next { margin-left: 1rem; }
            }

            &.iso {
              margin: 0 1rem;
              position: relative;

              +.paginator__item {
                margin-left: 1rem;
              }

              &:before, &:after {
                content: '';
                display: block;
                position: absolute;
                top: 0;
                height: 100%;
              }

              &:before { left: -1rem; border-left: 1px solid rgba(0, 0, 0, 0.1); }
              &:after { right: -1rem; border-right: 1px solid rgba(0, 0, 0, 0.1); }
            }

            &:hover:not(.disabled), &.current, &.nav:not(.disabled) {
              background: $color-dark-green;
              color: $color-white;
            }
          }
        }
      }
    }
  }
</style>
