<template>
  <div class="atom-sliders p-0 sm:p-8 w-full flex flex-col lg:flex-row items-center">
    <div class="p-4 w-full lg:w-1/2">
      <div class="w-full text-center mb-4">
        <img
          class="mx-auto object-cover"
          src="//cdn.shopify.com/s/files/1/0507/0562/9354/files/good.impression.png?v=1626741370"
        >
      </div>
      <div class="w-full text-center mb-4">
        A Good Impression
      </div>
      <div class="w-full text-center">
        <div class="dueling-sliders">
          <div class="dueling-sliders--container block">
            <div class="w-full">
              <VueSlickCarousel
                ref="first_slider_main"
                v-bind="first_settings.slider_main"
                class="carousel__main"
                @init="onInitCarousel"
              >
                <template #prevArrow>
                  <div
                    class="prev-arrow"
                    v-html="prevIcon"
                  />
                </template>
                <template #nextArrow>
                  <div
                    class="next-arrow"
                    v-html="nextIcon"
                  />
                </template>
                <div
                  v-for="(image) in goodImpressions"
                  :key="image.position"
                  :data-position="image.position"
                >
                  <img
                    :src="image.src"
                    class="mx-auto"
                  >
                  <div class="carousel__label p-4 mint-fill">
                    {{ image.label }}
                  </div>
                </div>
              </VueSlickCarousel>
            </div>
            <VueSlickCarousel
              ref="first_slider_nav"
              v-bind="first_settings.slider_nav"
              class="carousel__nav w-full mt-8"
            >
              <div
                v-for="(image) in goodImpressions"
                :key="image.position"
                :data-position="image.position"
              >
                <img :src="image.src">
                <div class="carousel__label p-2">
                  {{ image.label }}
                </div>
              </div>
            </VueSlickCarousel>
          </div>
        </div>
      </div>
    </div>
    <div class="p-4 w-full lg:w-1/2">
      <div class="w-full text-center mb-4">
        <img
          class="mx-auto object-cover"
          src="//cdn.shopify.com/s/files/1/0507/0562/9354/files/bad.impression.png?v=1626741965"
        >
      </div>
      <div class="w-full text-center mb-4">
        A Bad Impression
      </div>
      <div class="w-full text-center">
        <div class="dueling-sliders">
          <div class="dueling-sliders--container block">
            <div class="w-full">
              <VueSlickCarousel
                ref="second_slider_main"
                v-bind="second_settings.slider_main"
                class="carousel__main"
                @init="onInitCarousel"
              >
                <template #prevArrow>
                  <div
                    class="prev-arrow"
                    v-html="prevIcon"
                  />
                </template>
                <template #nextArrow>
                  <div
                    class="next-arrow"
                    v-html="nextIcon"
                  />
                </template>
                <div
                  v-for="(image) in badImpressions"
                  :key="image.position"
                  :data-position="image.position"
                >
                  <img
                    :src="image.src"
                    class="mx-auto"
                  >
                  <div class="carousel__label p-4 mint-fill">
                    {{ image.label }}
                  </div>
                </div>
              </VueSlickCarousel>
            </div>
            <VueSlickCarousel
              ref="second_slider_nav"
              v-bind="second_settings.slider_nav"
              class="carousel__nav w-full mt-8"
            >
              <div
                v-for="(image) in badImpressions"
                :key="image.position"
                :data-position="image.position"
              >
                <img :src="image.src">
                <div class="carousel__label p-2">
                  {{ image.label }}
                </div>
              </div>
            </VueSlickCarousel>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import VueSlickCarousel from 'vue-slick-carousel';
  import 'vue-slick-carousel/dist/vue-slick-carousel.css';

  export default {
    name: "AtomSliders",
    components: { 
      VueSlickCarousel
    },
    props: {
      goodImpressions: {
        type: Array,
        default: () => {
          return [
            { src: '//cdn.shopify.com/s/files/1/0507/0562/9354/files/gumline.present.png?v=1626741370', position: 1, label: 'Gumline present' },
            { src: '//cdn.shopify.com/s/files/1/0507/0562/9354/files/gumline.present.png?v=1626741370', position: 2, label: 'Single Imprint' },
            { src: '//cdn.shopify.com/s/files/1/0507/0562/9354/files/gumline.present.png?v=1626741370', position: 3, label: 'Molars captured' },
            { src: '//cdn.shopify.com/s/files/1/0507/0562/9354/files/gumline.present.png?v=1626741370', position: 4, label: 'Putty fully mixed' }
          ]
        }
      },
      badImpressions: {
        type: Array,
        default: () => {
          return [
            { src: '//cdn.shopify.com/s/files/1/0507/0562/9354/files/tray.not.sealed.png?v=1626741371', position: 1, label: 'Tray Not Fully Sealed' },
            { src: '//cdn.shopify.com/s/files/1/0507/0562/9354/files/tray.not.sealed.png?v=1626741371', position: 2, label: 'Single Imprint' },
            { src: '//cdn.shopify.com/s/files/1/0507/0562/9354/files/tray.not.sealed.png?v=1626741371', position: 3, label: 'Molars captured' },
            { src: '//cdn.shopify.com/s/files/1/0507/0562/9354/files/tray.not.sealed.png?v=1626741371', position: 4, label: 'Putty fully mixed' }
          ]
        }
      }
    },
    data: function () {
      return {
        first_settings: {
          slider_nav: {
            slidesToShow: 4,
            slidesToScroll: 1,
            draggable:true,
            infinite: true,
            swipeToSlide: true,
            asNavFor: null,
            dots: false,
            arrows: true,
            focusOnSelect: true,
            vertical: false,
            verticalSwiping: true
          },
          slider_main: {
            slidesToShow: 1,
            slidesToScroll: 1,
            swipeToSlide: true,
            arrows: true,
            fade: true,
            asNavFor: null
          }
        },
        second_settings: {
          slider_nav: {
            slidesToShow: 4,
            slidesToScroll: 1,
            draggable:true,
            infinite: true,
            swipeToSlide: true,
            asNavFor: null,
            dots: false,
            arrows: true,
            focusOnSelect: true,
            vertical: false,
            verticalSwiping: true
          },
          slider_main: {
            slidesToShow: 1,
            slidesToScroll: 1,
            swipeToSlide: true,
            arrows: true,
            fade: true,
            asNavFor: null
          }
        },
        prevIcon: '<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="18" cy="18" r="18" transform="rotate(-180 18 18)" fill="currentColor"/><path d="M21 25L14 18L21 11" stroke="#7DADA0" stroke-width="2"/>',
        nextIcon: '<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="18" cy="18" r="18" fill="currentColor"/><path d="M15 11L22 18L15 25" stroke="#7DADA0" stroke-width="2"/></svg>',
      }
    },
    computed: {
      ...mapGetters({
        windowWidth: 'window-width/WindowWidth',
        showModal: 'modal/showModal'
      }),
      isDesktop: function() {
        return this.windowWidth > this.BREAKPOINTS.lg
      }
    },
    watch: {},
    created () {},
    destroyed () {},
    beforeMount: function () {},
    mounted: function () {
      this.first_settings.slider_main.asNavFor = this.$refs.first_slider_nav;
      this.first_settings.slider_nav.asNavFor = this.$refs.first_slider_main;
      this.second_settings.slider_main.asNavFor = this.$refs.second_slider_nav;
      this.second_settings.slider_nav.asNavFor = this.$refs.second_slider_main;
      // this.headerHeight = ((document.getElementById('shopify-section-layout-header'))?document.getElementById('shopify-section-layout-header').clientHeight:200);
      this.isMounted = true;
    },
    beforeDestroy() {},
    methods: {
      ...mapActions({
        hide: 'modal/hide',
        triggerModal: 'modal/trigger'
      }),
      onInitCarousel: function () {}
    },
  }
</script>

<style lang="scss">
  $color-primary: #BFFAEA;
  $color-secondary: #F0F8F6;
  $mobile: 767px;
  $desktop: 1023px;

  .atom-sliders {
    .dueling-sliders {
      .carousel__main {
        background: $color-primary;
        border-radius: 20px;

        .carousel__label {
          border-radius: 20px;
        }
      }
      .carousel__nav {
        position: relative;
        .carousel__label {
          font-size: 10px;
        }
        .slick-slide {
          [data-position] {
            display: block!important;
          }
          padding: .25rem;

          &.slick-current {
            background: $color-primary;
            border-radius: 5px;
            .carousel__label {
              background: $color-primary;
            }
          }
        }
      }
    }
  }
</style>