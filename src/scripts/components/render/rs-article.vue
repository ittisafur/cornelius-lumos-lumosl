<template>
  <article
    class="article-template relative container"
    itemscope=""
    itemtype="http://schema.org/BlogPosting"
  >
  <div v-if="featured" class="featured rounded-full p-4 absolute top-0 left-0 dark-green-fill z-10">
    Featured
  </div>
    <div class="article-template__hero-container relative">

      <header class="absolute z-10 top-1/2 left-1/2 transform -translate-x-2/4 -translate-y-2/4 text-center page-width page-width--narrow">
        <h1
          class="article-template__title text-5xl font-bebas text-white"
          itemprop="headline"
        >
          {{ article.title }} +1
        </h1>
      </header>
      <div
        class="article-template__hero-adapt media"
        itemprop="image"
      >
        <v-lazy-image
          :src="articleImage"
          :alt="article.alt"
          class="h-full w-full object-cover"
        />
      </div>

    </div>
    <div class="article-template__content container p-4">
      <div
        class="circle-divider caption-with-letter-spacing mb-4 text-black text-opacity-50 text-sm"
        itemprop="dateCreated pubdate datePublished"
      >
        <time
          :datetime="article.published_at"
        >
          {{ publishedDate }}
        </time>
      </div>
      <div
        class="article-template__content--body page-width page-width--narrow rte mb-4"
        itemprop="articleBody"
        v-html="article.body_html"
      />
      <div class="article-template__social-sharing page-width page-width--narrow">
        <SocialShare
          :shop-url="shopUrl"
          :share-permalink="articleLink"
          :share-image="articleImage"
          :share-description="stripHtml(article.summary_html)"
          :share-title="article.title"
          class="max-w-xs mx-auto py-8"
        />
      </div>
    </div>
  </article>
</template>

<script>
import SocialShare from './social-share.vue';

export default {
  name: "RsArticle",
  components: { SocialShare },
  props: {
    article: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    publishedDate: function () {
      return new Date(this.article?.published_at).toDateString();
    },
    articleLink:function () {
      return `${window?.location?.pathname}/${this.article.handle}`;
    },
    articleImage: function () {
      return this.article?.image?.src;
    },
    featured: function () {
      let tags = this.article?.tags?.split(",")
      return tags.some(t => t.trim() === "featured");
    }
  }
}
</script>

<style lang="scss">
  @import 'src/styles/base/colors';


  .article-template {
    &__hero-container {
      &:before {
        content: '';
        position: absolute;
        z-index: 1;
        background: rgba($color-black, .25);
        height: 100%;
        width: 100%;
      }
    }

    .featured {
      width:120px;
      height:120px;
      top:-60px;
      left:-60px;
      border:2px solid $color-mint;
      color: $color-mint;
      display:flex;
      justify-content:center;
      align-items:center;
    }



    &__content {
      max-width: 1024px;

      &--body {}
    }
  }
</style>
