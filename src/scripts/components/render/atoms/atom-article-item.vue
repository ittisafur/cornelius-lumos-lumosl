<template>
  <div class="article-item shadow"
        :class="{'col-span-2':featured, relative:featured}"
  >
  <div v-if="featured" class="rounded-full p-4 absolute top-0 left-0 dark-green-fill">
    Featured
  </div>
    <div
      class="article-item__image-container h-64 relative"
    >
      <div class="article-image h-full">
        <div class="default h-full w-full">
          <a
            :href="articleLink"
            :title="article.title"
          >
            <v-lazy-image
              :src="articleImage"
              class="h-full w-full object-cover"
            />
          </a>
        </div>
      </div>
    </div>
    <div class="article-item__info-container p-8 bg-black bg-opacity-5">
      <div class="article-item__info-container--date mb-4 text-black text-opacity-50 text-sm">
        {{ publishedDate }}
      </div>
      <div class="article-item__info-container--title mb-4 font-wakeling text-5xl">
        <a
          :href="articleLink"
          :title="article.title"
        >
          <h3 class="">{{ article.title }}</h3>
        </a>
      </div>
      <div
        class="article-item__info-container--description"
        v-html="article.summary_html"
      />
    </div>
  </div>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  export default {
    name: "AtomArticleItem",
    components: {},
    props: { article: { type: Object, default: () => {} } },
    data: function () {
      return {

      }
    },
    computed: {
      ...mapGetters({
        windowWidth: 'window-width/WindowWidth'
      }),
      articleLink:function () {
        return `${window?.location?.pathname}/${this.article.handle}`;
      },
      articleImage: function () {
        return this.article?.image?.src;
      },
      wrapperClasses: function () {
        return { class: { 'h-full': true, 'w-full': true } };
      },
      publishedDate: function () {
        return new Date(this.article?.published_at).toDateString();
      },
      featured: function () {
        let tags = this.article?.tags?.split(",")
        return tags.some(t => t.trim() === "featured");
      }
    },
    watch: {},
    created () {},
    destroyed () {},
    beforeMount: function () {},
    mounted: function () {},
    methods: {
      ...mapActions({}),
    }
  }
</script>
<style lang="scss">

  $mobile: 767px;
  .article-item {
    height: 100%;
    &__image-container {}
    &__info-container {
      height: calc(100% - 16rem);
    }
  }
</style>
