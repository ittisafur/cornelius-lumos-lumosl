export default {
  props: { filesUrl: { type: String, default: "" } },
  methods: {
    generateFilesUrl: function (file="") {
      if (!file) return false;
      let urlParts = this.filesUrl.split('?');
      urlParts.splice(urlParts.length - 1, 0, `${file}?`);
      return urlParts.join('');
    }
  }
}