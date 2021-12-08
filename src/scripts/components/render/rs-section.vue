<template>
  <div
    class="rs-section--container"
    :class="{ pad: backgroundVideoEnabled }"
  >
    <div
      ref="section"
      class="section-background"
      :class="{ curved: backgroundCurveEnabled, right: sectionSettings.background_curve === 'right', 'curved--single--bottom--even': backgroundCurveEnabled && sectionSettings.background_curve === 'bottom-even', 'two-tone': backgroundTwoToneEnabled, slider: sliderEnabled, 'tabs-enabled': tabsEnabled, [`pt-${sectionSettings.section_padding_top_mobile}`]: true, [`pb-${sectionSettings.section_padding_bottom_mobile}`]: true, [`lg:pt-${sectionSettings.section_padding_top}`]: true, [`lg:pb-${sectionSettings.section_padding_bottom}`]: true }"
      :style="backgroundStyles"
    >
      <div
        v-if="backgroundVideoEnabled"
        :id="playerSelector"
        class="video-player"
      />
      <div class="section-overlay w-full h-full flex items-center">
        <div
          class="container customizable-blocks"
          :class="{ 'pt-4': tabsEnabled, 'md:pt-0': tabsEnabled, 'lg:pt-16': tabsEnabled }"
        >
          <div
            v-if="sectionSettings.section_header || sectionSettings.section_sub_header"
            class="mb-4"
          >
            <div
              v-if="sectionSettings.section_header"
              class="customizable-blocks__heading"
            >
              <div
                class="tracking-wider"
                :class="[
                  sectionSettings.section_heading_text_alignment_mobile,
                  `lg:${sectionSettings.section_heading_text_alignment}`,
                  sectionSettings.section_heading_fontsize_mobile,
                  `lg:${sectionSettings.section_heading_fontsize}`,
                  sectionSettings.section_heading_fontweight
                ]"
                :style="{ color: windowWidth > 768 ? sectionSettings.section_heading_color : sectionSettings.section_heading_color_mobile }"
              >
                {{ sectionSettings.section_header }}
              </div>
            </div>
            <div
              v-if="sectionSettings.section_sub_header"
              class="customizable-blocks__sub_heading"
            >
              <div
                class="tracking-wider"
                :class="[
                  sectionSettings.section_sub_heading_text_alignment_mobile,
                  `lg:${sectionSettings.section_sub_heading_text_alignment}`,
                  sectionSettings.section_sub_heading_fontsize_mobile,
                  `lg:${sectionSettings.section_sub_heading_fontsize}`,
                  sectionSettings.section_sub_heading_fontweight
                ]"
                :style="{ color: windowWidth > 768 ? sectionSettings.section_sub_heading_color : sectionSettings.section_sub_heading_color_mobile }"
              >
                {{ sectionSettings.section_sub_header }}
              </div>
            </div>
          </div>

          <div
            v-if="sectionSettings.blocks && sectionSettings.blocks.length"
            class="customizable-blocks__content"
          >
            <div
              v-if="mobileSectionHeadingsHTML"
              v-html="mobileSectionHeadingsHTML"
            />
            <template v-if="tabsEnabled">
              <div class="tab-labels flex w-full md:w-1/2 justify-between mx-auto mb-8">
                <div
                  v-for="(block, i) in sectionSettings.blocks"
                  :key="i"
                  :class="[
                    { 'selected': tabs[block.heading] },
                    `w-1/${sectionSettings.blocks.length}`
                  ]"
                  @click.prevent="setTab(block.heading)"
                >
                  <div
                    :class="[
                      block.text_alignment_mobile,
                      `lg:${block.text_alignment}`,
                      block.heading_fontsize_mobile,
                      `lg:${block.heading_fontsize}`,
                      block.heading_fontweight
                    ]"
                    class="tab-label cursor-pointer py-4 px-6"
                    :style="{ color: windowWidth > 768 ? block.heading_color : block.heading_color_mobile }"
                  >
                    {{ block.heading }}
                  </div>
                  <div
                    :class="[
                      block.text_alignment_mobile,
                      `lg:${block.text_alignment}`,
                      block.subheading_fontsize_mobile,
                      `lg:${block.subheading_fontsize}`,
                      block.subheading_fontweight
                    ]"
                    class="tab-label cursor-pointer py-4 px-6"
                    :style="{ color: windowWidth > 768 ? block.subheading_color : block.subheading_color_mobile }"
                  >
                    {{ block.subheading }}
                  </div>    
                </div>
              </div>
            </template>
            <wrapped-component
              :wrap="sliderEnabled"
              :data-obj="addClasses"
            >
              <template #wrapper>
                <VueSlickCarousel
                  v-bind="slickSlider"
                  ref="slider"
                  class=""
                  @init="sliderLoaded = true"
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
                </VueSlickCarousel>
              </template>
              
              <div
                v-for="(block, i) in sectionSettings.blocks"
                v-show="tabsEnabled ? tabs[block.heading] : true"
                :key="i"
                :class="`customizable-blocks__content--block relative w-full h-full lg:w-1/${numBlocks} md:px-2 mb-1 lg:mb-0 ${false && block.content_enabled === 'true' && block.image_enabled !== 'true' && block.video_enabled !== 'true' ? 'min-pad' : ''} ${block.mobile_stacking_order ? `order-${block.mobile_stacking_order} lg:order-none` : ''}`"
                :style="getBlockStyles(i)"
              >
                <AtomImage
                  v-if="block.image_enabled === 'true'"
                  :image-url="block.image_url"
                  :image-url-mobile="block.image_url_mobile"
                  :image-fit="block.image_fit"
                  :image-fit-mobile="block.image_fit_mobile"
                  :image-mobile-full-width="block.image_mobile_full_width === 'true'"
                  :image-position="block.image_position"
                  :image-position-mobile="block.image_position_mobile"
                  :image-caption="block.image_caption"
                  :slider-enabled="sliderEnabled"
                  :slider-loaded="sliderLoaded"
                  :content-settings="block.content_for === 'image' ? { 'text-alignment': block.text_alignment, 'text-alignment-mobile': block.text_alignment_mobile, 'heading': block.heading, 'heading-color': block.heading_color, 'heading-color-mobile': block.heading_color_mobile, 'heading-font-size': block.heading_fontsize, 'heading-font-size-mobile': block.heading_fontsize_mobile, 'heading-fontweight': block.heading_fontweight, 'subheading': block.subheading, 'subheading-color': block.subheading_color, 'subheading-color-mobile': block.subheading_color_mobile, 'subheading-font-size': block.subheading_fontsize, 'subheading-font-size-mobile': block.subheading_fontsize_mobile, 'subheading-fontweight': block.subheading_fontweight, 'content': block.content, 'content-color': block.content_color, 'content-color-mobile': block.content_color_mobile, 'content-font-size': block.content_fontsize, 'content-font-size-mobile': block.content_fontsize_mobile, 'content-fontweight': block.content_fontweight } : {}"
                  :lazy-load="lazyLoad"
                />

                <AtomVideo
                  v-if="block.video_enabled === 'true' && (sliderEnabled && sliderLoaded || !sliderEnabled)"
                  :shop-url="shopUrl"
                  :video-settings="{ type: block.video_type, id: block.video_id }"
                  :object-fit="block.video_object_fit"
                  :slider-enabled="sliderEnabled"
                  :slider-loaded="sliderLoaded"
                  :section-id="sectionId"
                  :block-index="i"
                  :section-index="index"
                  :content-settings="block.content_for === 'video' ? { 'text-alignment': block.text_alignment, 'text-alignment-mobile': block.text_alignment_mobile, 'heading': block.heading, 'heading-color': block.heading_color, 'heading-color-mobile': block.heading_color_mobile, 'heading-font-size': block.heading_fontsize, 'heading-font-size-mobile': block.heading_fontsize_mobile, 'heading-fontweight': block.heading_fontweight, 'subheading': block.subheading, 'subheading-color': block.subheading_color, 'subheading-color-mobile': block.subheading_color_mobile, 'subheading-font-size': block.subheading_fontsize, 'subheading-font-size-mobile': block.subheading_fontsize_mobile, 'subheading-fontweight': block.subheading_fontweight, 'content': block.content, 'content-color': block.content_color, 'content-color-mobile': block.content_color_mobile, 'content-font-size': block.content_fontsize, 'content-font-size-mobile': block.content_fontsize_mobile, 'content-fontweight': block.content_fontweight } : {}"
                />

                <AtomTextBlock
                  v-if="block.content_enabled === 'true' && block.content_for === 'standalone'"
                  :heading-subheading-section-mobile="block.heading_subheading_section_mobile === 'true'"
                  :horizontal-alignment="block.content_horizontal_alignment"
                  :vertical-alignment="block.content_vertical_alignment"
                  :text-alignment="block.text_alignment"
                  :text-alignment-mobile="block.text_alignment_mobile"
                  :heading="block.heading"
                  :heading-color="block.heading_color"
                  :heading-color-mobile="block.heading_color_mobile"
                  :heading-font-size="block.heading_fontsize"
                  :heading-font-size-mobile="block.heading_fontsize_mobile"
                  :heading-fontweight="block.heading_fontweight"
                  :subheading="block.subheading"
                  :subheading-color="block.subheading_color"
                  :subheading-color-mobile="block.subheading_color_mobile"
                  :subheading-font-size="block.subheading_fontsize"
                  :subheading-font-size-mobile="block.subheading_fontsize_mobile"
                  :subheading-fontweight="block.subheading_fontweight"
                  :content="block.content"
                  :content-color="block.content_color"
                  :content-color-mobile="block.content_color_mobile"
                  :content-font-size="block.content_fontsize"
                  :content-font-size-mobile="block.content_fontsize_mobile"
                  :content-fontweight="block.content_fontweight"
                  :button-text="block.button_text"
                  :button-link="block.button_link"
                  :button-color="block.button_color"
                  :button-text-color="block.button_text_color"
                  :link-text="block.link_text"
                  :link-href="block.link_href"
                  :link-color="block.link_color"
                  :slider-enabled="sliderEnabled"
                  :slider-loaded="sliderLoaded"
                  :cta-styles="{
                    'flex': true,
                    'items-center': true,
                    [block.cta_horizontal_alignment]: true
                  }"
                  @useMobileSectionHeadingsFromCTA="setMobileSectionHeadingsFromCTA"
                />

                <AtomProduct
                  v-if="block.product_enabled === 'true'"
                  :product-json-url="`/products/${block.product}.js`"
                  :subscription-product-handle="block.subscription_product"
                  :meta-box-title="block.product_box_title"
                  :meta-box-desc="block.product_box_desc"
                  :meta-subscriptions-savings-text="block.product_subscription_savings_text"
                  :slider-enabled="sliderEnabled"
                />

                <AtomHtml
                  v-if="block.html_enabled === 'true'"
                  :horizontal_alignment="block.html_horizontal_alignment"
                  :vertical_alignment="block.html_vertical_alignment"
                  :index="i"
                  :slider-enabled="sliderEnabled"
                >
                  <template :slot="`html-${i}`">
                    <slot :name="`html-${i}`" />
                  </template>
                </AtomHtml>

                <AtomSliders
                  v-if="block.sliders_enabled === 'true'"
                  :bad-impressions="[
                    { src: filesUrlFormatted + block.bad_impression_img_1, position: 1, label: block.bad_impression_label_1 },
                    { src: filesUrlFormatted + block.bad_impression_img_2, position: 2, label: block.bad_impression_label_2 },
                    { src: filesUrlFormatted + block.bad_impression_img_3, position: 3, label: block.bad_impression_label_3 },
                    { src: filesUrlFormatted + block.bad_impression_img_4, position: 4, label: block.bad_impression_label_4 }
                  ]"
                  :good-impressions="[
                    { src: filesUrlFormatted + block.good_impression_img_1, position: 1, label: block.good_impression_label_1 },
                    { src: filesUrlFormatted + block.good_impression_img_2, position: 2, label: block.good_impression_label_2 },
                    { src: filesUrlFormatted + block.good_impression_img_3, position: 3, label: block.good_impression_label_3 },
                    { src: filesUrlFormatted + block.good_impression_img_4, position: 4, label: block.good_impression_label_4 }
                  ]"
                />
              </div>
            </wrapped-component>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import video from '../../mixins/video';
import AtomImage from './atoms/atom-image';
import AtomVideo from './atoms/atom-video';
import AtomTextBlock from './atoms/atom-text-block';
import AtomProduct from './atoms/atom-product';
import AtomHtml from './atoms/atom-html';
import AtomSliders from './atoms/atom-sliders';
import VueSlickCarousel from 'vue-slick-carousel';
import 'vue-slick-carousel/dist/vue-slick-carousel.css';
import WrappedComponent from "../utilities/wrapped-component";

export default {
  name: "RsSection",
  components: { AtomImage, AtomVideo, AtomTextBlock, AtomProduct, AtomHtml, AtomSliders, VueSlickCarousel, WrappedComponent },
  mixins: [ video ],
  props: {
    sectionSettings: {
      type: Object,
      required: true,
      default: () => {}
    },
    filesUrl: { type: String, default: "" },
    shopUrl: { type: String, default: "" },
    sectionId: { type: String, default: "" },
    index: { type: Number, default: 0 },
    lazyLoad: { type: Boolean, default: true }
  },
  data: function () {
    return {
      slickSlider: {
        dots: false,
        arrows: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        // adaptiveHeight: true,
        autoplay: (this.sectionSettings.slider_enable_autoplay === 'true'),
        autoplaySpeed: parseInt(this.sectionSettings.slider_autoplay_time),
        responsive: [
          {
            breakpoint: 640,
            settings: {
              adaptiveHeight: false,
              dots: true,
              arrows: false,
            }
          }
        ]
      },
      tabs: {},
      tabsEnabled: this.sectionSettings.tabs_enabled === 'true',
      sliderEnabled: this.sectionSettings.slider_enabled === 'true',
      sliderEnabledMobile: this.sectionSettings.slider_enabled_mobile === 'true',
      sliderLoaded: false,
      minHeightEnabled: this.sectionSettings.section_min_height_enabled === 'true',
      evenHeightColumnsEnabled: this.sectionSettings.section_even_height_columns_enabled === 'true',
      backgroundVideoEnabled: this.sectionSettings.background_video_enabled === 'true',
      backgroundCurveEnabled: this.sectionSettings.background_curve_enabled === 'true',
      backgroundTwoToneEnabled: this.sectionSettings.background_two_tone_enabled === 'true',
      backgroundImageEnabled: this.sectionSettings.background_image_enabled === 'true',
      backgroundColorEnabled: this.sectionSettings.background_color_enabled === 'true',
      minHeight: 1000,
      sectionStyles: '',
      prevIcon: '<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="18" cy="18" r="18" transform="rotate(-180 18 18)" fill="currentColor"/><path d="M21 25L14 18L21 11" stroke="#7DADA0" stroke-width="2"/>',
      nextIcon: '<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="18" cy="18" r="18" fill="currentColor"/><path d="M15 11L22 18L15 25" stroke="#7DADA0" stroke-width="2"/></svg>',
      mobileSectionHeadingsHTML: ""
    }
  },
  computed: {
    ...mapGetters({
      windowWidth: 'window-width/WindowWidth',
    }),
    filesUrlFormatted: function () {
      return this.filesUrl.split('files/?')[0];
    },
    sectionHeight: function () {
      return this.$refs.section.offsetHeight;
    },
    numBlocks: function () {
      return this.sectionSettings.blocks.length;
    },
    blockWidths: function () {
      return this.sectionSettings.section_item_widths ? this.sectionSettings.section_item_widths.split(',') : Array(this.numBlocks).fill(100/this.numBlocks);
    },
    numBlockRows: function () {
      return Math.ceil(this.blockWidths.reduce((a, b) => { a += parseInt(b); return a; }, 0) / 100);
    },
    backgroundStyles: function () {
      let styles = {
        '--transform': `scale(${this.sliderEnabled ? '1' : this.numBlockRows})`,
        '--height': `calc(100% * 2)`, // `calc(100% * ${this.sliderEnabled ? '1' : this.numBlockRows})`,
        '--section-curved-padding-top': `${this.sectionSettings.section_curved_padding_top}%`,
        '--section-curved-padding-bottom': `${this.sectionSettings.section_curved_padding_bottom}%`,
        '--section-curved-padding-top-mobile': `${this.sectionSettings.section_curved_padding_top_mobile}%`,
        '--section-curved-padding-bottom-mobile': `${this.sectionSettings.section_curved_padding_bottom_mobile}%`
      };
      if (this.backgroundImageEnabled) {
        let urlParts = this.filesUrl.split('files/?');
        urlParts.splice(urlParts.length - 1, 0, `${this.sectionSettings.background_image}?`);
        const url = urlParts.join('');
        styles = { ...styles, ...{ background: `url(${url}) center/cover no-repeat` } };
      } else if (this.backgroundColorEnabled) {
        styles = { ...styles, ...{ background: this.sectionSettings.background_color } };
      }
      if (this.backgroundCurveEnabled) {
        styles = {
          ...styles,
          ...{
            '--background-clip-path__bottom': this.sectionSettings.background_curve === 'left' ? `ellipse(200% 25vh at 90% 0%)` : `ellipse(200% 25vh at 10% 0%)`,
            '--background-clip-path__top': this.sectionSettings.background_curve === 'left' ? `ellipse(200% 25vh at 90% -22vh)` : `ellipse(200% 25vh at 10% -22vh)`,
          }
        }
      }
      if (this.backgroundTwoToneEnabled) {
        styles = {
          ...styles,
          ...{
            '--tone-background': `${this.hexToRgba(this.sectionSettings.background_two_tone_color, .5)}`
          }
        }
      }
      if (this.sectionSettings.section_width) {
        styles = {
          ...styles,
          ...{
            'max-width': this.sectionSettings.section_width,
            'margin-left': 'auto',
            'margin-right': 'auto'
          }
        }
      }
      return styles;
    },
    addClasses: function () {
      return {
        class: {
          'p-0': true,
          'lg:p-8': true,
          'min-h-12.5': this.minHeightEnabled,
          'sm:min-h-25': this.minHeightEnabled,
          'lg:min-h-50': this.minHeightEnabled,
          'block': this.sliderEnabled,
          'flex': !this.sliderEnabled,
          'flex-wrap': !this.sliderEnabled,
          'items-stretch': !this.sliderEnabled && this.evenHeightColumnsEnabled,
          // 'items-center': !this.sliderEnabled,
          'flex-col': !this.sliderEnabled,
          'lg:flex-row': !this.sliderEnabled,
          /*'lg:flex-row-reverse': this.sectionSettings.section_layout_direction === 'reverse' && !this.sliderEnabled,*/
          'flex-col-reverse': this.sectionSettings.section_layout_direction === 'reverse' && !this.sliderEnabled,
          [this.sectionSettings.section_blocks_horizontal_alignment]: true,
          [this.sectionSettings.section_blocks_vertical_alignment]: !this.sliderEnabled
        }
      };
    },
    playerSelector: function () {
      return `player-${this.sectionId}-${this.index}`;
    }
  },
  watch: {
    windowWidth: function (after, before) {
      if (after !== before) {
        this.setSlider();
      }
    }
  },
  beforeMount: async function () {
    if (this.backgroundVideoEnabled) {
      this.videoType = this.sectionSettings.background_video_type;
      this.videoId = this.sectionSettings.background_video_id;
      await this.$nextTick();
      this.initPlayer({ origin: this.shopUrl, host: 'https://www.youtube.com' });
    }

    if (this.tabsEnabled) this.initTabs();
  },
  mounted: function () {
    this.minHeight = this.$refs?.section?.clientHeight;
    this.setSlider();
  },
  methods: {
    getBlockStyles: function (i) {
      return {
        flex: this.tabsEnabled ? '0 0 100%' : `0 0 ${this.blockWidths[i]}%`,
        // width: `${this.blockWidths[i]}%`,
        height: 'auto' // this.sliderEnabled ? `${this.minHeight}px` : 'auto'
      };
    },
    setTab: function (tab) {
      for (let tab in this.tabs) {
        this.tabs[tab] = false;
      }
      this.tabs[tab] = true;
    },
    initTabs: function () {
      if ( this.sectionSettings.blocks && this.sectionSettings.blocks.length ) {
        this.tabs = this.sectionSettings.blocks.reduce((a, b) => { a[b.heading] = false; return a; }, {});
        Object.keys(this.tabs).forEach((t, i) => {
          this.$set( this.tabs, t, i===0 ? true : false );
        });
      }
    },
    setMobileSectionHeadingsFromCTA: function (html) {
      this.mobileSectionHeadingsHTML = html;
    },
    setSlider: function () {
      this.sliderEnabled = ((this.sliderEnabledMobile && this.windowWidth < 1024) || this.sectionSettings.slider_enabled === 'true') ? true : false;
    }
  }
}
</script>

<style lang="scss">
  $sage: #7DADA0;

  .rs-section--container {
    &.pad {
      padding-top: 2rem;
      padding-bottom: 2rem;

      @media screen and (max-width: 1023px) {
        padding-top: 1rem;
        padding-bottom: 1rem;
      }
    }

    .section-background {
      position: relative;
      overflow: hidden;

      &.two-tone {
        &:after {
          content: '';
          background: radial-gradient(160% 50% at top, var(--tone-background) 100%, transparent 0%);
          position: absolute;
          width: 100%;
          top: 0;
          left: 0;
          height: 100%;
          z-index: -1;

          @media screen and (max-width: 1024px) {
            background: radial-gradient(210% 50% at top, var(--tone-background) 100%, transparent 0%);
          }
          @media screen and (min-width: 1800px) {
            background: radial-gradient(105% 50% at top, var(--tone-background) 100%, transparent 0%);
          }
        }
      }

      &.curved {
        &:not(.curved--single--bottom--even) {
          mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1440 805' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath transform='scale(-1 1) translate(-1440 0)' d='M-54 80.8547C549.69 91.9308 887.487 74.193 1488.79 0.000489817L1526.62 721.813C923.791 793.71 585.969 811.653 -16.1714 802.667L-54 80.8547Z' fill='currentColor'/%3E%3C/svg%3E%0A"),url("data:image/svg+xml,%3Csvg viewBox='0 0 1440 805' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath transform='scale(-1 1) translate(-1440 0)' d='M-54 80.8547C549.69 91.9308 887.487 74.193 1488.79 0.000489817L1526.62 721.813C923.791 793.71 585.969 811.653 -16.1714 802.667L-54 80.8547Z' fill='currentColor'/%3E%3C/svg%3E%0A");
          mask-size: cover;
          mask-repeat: no-repeat;
          mask-position: top, bottom;
          mask-composite: destination-in;

          // @media screen and (max-width: 767px) {
          //   &:before {
          //     content: '';
          //     padding-top: 30%;
          //     display: block;
          //   }
          // }
          // @media screen and (min-width: 768px) and (max-width: 1023px) {
          @media screen and (max-width: 1023px) {
            &:before {
              content: '';
              // padding-top: 15%;
              padding-top: var(--section-curved-padding-top-mobile);
              display: block;
            }
            &:after {
              content: '';
              // padding-bottom: 5%;
              padding-top: var(--section-curved-padding-bottom-mobile);
              display: block;
            }
          }
          // &.slider, &.tabs-enabled {
            @media screen and (min-width: 1024px) {
              &:before {
                content: '';
                // padding-top: 5%;
                padding-top: var(--section-curved-padding-top);
                display: block;
              }
              &:after {
                content: '';
                // padding-bottom: 5%;
                padding-top: var(--section-curved-padding-bottom);
                display: block;
              }
            }
          // }
        }

        &.right {
          mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1440 805' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M-54 80.8547C549.69 91.9308 887.487 74.193 1488.79 0.000489817L1526.62 721.813C923.791 793.71 585.969 811.653 -16.1714 802.667L-54 80.8547Z' fill='currentColor'/%3E%3C/svg%3E%0A"), url("data:image/svg+xml,%3Csvg viewBox='0 0 1440 805' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M-54 80.8547C549.69 91.9308 887.487 74.193 1488.79 0.000489817L1526.62 721.813C923.791 793.71 585.969 811.653 -16.1714 802.667L-54 80.8547Z' fill='currentColor'/%3E%3C/svg%3E%0A");
        }

        &--single {
          mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1440 805' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath transform='scale(-1 1) translate(-1440 0)' d='M-54 80.8547C549.69 91.9308 887.487 74.193 1488.79 0.000489817L1526.62 721.813C923.791 793.71 585.969 811.653 -16.1714 802.667L-54 80.8547Z' fill='currentColor'/%3E%3C/svg%3E%0A");
          mask-size: cover;
          mask-repeat: no-repeat;

          &.right {
            mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1440 805' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M-54 80.8547C549.69 91.9308 887.487 74.193 1488.79 0.000489817L1526.62 721.813C923.791 793.71 585.969 811.653 -16.1714 802.667L-54 80.8547Z' fill='currentColor'/%3E%3C/svg%3E%0A");
          }

          &.top {
            mask-position: top;
            &--left {
              mask-position: top;
              mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1440 805' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath transform='scale(-1 1) translate(-1440 0)' d='M -54 80.8547 C 549.69 91.9308 887.487 74.193 1488.79 0.0005 L 1488.79 805 C 922 805 598 805 -54 805 L -54 80.8547 Z' fill='currentColor'/%3E%3C/svg%3E%0A");
            }
            &--right {
              mask-position: top;
              mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1440 805' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M -54 80.8547 C 549.69 91.9308 887.487 74.193 1526.62 1 L 1526.62 805 C 923.791 805 585.969 805 -54 799 L -54 80.8547 Z' fill='currentColor'/%3E%3C/svg%3E%0A");
            }
          }

          &.center {
            mask-position: center;
          }

          &.bottom {
            mask-position: bottom;
          }

          &--bottom {
            &--even {
              mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1440 825' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0H1440V781C875.999 839.257 560.745 839.761 0 781V0Z' fill='currentColor'/%3E%3C/svg%3E%0A");
              mask-size: cover;
              mask-repeat: no-repeat;
              mask-position: bottom;
              @media screen and (max-width: 480px) {
                mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1440 800' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0H1440V681C875.999 839.257 560.745 839.761 0 681V0Z' fill='currentColor'/%3E%3C/svg%3E%0A");
              }
            }
          }
        }

        // clip-path: var(--background-clip-path__bottom);

        // &:before {
        //   content: "";
        //   position: absolute;
        //   width: 100%;
        //   height: 100%;
        //   z-index: 1;
        //   background: #FFF;
        //   top: 0;
        //   clip-path: var(--background-clip-path__top);
        // }
      }

      .section-overlay {
        &:after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          // background: rgba(0, 0, 0, .3);
          z-index: -1;
        }

        .customizable-blocks {
          // &__heading {}
          &__content {
            // @media screen and (max-width: 640px) {
            //   .slick-list { max-height: 720px; }
            // }
            .slick-slider {
              .slick-arrow {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                z-index: 1;
                color: #FFF;
                cursor: pointer;
                &:hover {
                  color: rgba(204, 204, 204, .8);
                }
                &.slick-prev {
                  left: 0;
                }
                &.slick-next {
                  right: 0;
                }
              }
            }
            &--block {
              &.min-pad {
                padding-bottom: 56.25%;
              }
            }
            // &--overlay {}

            .tab-labels {
              > div {
                .tab-label:first-of-type {
                  border-bottom: 3px solid transparent;
                }
                &.selected {
                  .tab-label:first-of-type {
                    border-bottom: 3px solid $sage;
                  }
                }
              }
            }
          }
        }
      }

      .video-player {
        position: absolute;
        top: -50%;
        left: 0;
        width: 100%;
        height: var(--height);
        transform: var(--transform);
      }
    }
  }
</style>