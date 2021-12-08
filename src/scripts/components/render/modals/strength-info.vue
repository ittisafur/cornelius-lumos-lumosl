<template>
  <div>
    <div class="modal-header">
      <slot name="header">
        <div class="py-4 lg:p-4 header text-center">
          <span
            class="mx-auto text-sm mint-stroke dark-green-fill flex items-center justify-center h-16 w-16 rounded-full uppercase text-center"
            style="border: 2px solid rgb(191, 250, 234);"
          >
            Lumos Info
          </span>
          <div class="text-lg lg:text-2xl py-4 lg:p-4">
            What&rsquo;s My Gel Whitening Strength?
          </div>
        </div>
      </slot>
    </div>
    <div class="modal-body">
      <slot name="body">
        <div class="py-4 body text-center">
          <ul class="mx-auto info-tabs flex justify-between items-center pale-mint-fill dark-green-stroke rounded-full">
            <li
              v-for="(tab, key) in tabs"
              :key="key"
              class="p-2 lg:py-3 lg:px-6 cursor-pointer text-xs lg:text-sm"
              :class="{ 'is-active': tabs[key].active }"
              @click="setTab(key)"
            >
              {{ key }}
            </li>
          </ul>
          <div class="py-4 lg:p-4">
            {{ tabContent }}
          </div>
          <div class="py-4 lg:p-4">
            <ul class="mx-auto conditions list-disc mint-markers">
              <li>Info goes here for condition</li>
              <li>Info goes here for condition</li>
              <li>Info goes here for condition</li>
              <li>Info goes here for condition</li>
            </ul>
          </div>
          <div class="py-4 lg:p-4">
            <div>
              Questions?
              <a
                href="/pages/faq"
                class="neon-sky-stroke"
              >
                Check out our FAQs
              </a>
            </div>
          </div>
          <div class="py-4 lg:p-4">
            For a Free teeth whitening consulation, please <a
              href="/pages/contact"
              class="neon-sky-stroke"
            >contact us</a>. We&rsquo;re happy to help.
          </div>
          <div class="italic">
            These recomendations are general and may not fit your specific needs.
          </div>
        </div>
      </slot>
    </div>
    <div class="modal-footer">
      <slot name="footer">
        <button
          class="mx-auto modal-default-button"
          @click="hide"
        >
          Close
        </button>
      </slot>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapMutations } from 'vuex';
  // import axios from 'axios';
  // const API_URL = "";

  export default {
    name: "StrengthInfo",
    props: { data: { type: Object, default: () => {} } },
    data: function () {
      return {
        email: "",
        errors: [],
        tabs: {
          "Level 1 - 10% Strength": { active: true, content: "1) Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut quam commodo tempus duis sapien integer ac sapien. Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
          "Level 2 - 10% Strength": { active: false, content: "2) Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut quam commodo tempus duis sapien integer ac sapien. Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
          "Level 3 - 10% Strength": { active: false, content: "3) Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut quam commodo tempus duis sapien integer ac sapien. Lorem ipsum dolor sit amet, consectetur adipiscing elit." }
        }
      }
    },
    computed: {
      tabContent: function () {
        return this.tabs[Object.keys(this.tabs).find(key => this.tabs[key].active)].content;
      }
    },
    methods: {
       ...mapActions({
        toggle: 'modal/toggle',
        show: 'modal/show',
        hide: 'modal/hide'
      }),
      ...mapMutations({
        showNotification: 'notifications/showNotification',
        setNotification: 'notifications/setNotification'
      }),
      setTab: function (key) {
        Object.keys(this.tabs).forEach(key => this.$set(this.tabs, key, { ...this.tabs[key], ...{ active: false } }));
        this.$set(this.tabs, key, { ...this.tabs[key], ...{ active: true } });
      }
    }
  }
</script>

<style lang="scss" scoped>
  $mint: #BFFAEA;
  $pale-mint: #F0F8F6;
  $sage: #7DADA0;
  $dark-green: #21493E;
  $blue: #3991F2;
  $black: #29302E;
  $white: #FFFFFF;
  $color-success: #189D3D;
  $color-error: #CE0000;

  label { margin: 0; }
  
  .header {
    border-bottom: 1px solid $sage;
  }

  .body {
    .info-tabs {
      .is-active {
        border-radius: 9999px;
        background: $dark-green;
        color: #FFF;
      }
    }

    ul {
      width: fit-content;
      li {
        width: fit-content;
      }
    }
  }
</style>