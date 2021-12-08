import Vue from 'vue';
import numeral from "numeral";
import axios from "axios";
// import _ from './lo';

export default {
  returnCurrencyFormatted: function(value) {
    return value === 0 ? "Free" : numeral(value / 100).format("$0,0.00");
  },
  returnGraphQLCurrencyFormatted: function(value) {
    return value === 0 ? "Free" : numeral(value).format("$0,0.00");
  },
  returnDifferentImageSize: function(image, size='') {
    size = size || "medium";
    image = image.replace(".jpg", `_${size}.jpg`);
    image = image.replace(".png", `_${size}.png`);
    return image;
  },
  getProductTags: function(products) {
    var promises = products.map(function(product) {
      return axios
        .get(`/products/${product.handle}.js`)
        .then(function(response) {
          return (product.tags = response.data.tags);
        })
        .catch(function(error) {
          console.log(error);
          return (product.tags = []);
        });
    });

    return Promise.all(promises).then(function() {
      return products;
    });
  },
  reformatCart: function(data) {
    data.items.forEach(item => {
      item.giftItems = [];

      item.tags.forEach((tag, key) => {
        if (tag.startsWith("GIFT-")) {
          var giftId = parseInt(tag.replace("GIFT-", "").trim());
          item.tags[key] = giftId;
          data.items.forEach((giftItem) => {
            if (
              giftItem.product_id == giftId ||
              giftItem.variant_id == giftId
            ) {
              if (giftItem.variant_id) {
                item.giftItems.push(giftItem.variant_id);
              } else {
                item.giftItems.push(giftItem.product_id);
              }
              return;
            }
          });
        }
      });

      data.items.forEach(giftItem => {
        if (item.tags.indexOf(giftItem.product_id) > -1) {
          giftItem.gift = true;
        }
      });

      data.items.forEach(giftItem => {
        if (giftItem.tags.indexOf("GIFT") > -1) {
          giftItem.gift = true;
        }
      });
    });

    return data;
  },

  formatLineItemsCheckout: function(data) {
    return data.items.reduce( (a, item) => {
      a += `<tr class="product" data-product-id="${item.product_id}" data-variant-id="${item.variant_id}" data-product-type="${item.product_type}" data-customer-ready-visible="">
        <td class="product__image">
          <div class="product-thumbnail ">
            <div class="product-thumbnail__wrapper">
              <img alt="${item.product_title}" class="product-thumbnail__image" src="${this.returnDifferentImageSize(item.image, 'small')}">
            </div>
            <span class="product-thumbnail__quantity" aria-hidden="true">${item.quantity}</span>
          </div>
        </td>
        <th class="product__description" scope="row">
          <span class="product__description__name order-summary__emphasis">${item.product_title}</span>
          ${item.variant_title ? `<span class="product__description__variant order-summary__small-text">${item.variant_title}</span>` : ''}
        </th>
        <td class="product__quantity visually-hidden">${item.quantity}</td>
        <td class="product__price">
          <span class="order-summary__emphasis">${this.returnCurrencyFormatted(item.line_price)}</span>
        </td>
      </tr>`;
      return a;
    }, "" );
  },

  returnSelectedLink: function(product) {
    let newLink = product.url;
    return newLink;
  },

  randomizer: function(items) {
    return items[Math.floor(Math.random()*items.length)];
  },

  getSizedImageUrl: function(src, size) {
    if (size === undefined) {
      return src;
    }
    if (size === 'master') {
      return this.removeProtocol(src);
    }
    var match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);
    if (match) {
      var prefix = src.split(match[0]);
      var suffix = match[0];
      return this.removeProtocol(prefix[0] + '_' + size + suffix);
    } else {
      return null;
    }
  },
  removeProtocol: function (path) {
    return path.replace(/http(s)?:/, '');
  },
  makeNonreactive: function(obj) {
    const Observer = (new Vue()).$data.__ob__.constructor;
    // Set dummy observer on value
		Object.defineProperty(obj, '__ob__', {
			value: new Observer({}),
			enumerable: false,
			configurable: true,
		})
    console.log('----', obj)
    return obj;
  },
  intersect: function(arr) {
    return arr.reduce((a, b) => a.filter(c => b.includes(c)));
  }
};
