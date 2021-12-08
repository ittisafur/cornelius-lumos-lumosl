<template>
  <div>
    <!-- tabs -->
    <div
      v-if="[ 'tabs', 'all' ].indexOf(type) !== -1"
      class="tabs py-16 w-full mx-auto"
      :class="{ 'hidden': type === 'all', 'lg:block': type === 'all' }"
    >
      <div class="tab-labels flex w-2/3 justify-between mx-auto mb-8">
        <div
          v-for="( content, label ) in nameValue"
          :key="label"
          :class="[{'selected': tabs[label], 'reviews-tab': initReviewsWidget && label.toLowerCase() === 'reviews'}]"
          class="tab-label cursor-pointer py-4 px-6 flex items-center"
          @click.prevent="setTab(label)"
        >
          {{ label }}
          <span
            v-if="reviewsStars && initReviewsWidget && label.toLowerCase() === 'reviews'"
            class="ml-2"
            v-html="reviewsStars"
          />
        </div>
      </div>
      <div class="tab-contents w-2/3 mx-auto relative">
        <div
          v-for="( content, label ) in nameValue"
          v-show="tabs[label]"
          :key="label"
          class="tab-content relative top-0 left-0 w-full"
          v-html="content"
        />
      </div>
    </div>
    <!-- accordions -->
    <div
      v-if="[ 'accordions', 'all' ].indexOf(type) !== -1"
      class="accordions w-full mx-auto"
      :class="{ 'block': type === 'all', 'lg:hidden': type === 'all' }"
    >
      <div
        v-for="( content, label ) in nameValue"
        :key="label"
        :class="{ 'expanded': accordion[label], 'enable-background': accordionBackgroundEnabled }"
        class="accordion-wrapper p-4"
      >
        <div
          class="flex justify-center items-center"
          :class="{ 'accordion-label': true, 'is-active': accordion[label] }"
          @click.prevent="toggleAccordion(label)"
        >
          <span class="toggle-label pr-2 flex items-center">
            {{ label }}
            <span
              v-if="reviewsStars && initReviewsWidget && label.toLowerCase() === 'reviews'"
              class="ml-2"
              v-html="reviewsStars"
            />
          </span>
          <span :class="{ 'toggle-icon': true, 'is-active': accordion[label] }" />
        </div>
        <div
          :class="{ 'accordion-content': true, 'is-active': accordion[label] }"
          :style="[ accordion[label] ? { maxHeight:'48em' } : '' ]"
          v-html="content"
        />
      </div>
    </div>

    <div
      v-for="( modal, trigger ) in modals"
      :key="trigger"
    >
      <modal
        v-if="modals[ trigger ].show"
        @close="hideModal( trigger )"
      >
        <a
          slot="header"
          class="modal-default-button close"
          @click="hideModal( trigger )"
        >
          Close
        </a>
        <div
          slot="body"
          class=""
          v-html="modal.content"
        />
        <div slot="footer" />
      </modal>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import modal from "./modal";

  export default {
    name: "TabsAccordions",
    components: { modal },
    props: { 
      data: { type: Object, default: () => {} },
      type: { type: String, default: "all" },
      accordionBackgroundEnabled: { type: Boolean, default: true },
      initReviewsWidget: { type: Boolean, default: false },
      reviewsStars: { type: String, default: "" }
    },
    data: function () {
      return {
        nameValue: {},
        tabs: {},
        accordion: {},
        modals: {}
      }
    },
    computed: {},
    beforeMount: function () {
      this.nameValue = { ...this.data };
      this.initTabs();
      this.initAccordion();
    },
    mounted: function () {
      this.initModals();
    },
    methods: {
      ...mapActions({
        hide: 'modal/hide'
      }),
      setTab: function (tab) {
        for (let tab in this.tabs) {
          this.tabs[tab] = false;
        }
        this.tabs[tab] = true;

        //TODO: for Okendo...
        if (this.initReviewsWidget && tab.toLowerCase() === 'reviews') document.dispatchEvent( new CustomEvent("vue:component:tabs-accordions:clicked") );
      },
      toggleAccordion: function (accordion) {
        this.accordion[accordion] = !this.accordion[accordion];

        //TODO: for Okendo...
        if (this.initReviewsWidget && accordion.toLowerCase() === 'reviews') document.dispatchEvent( new CustomEvent("vue:component:tabs-accordions:clicked") );
      },
      initAccordion: function () {
        if ( this.nameValue && Object.keys(this.nameValue).length ) {
          this.accordion = { ...this.nameValue };
          Object.keys(this.accordion).forEach((t, i) => {
            this.$set( this.accordion, t, i===0 ? true : false );
          })
        }
      },
      initTabs: function () {
        if ( this.nameValue && Object.keys(this.nameValue).length ) {
          this.tabs = { ...this.nameValue };
          Object.keys(this.tabs).forEach((t, i) => {
            this.$set( this.tabs, t, i===0 ? true : false );
          })
        }
      },
      initModals: function () {
        let modals = document.querySelectorAll('[data-modal="true"]');
        if ( modals && modals.length ) {
          modals.forEach(m => {
            this.$set( this.modals, m.innerHTML, { content: m.dataset.content, show: false } );
            m.addEventListener( 'click', this.showModal );
            m.classList.add( 'cursor-pointer' );
            m.style.color = '#7ca7ad';
          });
        }
      },
      showModal: function ( e ) {
        this.modals[ e.target.innerHTML ].show = true;
      },
      hideModal: function ( key ) {
        this.modals[ key ].show = false;
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
  $blue: #3991F2;
  $black: #29302E;
  $white: #FFFFFF;
  $color-success: #189D3D;
  $color-error: #CE0000;
  $mobile: 767px;
  $desktop: 1023px;

  .tabs {
    height: auto;
    min-height: 33vh;

    .tab-labels {
      color: $black;
      border-bottom: 1px solid $sage;

      .tab-label {
        &.selected {
          border-bottom: 2px solid $sage;
        }
      }
    }

    .tab-contents {
      .tab-content {
        p { margin: 1em 0; }

        ul {
          list-style-type: disc;
          padding-left: 1em;
        }

        img {
          width: auto;
        }
      }
    }
  }

  .accordions {
    .accordion-wrapper {
      // border-bottom: 1px solid #e3e3e3;
      transition: all .4s ease-in-out;

      &.expanded {
        &.enable-background {
          border: 1px solid $mint;
          background: $pale-mint;
        }
      }

      .accordion-label {
        width: 100%;
        display: flex;
        padding: 20px 0;
        cursor: pointer;
        text-transform: capitalize;

        @media (max-width: $desktop){
          padding: 0;
        }

        .toggle-label { width: calc(100% - 11px); font-weight: 500; }
        .toggle-icon {
          position: relative;
          width: 11px;
          height: 11px;

          &:before, &:after {
            position: absolute;
            content: '';
            top: 50%;
            left: 50%;
            background-color: currentColor;
            transform: translate(-50%, -50%) rotate(-90deg);
            transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
          }

          &:before {
            width: 11px;
            height: 1px;
          }

          &:after {
            width: 1px;
            height: 11px;
          }

          &.is-active {
            &:before {
              opacity: 0;
            }
            &:after {
              transform: translate(-50%, -50%) rotate(90deg);
            }
          }
        }
      }
      .accordion-content {
        line-height: 22px;
        padding: 0 0 20px;
        max-height: 0;
        visibility: hidden;
        opacity: 0;
        overflow: hidden;
        transition: max-height 0.4s ease-in-out, visibility 0.4s ease-in-out, opacity 0.4s ease-in-out;

        @media (max-width: $desktop){
          padding: 0;
        }

        &.is-active {
          visibility: visible;
          opacity: 1;
        }
      }
    }
  }

  .rs-pdp-tabs {
    .accordions {
      .accordion-wrapper {
        border-top: 1px solid $sage;

        &:last-child {
          border-bottom: 1px solid $sage;
        }
      }
    }
  }
</style>