<template>
  <div
    class="rs-before-after--container"
  >
    <div
      class="section-background py-8 sm:py-0"
      :class="{ curved: sectionSettings.background_curve_enabled === 'true', right: sectionSettings.background_curve === 'right' }"
      :style="backgroundStyles"
    >
      <div
        v-if="sectionSettings.background_video_enabled === 'true'"
        :id="playerSelector"
        class="video-player"
      />
      <div class="section-overlay w-full h-full flex items-center">
        <div
          class="container customizable-blocks"
          :class="{ 'py-8': tabsEnabled, 'lg:py-16': tabsEnabled }"
        >
          <div
            v-if="sectionSettings.section_header"
            class="customizable-blocks__heading mb-2 md:mb-4"
          >
            <div
              class="tracking-wider"
              :class="[
                sectionSettings.section_heading_text_alignment,
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
                sectionSettings.section_sub_heading_text_alignment,
                sectionSettings.section_sub_heading_fontsize_mobile,
                `lg:${sectionSettings.section_sub_heading_fontsize}`,
                sectionSettings.section_sub_heading_fontweight
              ]"
              :style="{ color: windowWidth > 768 ? sectionSettings.section_sub_heading_color : sectionSettings.section_sub_heading_color_mobile }"
            >
              {{ sectionSettings.section_sub_header }}
            </div>
          </div>

          <div
            v-if="sectionSettings.blocks"
            class="customizable-blocks__content mt-8 p-0 lg:p-8"
          >
            <template v-if="tabsEnabled">
              <div class="tab-labels flex w-full md:w-4/5 lg:w-2/3 xl:w-1/2 justify-between mx-auto mb-8">
                <div
                  v-for="(block, i) in sectionSettings.blocks"
                  :key="i"
                  :class="[
                    { 'selected': tabs[block['b_and_a-name']] },
                    `w-1/${sectionSettings.blocks.length}`,
                    'cursor-pointer'
                  ]"
                  @click.prevent="setTab(block['b_and_a-name'])"
                >
                  <div class="">
                    <img
                      class="rounded-full h-12 w-12 sm:h-24 sm:w-24 mx-auto"
                      :src="block['b_and_a-profile_image']"
                    >
                  </div>
                  <div
                    class="text-sm sm:text-md tab-label py-4 px-0 sm:px-6 text-black text-center"
                  >
                    {{ block['b_and_a-name'] }}
                  </div>    
                </div>
              </div>
            </template>
            
            <div class="tab-contents md:px-2">
              <div
                v-for="(block, i) in sectionSettings.blocks"
                v-show="tabsEnabled ? tabs[block['b_and_a-name']] : true"
                :key="i"
                :class="`tab-content customizable-blocks__content--block relative w-full h-full flex justify-between`"
                :style="getBlockStyles(i)"
              >
                <AtomImage
                  v-if="block['b_and_a-before_image']"
                  :image-url="block['b_and_a-before_image']"
                  :image-url-mobile="block['b_and_a-before_image']"
                  :content-settings="{ 'text-alignment': block.text_alignment, 'text-alignment-mobile': block.text_alignment_mobile, 'subheading': block.before, 'subheading-color': block.before_color, 'subheading-color-mobile': block.before_color_mobile, 'subheading-font-size': block.before_fontsize, 'subheading-font-size-mobile': block.before_fontsize_mobile, 'subheading-fontweight': block.before_fontweight }"
                  class="w-9/20"
                />
                <AtomImage
                  v-if="block['b_and_a-after_image']"
                  :image-url="block['b_and_a-after_image']"
                  :image-url-mobile="block['b_and_a-after_image']"
                  :content-settings="{ 'text-alignment': block.text_alignment, 'text-alignment-mobile': block.text_alignment_mobile, 'subheading': block.after, 'subheading-color': block.after_color, 'subheading-color-mobile': block.after_color_mobile, 'subheading-font-size': block.after_fontsize, 'subheading-font-size-mobile': block.after_fontsize_mobile, 'subheading-fontweight': block.after_fontweight }"
                  class="w-9/20"
                />
              </div>
            </div>
            <div class="cta text-center mt-4">
              <div
                v-if="sectionSettings.button_text && sectionSettings.button_link"
                class="text-block__button"
              >
                <button
                  class="button-primary font-semibold tracking-wide text-sm rounded-3xl border-none inline-block border text-base font-medium text-center transition duration-150 px-6 xl:px-12 py-2"
                  :style="buttonStyles"
                >
                  <a
                    :href="sectionSettings.button_link"
                  >
                    {{ sectionSettings.button_text }}
                  </a>
                </button>
              </div>
              <div
                v-if="sectionSettings.link_text && sectionSettings.link_href"
                class="text-block__link mt-4"
              >
                <a
                  class="" 
                  :href="sectionSettings.link_href"
                  :style="{ color: sectionSettings.link_color }"
                >
                  {{ sectionSettings.link_text }}
                </a>
              </div>
            </div>
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

export default {
  name: "RsBeforeAfter",
  components: { AtomImage },
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
    index: { type: Number, default: 0 }
  },
  data: function () {
    return {
      tabs: {},
      tabsEnabled: true,
      minHeight: 1000,
      sectionStyles: '',
      prevIcon: '<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="18" cy="18" r="18" transform="rotate(-180 18 18)" fill="currentColor"/><path d="M21 25L14 18L21 11" stroke="#7DADA0" stroke-width="2"/>',
      nextIcon: '<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="18" cy="18" r="18" fill="currentColor"/><path d="M15 11L22 18L15 25" stroke="#7DADA0" stroke-width="2"/></svg>',
    }
  },
  computed: {
    ...mapGetters({
      windowWidth: 'window-width/WindowWidth',
    }),
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
        '--transform': `scale(${this.numBlockRows})`,
        '--height': `calc(100% * 2)`
      };
      if (this.sectionSettings.background_image_enabled === 'true') {
        let urlParts = this.filesUrl.split('files/?');
        urlParts.splice(urlParts.length - 1, 0, `${this.sectionSettings.background_image}?`);
        const url = urlParts.join('');
        styles = { ...styles, ...{ background: `url(${url}) center/cover no-repeat` } };
      } else if (this.sectionSettings.background_color_enabled === 'true') {
        styles = { ...styles, ...{ background: this.sectionSettings.background_color } };
      }
      return styles;
    },
    buttonStyles: function() {
      return {
        '--background-color': this.sectionSettings.button_color,
        '--background-color-hover': this.colorAdjust(this.sectionSettings.button_color, 20),
        'color': this.sectionSettings.button_text_color
      }
    }
  },
  watch: {},
  beforeMount: async function () {
    if (this.sectionSettings.background_video_enabled === 'true') {
      this.videoType = this.sectionSettings.background_video_type;
      this.videoId = this.sectionSettings.background_video_id;
      this.playerSelector = `player-${this.sectionId}-${this.index}`;
      await this.$nextTick();
      this.initPlayer({ origin: this.shopUrl, host: 'https://www.youtube.com' });
    }

    if (this.tabsEnabled) this.initTabs();
  },
  mounted: function () {
    this.minHeight = this.$refs?.section?.clientHeight;
  },
  methods: {
    getBlockStyles: function (i) {
      return {
        flex: this.tabsEnabled ? '0 0 100%' : `0 0 ${this.blockWidths[i]}%`,
        // width: `${this.blockWidths[i]}%`,
        height: 'auto'
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
        this.tabs = this.sectionSettings.blocks.reduce((a, b) => { a[b['b_and_a-name']] = false; return a; }, {});
        Object.keys(this.tabs).forEach((t, i) => {
          this.$set( this.tabs, t, i===0 ? true : false );
        });
      }
    },
  }
}
</script>

<style lang="scss">
  $sage: #7DADA0;
  $mint: #BFFAEA;

  .rs-before-after--container {
    padding-top: 2rem;
    padding-bottom: 2rem;

    @media screen and (max-width: 1023px) {
      padding-top: 1rem;
      padding-bottom: 1rem;
    }

    .section-background {
      position: relative;
      overflow: hidden;

      &.curved {
        mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1440 805' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath transform='scale(-1 1) translate(-1440 0)' d='M-54 80.8547C549.69 91.9308 887.487 74.193 1488.79 0.000489817L1526.62 721.813C923.791 793.71 585.969 811.653 -16.1714 802.667L-54 80.8547Z' fill='currentColor'/%3E%3C/svg%3E%0A"),url("data:image/svg+xml,%3Csvg viewBox='0 0 1440 805' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath transform='scale(-1 1) translate(-1440 0)' d='M-54 80.8547C549.69 91.9308 887.487 74.193 1488.79 0.000489817L1526.62 721.813C923.791 793.71 585.969 811.653 -16.1714 802.667L-54 80.8547Z' fill='currentColor'/%3E%3C/svg%3E%0A");
        mask-size: cover;
        mask-repeat: no-repeat;
        mask-position: top, bottom;
        mask-composite: destination-in;

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
        }
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
            @media screen and (max-width: 640px) {
              .slick-list { max-height: 720px; }
            }
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
                  img {
                    border-color: $mint;
                    border-style: solid;
                    border-width: .25rem;
                  }
                }
              }
            }

            .cta {
              button {
                background: var(--background-color);

                &:hover {
                  background: var(--background-color-hover);
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