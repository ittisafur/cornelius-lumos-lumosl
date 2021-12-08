export default {
  data () {
    return {}
  },
  methods: {
    colorAdjust: function (hexInput, percent) {
      let hex = hexInput;

      // strip the leading # if present
      hex = hex.replace(/^\s*#|\s*$/g, "");

      // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
      if (hex.length === 3) {
          hex = hex.replace(/(.)/g, "$1$1");
      }

      let r = parseInt(hex.substr(0, 2), 16);
      let g = parseInt(hex.substr(2, 2), 16);
      let b = parseInt(hex.substr(4, 2), 16);

      const calculatedPercent = (100 + percent) / 100;

      r = Math.round(Math.min(255, Math.max(0, r * calculatedPercent)));
      g = Math.round(Math.min(255, Math.max(0, g * calculatedPercent)));
      b = Math.round(Math.min(255, Math.max(0, b * calculatedPercent)));

      return `#${r.toString(16).toUpperCase()}${g.toString(16).toUpperCase()}${b.toString(16).toUpperCase()}`;
    },
    hexToRgba: function (hexInput, alpha) {
      let hex = hexInput;

      // strip the leading # if present
      hex = hex.replace(/^\s*#|\s*$/g, "");

      // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
      if (hex.length === 3) {
          hex = hex.replace(/(.)/g, "$1$1");
      }

      let r = parseInt(hex.substr(0, 2), 16);
      let g = parseInt(hex.substr(2, 2), 16);
      let b = parseInt(hex.substr(4, 2), 16);

      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
  }
}