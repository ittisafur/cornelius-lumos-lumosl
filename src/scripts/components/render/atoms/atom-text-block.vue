<template>
  <div
    :class="`customizable-blocks__content--overlay relative top-0 left-0 flex ${horizontalAlignment} ${verticalAlignment} w-full h-full py-2 lg:py-6`"
  >
    <div
      :class="[
        'text-block',
        textAlignmentMobile,
        `lg:${textAlignment}`
      ]"
    >
      <div
        v-if="heading && !enableMobileSectionHeadings"
        :class="[
          'text-block__heading',
          'tracking-wide',
          headingFontSizeMobile,
          `md:${headingFontSize}`,
          headingFontweight,
          'mb-2 md:mb-4'
        ]"
        :style="getHeadingColor"
      >
        {{ heading }}
      </div>
      <div
        v-if="subheading && !enableMobileSectionHeadings"
        :class="[
          'text-block__subheading',
          'tracking-wide',
          subheadingFontSizeMobile,
          `md:${subheadingFontSize}`,
          subheadingFontweight,
          'mb-2 md:mb-4'
        ]"
        :style="getSubheadingColor"
      >
        {{ subheading }}
      </div>
      <div
        v-if="content" 
        :class="[
          'text-block__content',
          'tracking-wide',
          contentFontSizeMobile,
          `md:${contentFontSize}`,
          contentFontweight,
          'mb-2 md:mb-4'
        ]"
        :style="getContentColor"
        v-html="content"
      />
      <div :class="ctaClasses">
        <div
          v-if="hasButton"
          class="text-block__button"
          :class="{ 'mr-4': hasLink }"
        >
          <button
            class="button button-primary font-semibold tracking-wide text-sm rounded-3xl border-none"
            :style="buttonStyles"
          >
            <a
              :href="buttonLink"
            >
              {{ buttonText }}
            </a>
          </button>
        </div>
        <div
          v-if="hasLink"
          class="text-block__link hidden lg:block"
        >
          <a
            class="" 
            :href="linkHref"
            :style="{ color: linkColor }"
          >
            {{ linkText }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { mapGetters } from "vuex";

export default {
  name: "AtomTextBlock",
  props: {
    headingSubheadingSectionMobile: {
      type: Boolean,
      default: false
    },
    horizontalAlignment: {
      type: String,
      default: "justify-center"
    },
    verticalAlignment: {
      type: String,
      default: "items-center"
    },
    textAlignment: {
      type: String,
      required: false,
      default: "text-left"
    },
    textAlignmentMobile: {
      type: String,
      required: false,
      default: "text-left"
    },
    heading: {
      type: String,
      required: false,
      default: ""
    },
    headingFontSize: {
      type: String,
      required: false,
      default: ""
    },
    headingFontSizeMobile: {
      type: String,
      required: false,
      default: ""
    },
    headingFontweight: {
      type: String,
      required: false,
      default: ""
    },
    headingColor: {
      type: String,
      required: false,
      default: ""
    },
    headingColorMobile: {
      type: String,
      required: false,
      default: ""
    },
    subheading: {
      type: String,
      required: false,
      default: ""
    },
    subheadingFontSize: {
      type: String,
      required: false,
      default: ""
    },
    subheadingFontSizeMobile: {
      type: String,
      required: false,
      default: ""
    },
    subheadingFontweight:{
      type: String,
      default: "",
    }, 
    subheadingColor: {
      type: String,
      default: "",
    },
    subheadingColorMobile: {
      type: String,
      default: "",
    }, 
    content: {
      type: String,
      required: false,
      default: ""
    },
    contentFontSize: {
      type: String,
      required: false,
      default: ""
    },
    contentFontSizeMobile: {
      type: String,
      required: false,
      default: ""
    },
    contentFontweight: {
      type: String,
      default: "",
    }, 
    contentColor: {
      type: String,
      default: "",
    },
    contentColorMobile: {
      type: String,
      default: "",
    },
    buttonText: {
      type: String,
      required: false,
      default: ""
    }, 
    buttonLink: {
      type: String,
      required: false,
      default: ""
    },
    buttonColor: {
      type: String,
      default: "",
    },
    buttonTextColor: {
      type: String,
      default: "",
    },
    linkText: {
      type: String,
      default: "",
    },
    linkHref: {
      type: String,
      default: "",
    },
    linkColor: {
      type: String,
      default: "",
    },
    ctaStyles: {
      type: Object,
      default: () => {
        return {
          "flex": true,
          "justify-between": true,
          "items-center": true
        }
      }
    },
    sliderEnabled: {
      type: Boolean,
      default: false
    },
    sliderLoaded: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      ctaClasses: this.ctaStyles
    }
  },
  computed: {
    ...mapGetters({
      windowWidth: "window-width/WindowWidth"
    }),
    hasButton: function () { return this.buttonText && this.buttonLink; },
    hasLink: function () { return this.linkText && this.linkHref; },
    currentBreakpoint: function () {
      return Object.keys(this.BREAKPOINTS).reduce((a, breakpoint) => {
        if (this.windowWidth < this.BREAKPOINTS[breakpoint]) a = breakpoint;
        return a;
      }, "xl");
    },
    getHeadingColor: function () {
      return ["md", "sm", "xsm"].indexOf(this.currentBreakpoint) !== -1
        ? `color: ${ this.headingColorMobile }`
        : `color: ${ this.headingColor }`;
    },
    getSubheadingColor: function () {
      return ["md", "sm", "xsm"].indexOf(this.currentBreakpoint) !== -1
        ? `color:${ this.subheadingColorMobile }`
        : `color:${ this.subheadingColor }`;
    },
    getContentColor: function () {
      return ["md", "sm", "xsm"].indexOf(this.currentBreakpoint) !== -1
        ? `color:${ this.contentColorMobile }`
        : `color:${ this.contentColor }`;
    },
    buttonStyles: function() {
      return {
        '--background-color': this.buttonColor,
        '--background-color-hover': this.colorAdjust(this.buttonColor, 20),
        'color': this.buttonTextColor
      }
    },
    enableMobileSectionHeadings: function () {
      return this.windowWidth <= 1024 && this.headingSubheadingSectionMobile;
    },
    mobileSectionHeadingsHTML: function () {
      return `<div class="text-block ${this.textAlignmentMobile} lg:${this.textAlignment}">
                <div class="text-block__heading tracking-wide ${this.headingFontSizeMobile} md:${this.headingFontSize} ${this.headingFontweight} mb-2 md:mb-4" style="${this.getHeadingColor}">
                  ${this.heading}
                </div>
                <div class="text-block__subheading tracking-wide ${this.subheadingFontSizeMobile} md:${this.subheadingFontSize} ${this.subheadingFontweight} mb-2 md:mb-4" style="${this.getSubheadingColor}">
                  ${this.subheading}
                </div>
              </div>`;
    }
  },
  watch: {
    windowWidth: function (after, before) {
      if (after !== before) {
        if (after > 1024) {
          this.$emit('useMobileSectionHeadingsFromCTA', "");
        } else {
          if (this.headingSubheadingSectionMobile) this.$emit('useMobileSectionHeadingsFromCTA', this.mobileSectionHeadingsHTML);
        }
        this.setCTAClasses();
      }
    }
  },
  mounted: function () {
    if (this.enableMobileSectionHeadings) this.$emit('useMobileSectionHeadingsFromCTA', this.mobileSectionHeadingsHTML);
    this.setCTAClasses();
  },
  methods: {
    setCTAClasses: function () {
      this.ctaClasses = 
        this.windowWidth > 1024
        ?
          this.ctaStyles
        :
          {
            ...this.ctaStyles,
            ...{
              "justify-start": false,
              "justify-end": false,
              "justify-between": false,
              "justify-evenly": false,
              "justify-around": false,
              "justify-center": true,
            }
          }
    }
  },
}
</script>

<style lang="scss" scoped>
  button {
    background: var(--background-color);

    &:hover {
      background: var(--background-color-hover);
    }
  }
</style>