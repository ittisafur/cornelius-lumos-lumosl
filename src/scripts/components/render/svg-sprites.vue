<template>
  <div
    id="svg-sprites"
    class="hidden"
    width="0"
    height="0"
    v-html="svg"
  />
</template>

<script>
  import axios from "axios";
  export default {
    name: 'SvgSprites',
    props: { url: { type: String, default: "" } },
    data: function () {
      return {
        svg: ""
      }
    },
    computed: {
      svgUrl: function () {
        return decodeURIComponent(this.url);
      }
    },
    beforeMount: function () {
      this.fetchSvg();
    },
    methods: {
      fetchSvg: function () {
        axios.get(`${this.svgUrl}`).then( resp => {
          this.svg = resp.data;
        }).catch ( err => { console.log(err) } )
      },
    }
  }
</script>
