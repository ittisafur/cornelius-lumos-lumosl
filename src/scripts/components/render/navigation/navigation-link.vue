<template>
  <a
    :href="link.levels && !isDesktop ? '#' : link.url"
    :class="[
      `navigationLink`,
      link.active || link.current || link.child_current ? 'navigationLink--active' : '',
      link.is_card ? 'navigationLink--card' : '',
      link.url == '#' ? 'navigationLink--nolink' : '',
      `navigationLink--${link.title.replace(/\s/g, '-').toLowerCase()}`,
    ]"
  >
    <div
      v-if="link.image && link.is_card"
      class="navigationLink__imageWrapper"
    >
      <img
        :src="link.image"
        class="navigationLink__image"
      >
      <span class="navigationLink__title">{{ link.title }}</span>
    </div>
    <div
      v-if="link.tier > 1"
      class="flex flex-row md:flex-col justify-between items-center"
    >
      <div
        class="navigationLink__bg flex justify-center items-center w-1/3 md:w-full"
        :class="[ `h-16 md:h-${ nearestMultiple(1 / numLinks * 2 * 100, 4) }` ]"
        :style="`--num-links: ${windowWidth < BREAKPOINTS.lg ? 4 : numLinks}`"
      >
        <img
          class="object-contain h-16 md:h-32"
          :src="generateFilesUrl(links(link.title).src)"
        >
      </div>
      <div class="w-2/3 md:w-full">
        <div
          v-if="links(link.title).sup"
          class="navigationLink__sup text-left md:text-center uppercase sage-stroke"
        >
          {{ links(link.title).sup }}
        </div>
        <div class="navigationLink__title text-left md:text-center">{{ link.title }}</div>
        <div
          v-if="links(link.title).sub"
          class="navigationLink__sub text-left md:text-center uppercase text-sm text-gray-500"
        >
          {{ links(link.title).sub }}
        </div>
      </div>
    </div>
    <div v-else>
      <span class="navigationLink__title">{{ link.title }}</span>
    </div>
  </a>
</template>
<script>
import { mapGetters } from "vuex";

const breakpoints = {
  lgl: 1279,
  lg: 1023,
  mdl: 992,
  md: 767,
  sm: 413,
  sms: 320,
};

export default {
  name: "NavigationLink",
  props: {
    link: {
      type: Object,
      required: true
    },
    numLinks: {
      type: Number,
      default: 1
    }
  },
  data: function () {
    return {
      // links: {
      //   'Teeth Whitening Starter Kit': { sup: '', sub: 'SUBSCRIBE OR BUY', src: 'twsk.png' },
      //   'Teeth Whitening Gels': { sup: '', sub: 'SUBSCRIBE OR BUY', src: 'twg.transparent.png' },
      //   'Replacement Teeth Whitening Trays': { sup: '', sub: '', src: 'rtwt.transparent.png' },
      //   'How Teeth Whitening works': { sup: 'SCIENCE', sub: '', src: 'htww.transparent.png' },
      //   'What is Lumos Smile?': { sup: 'PRODUCT', sub: '', src: 'wils.transparent.png' },
      //   'How to use Lumos Smile': { sup: 'HOW TO', sub: '', src: 'htuls.transparent.png' },
      //   'Common Questions': { sup: 'FAQ', sub: '', src: 'cq.transparent.png' }
      // }
    }
  },
  computed: {
    ...mapGetters({
      windowWidth: "window-width/WindowWidth",
    }),
    isDesktop: function () {
      return this.windowWidth > breakpoints.mdl;
    }
  },
  methods: {
    nearestMultiple: function (input, mult) {
      var output = Math.floor(input / mult);
      if (output == 0 && input > 0) output += 1;
      output *= mult;
      return output;
    },
    links: function (title)  {
      return { src: `${this.slugify(title)}.nav.png` };
    },
    slugify: function (string) {
      return this.$options.filters.slugify(string);
    }
  }
}
</script>

<style lang="scss" scoped>
  $color-dark-green       : #21493E;
  $color-sage             : #7DADA0;
  $color-white            : #FFFFFF;
  $color-pale-mint        : #F0F8F6;
  $color-neon-sky         : #3991F2;
  $color-neon-sky-hover   : #2F83DE;
  $color-light-gray       : #888888;
  $color-black            : #000000;
  $color-mint             : #BFFAEA;
  $color-mint-hover       : #9EECD7;
  $color-lumos-black      : #29302E;
  $color-medium-gray      : #888888;
  $color-success          : #189D3D;
  $color-error            : #CE0000;

  .navigationLink {
    &__bg {
      background: radial-gradient(circle, $color-mint, $color-mint calc(1 / var(--num-links) * 2 * 100%), transparent calc(1 / var(--num-links) * 2 * 100%));
    }
  }
</style>