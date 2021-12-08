import axios from "axios";
export default {
  props: {
    filesUrl: { type: String, default: "" },
    shopUrl: { type: String, default: "" },
    shopName: { type: String, default: "" }
  },
  data () {
    return {
      env: process.env.NODE_ENV,
      storeFrontAccessToken: 'f27e5b851c319cf71ac559d263b6fbaf',
      chevron: '<div class="chevron"><svg width="16" height="9" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.5176 1L8.26758 7.5L1.01758 1" stroke="black"/></svg></div>',
      checkedIcon: '<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="25" height="25" fill="#549422"/><path d="M10.4932 15.0117L17.1436 8.36133L17.9932 9.24023L10.4932 16.7402L7.00684 13.2539L7.88574 12.375L10.4932 15.0117Z" fill="white"/></svg>',
      uncheckedIcon: '<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="25" height="25" fill="white"/><rect x="0.5" y="0.5" width="24" height="24" stroke="black" stroke-opacity="0.5"/></svg>',
      bubbles: '<div id="bubbles"><div class="bubble x1"></div><div class="bubble x2"></div><div class="bubble x3"></div><div class="bubble x4"></div><div class="bubble x5"></div><div class="bubble x6"></div><div class="bubble x7"></div><div class="bubble x8"></div><div class="bubble x9"></div><div class="bubble x10"></div></div>',
      closeIcon: '<svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.791914 1.58275L14.7121 15.5029C15.0104 15.8012 15.4081 15.8012 15.7064 15.5029C16.0046 15.2046 16.0046 14.8069 15.7064 14.5086L1.78621 0.588457C1.48792 0.290168 1.0902 0.290168 0.791914 0.588457C0.493625 0.886746 0.493625 1.28446 0.791914 1.58275Z" fill="#29302E"/><path d="M1.49144 15.4117L15.4116 1.49155C15.7099 1.19326 15.7099 0.795544 15.4116 0.497255C15.1133 0.198966 14.7156 0.198966 14.4173 0.497255L0.497148 14.4174C0.198859 14.7157 0.198859 15.1134 0.497148 15.4117C0.795437 15.71 1.19316 15.71 1.49144 15.4117Z" fill="#29302E"/></svg>',
      shippingIcon: '<svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.4981 7.15091L19.498 7.1506C18.8253 5.49007 18.0664 4.52825 17.3589 3.98151C16.6504 3.43403 15.9975 3.30599 15.5444 3.30599H13.6898V2.40403C13.6898 1.58843 13.0263 0.925 12.2102 0.925H4.59728C3.78174 0.925 3.11767 1.58841 3.11767 2.40403V2.57414H1H0.925V2.64914V3.14168V3.21668H1H5.43286H5.50785V3.14168V2.64914V2.57414H5.43286H3.75963V2.40403C3.75963 1.94251 4.1357 1.56696 4.5967 1.56696H12.2102C12.6711 1.56696 13.0467 1.94245 13.0467 2.40403V10.5933H8.96536C8.72479 9.80734 7.99997 9.23095 7.13588 9.23095C6.27072 9.23095 5.54528 9.80729 5.30467 10.5933H4.59612C4.13509 10.5933 3.75905 10.2177 3.75905 9.75677V6.29534H6.41736H6.49235V6.22034V5.7278V5.6528H6.41736H1.98566H1.91066V5.7278V6.22034V6.29534H1.98566H3.11767V9.75677C3.11767 10.5724 3.78174 11.2358 4.59728 11.2358H5.2165C5.26038 12.2571 6.10437 13.075 7.13704 13.075C8.16867 13.075 9.01144 12.2571 9.05527 11.2358H13.9066C13.9505 12.2571 14.7945 13.075 15.8266 13.075C16.8588 13.075 17.7023 12.257 17.7455 11.235L18.0398 11.2341L18.0398 11.2346L18.0485 11.2335C18.6458 11.1615 19.0183 10.9367 19.2397 10.6442C19.4597 10.3536 19.5226 10.0068 19.5226 9.70462V7.2709H19.5227L19.5226 7.26817C19.5211 7.22817 19.5131 7.18833 19.4981 7.15091ZM18.3385 7.37765L18.3385 7.37764L18.3377 7.37581C17.9465 6.46015 17.4993 5.73506 17.0264 5.23764C16.5542 4.74085 16.0492 4.46428 15.5441 4.46428H14.4397C14.2628 4.46428 14.1184 4.60784 14.1184 4.78555V8.33879C14.1184 8.51638 14.2621 8.66006 14.4397 8.66006H18.0416C18.2192 8.66006 18.3629 8.51638 18.3629 8.33879V7.50205C18.3629 7.45861 18.3538 7.41623 18.3385 7.37765ZM6.00017 4.18815V4.11315H5.92517H1.49231H1.41731V4.18815V4.68069V4.75569H1.49231H5.92517H6.00017V4.68069V4.18815ZM7.13646 12.4319C6.43092 12.4319 5.85669 11.8581 5.85669 11.1527C5.85669 10.4472 6.43092 9.87349 7.13646 9.87349C7.84076 9.87349 8.4145 10.4471 8.4145 11.1527C8.4145 11.8582 7.84076 12.4319 7.13646 12.4319ZM15.8254 12.4319C15.1199 12.4319 14.5462 11.8582 14.5462 11.1527C14.5462 10.4472 15.1199 9.87349 15.8254 9.87349C16.5303 9.87349 17.1041 10.4472 17.1041 11.1527C17.1041 11.8582 16.5309 12.4319 15.8254 12.4319ZM18.8784 9.70462C18.8784 9.98501 18.8069 10.1845 18.6693 10.3239C18.5311 10.4641 18.3154 10.5543 18.0042 10.5933H17.6555C17.4149 9.80733 16.6901 9.23095 15.8254 9.23095C14.9608 9.23095 14.2354 9.8073 13.9948 10.5933H13.6892V3.94853H15.5438C16.1635 3.94853 16.7703 4.24182 17.338 4.81567C17.9037 5.3876 18.4267 6.23478 18.8778 7.33377L18.8784 9.70462ZM17.7203 8.01752H14.7615V5.10682H15.5441C15.8703 5.10682 16.2459 5.32793 16.6303 5.75843C17.01 6.18363 17.3872 6.80118 17.7203 7.56802V8.01752Z" fill="#29302E" stroke="#29302E" stroke-width="0.15"/></svg>',
      removeIcon: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.0489 4.02887C9.73776 3.71776 9.22443 3.71776 8.89776 4.02887L7.04665 5.87999L5.17999 4.02887C4.86887 3.71776 4.35554 3.71776 4.02887 4.02887C3.71776 4.33998 3.71776 4.85332 4.02887 5.17999L5.87999 7.0311L4.02887 8.88221C3.71776 9.19332 3.71776 9.70665 4.02887 10.0333C4.18443 10.1889 4.38665 10.2667 4.60443 10.2667C4.82221 10.2667 5.02443 10.1889 5.17999 10.0333L7.0311 8.18221L8.88221 10.0333C9.03776 10.1889 9.23999 10.2667 9.45776 10.2667C9.65999 10.2667 9.87776 10.1889 10.0333 10.0333C10.3444 9.72221 10.3444 9.20887 10.0333 8.88221L8.18221 7.0311L10.0333 5.17999C10.36 4.85332 10.36 4.33998 10.0489 4.02887Z" fill="#29302E"/><path d="M7 0.466667C10.6089 0.466667 13.5333 3.39111 13.5333 7C13.5333 10.6089 10.6089 13.5333 7 13.5333C3.39111 13.5333 0.466667 10.6089 0.466667 7C0.466667 3.39111 3.39111 0.466667 7 0.466667ZM7 0C3.12667 0 0 3.12667 0 7C0 10.8733 3.12667 14 7 14C10.8733 14 14 10.8733 14 7C14 3.12667 10.8733 0 7 0Z" fill="#29302E"/></svg>',
      loader: '<svg class="loader" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" width="64px" height="64px" viewBox="0 0 128 128" xml:space="preserve"><g><path d="M59.6 0h8v40h-8V0z" fill="#000000" fill-opacity="1"/><path d="M59.6 0h8v40h-8V0z" fill="#cccccc" fill-opacity="0.2" transform="rotate(30 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#cccccc" fill-opacity="0.2" transform="rotate(60 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#cccccc" fill-opacity="0.2" transform="rotate(90 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#cccccc" fill-opacity="0.2" transform="rotate(120 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#b2b2b2" fill-opacity="0.3" transform="rotate(150 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#999999" fill-opacity="0.4" transform="rotate(180 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#7f7f7f" fill-opacity="0.5" transform="rotate(210 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#666666" fill-opacity="0.6" transform="rotate(240 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#4c4c4c" fill-opacity="0.7" transform="rotate(270 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#333333" fill-opacity="0.8" transform="rotate(300 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#191919" fill-opacity="0.9" transform="rotate(330 64 64)"/><animateTransform attributeName="transform" type="rotate" values="0 64 64;30 64 64;60 64 64;90 64 64;120 64 64;150 64 64;180 64 64;210 64 64;240 64 64;270 64 64;300 64 64;330 64 64" calcMode="discrete" dur="1080ms" repeatCount="indefinite"/></g></svg>',
      lockIcon: '<svg width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.6427 5.66341H8.80899V3.69712C8.80899 2.71671 8.41952 1.77646 7.72627 1.08321C7.03302 0.389953 6.09277 0.000488281 5.11236 0.000488281C4.13195 0.000488281 3.1917 0.389953 2.49845 1.08321C1.8052 1.77646 1.41573 2.71671 1.41573 3.69712V5.66341H0.582023C0.50559 5.66341 0.429906 5.67846 0.359292 5.70771C0.288678 5.73696 0.224516 5.77983 0.17047 5.83388C0.116425 5.88793 0.073553 5.95209 0.0443037 6.0227C0.0150543 6.09332 0 6.169 0 6.24543V13.4185C0 13.5728 0.0613199 13.7209 0.17047 13.83C0.279621 13.9392 0.427661 14.0005 0.582023 14.0005H9.6427C9.79706 14.0005 9.9451 13.9392 10.0542 13.83C10.1634 13.7209 10.2247 13.5728 10.2247 13.4185V6.24543C10.2247 6.169 10.2097 6.09332 10.1804 6.0227C10.1512 5.95209 10.1083 5.88793 10.0542 5.83388C10.0002 5.77983 9.93604 5.73696 9.86543 5.70771C9.79481 5.67846 9.71913 5.66341 9.6427 5.66341ZM2.20225 3.69712C2.20225 2.92531 2.50885 2.18511 3.0546 1.63936C3.60035 1.09361 4.34055 0.787005 5.11236 0.787005C5.88417 0.787005 6.62437 1.09361 7.17012 1.63936C7.71587 2.18511 8.02247 2.92531 8.02247 3.69712V5.66341H2.20225V3.69712ZM9.4382 13.214H0.786517V6.44993H9.4382V13.214Z" fill="white"/><path d="M5.11227 8.48535C4.9495 8.48564 4.79083 8.53642 4.65815 8.63069C4.52546 8.72496 4.42528 8.85807 4.37144 9.01167C4.31759 9.16527 4.31272 9.33179 4.35751 9.48828C4.40229 9.64476 4.49452 9.7835 4.62148 9.88535V10.6876C4.62859 10.8132 4.68347 10.9313 4.77488 11.0176C4.86629 11.104 4.98729 11.1521 5.11305 11.1521C5.23882 11.1521 5.35982 11.104 5.45123 11.0176C5.54263 10.9313 5.59752 10.8132 5.60463 10.6876V9.88535C5.73169 9.78341 5.82396 9.64454 5.86871 9.4879C5.91345 9.33127 5.90846 9.1646 5.85441 9.01093C5.80037 8.85725 5.69994 8.72415 5.567 8.63001C5.43406 8.53586 5.27517 8.48532 5.11227 8.48535Z" fill="white"/></svg>',
      infoIcon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0C3.58214 0 0 3.58214 0 8C0 12.4179 3.58214 16 8 16C12.4179 16 16 12.4179 16 8C16 3.58214 12.4179 0 8 0ZM8 14.6429C4.33214 14.6429 1.35714 11.6679 1.35714 8C1.35714 4.33214 4.33214 1.35714 8 1.35714C11.6679 1.35714 14.6429 4.33214 14.6429 8C14.6429 11.6679 11.6679 14.6429 8 14.6429Z" fill="black" fill-opacity="0.5"/><path d="M9.99286 4.5125C9.45714 4.04286 8.75 3.78571 8 3.78571C7.25 3.78571 6.54286 4.04464 6.00714 4.5125C5.45 5 5.14286 5.65536 5.14286 6.35714V6.49286C5.14286 6.57143 5.20714 6.63571 5.28571 6.63571H6.14286C6.22143 6.63571 6.28571 6.57143 6.28571 6.49286V6.35714C6.28571 5.56964 7.05536 4.92857 8 4.92857C8.94464 4.92857 9.71429 5.56964 9.71429 6.35714C9.71429 6.9125 9.32143 7.42143 8.7125 7.65536C8.33393 7.8 8.0125 8.05357 7.78214 8.38571C7.54821 8.725 7.42679 9.13214 7.42679 9.54464V9.92857C7.42679 10.0071 7.49107 10.0714 7.56964 10.0714H8.42679C8.50536 10.0714 8.56964 10.0071 8.56964 9.92857V9.52321C8.57057 9.34986 8.62371 9.18081 8.72214 9.0381C8.82056 8.8954 8.95971 8.78566 9.12143 8.72321C10.175 8.31786 10.8554 7.38929 10.8554 6.35714C10.8571 5.65536 10.55 5 9.99286 4.5125ZM7.28571 11.9286C7.28571 12.118 7.36097 12.2997 7.49492 12.4336C7.62888 12.5676 7.81056 12.6429 8 12.6429C8.18944 12.6429 8.37112 12.5676 8.50508 12.4336C8.63903 12.2997 8.71429 12.118 8.71429 11.9286C8.71429 11.7391 8.63903 11.5574 8.50508 11.4235C8.37112 11.2895 8.18944 11.2143 8 11.2143C7.81056 11.2143 7.62888 11.2895 7.49492 11.4235C7.36097 11.5574 7.28571 11.7391 7.28571 11.9286Z" fill="black" fill-opacity="0.5"/></svg>',
      prevIcon: '<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="18" cy="18" r="18" transform="rotate(-180 18 18)" fill="currentColor"/><path d="M21 25L14 18L21 11" stroke="#7DADA0" stroke-width="2"/>',
      nextIcon: '<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="18" cy="18" r="18" fill="currentColor"/><path d="M15 11L22 18L15 25" stroke="#7DADA0" stroke-width="2"/></svg>',
    }
  },
  methods: {
    arrayIntersection: function (data) {
      // data = [array1, array2, array3, array4],
      return data.reduce((a, b) => a.filter(c => b.includes(c)));
    },
    scrollTo: (top=0) => {
      window.scrollTo({
        top: top,
        behavior: 'smooth'
      });
    },
    fetchProduct: async function (handle) {
      try {
        return await this.$axios.get(`/products/${handle}.json`).catch(e => console.log(e));
      } catch (e) {
        console.log(e);
      }
    },
    fetchReviewsMetafieldsGraphQL: async function (handle = '') {
      const inputs = {
        collectionHandle: handle,
        metafieldNamespace: 'okendo',
        metafieldKey: 'ProductListingSnippet'
      };

      const query = `query($cursor: String) {
        collectionByHandle(handle: "${inputs.collectionHandle}") {
          handle
          products(first: 250, after:$cursor) {
            pageInfo {
              hasNextPage
            }
            edges {
              cursor
              node {
                handle
                metafield: metafield(namespace: "${inputs.metafieldNamespace}", key: "${inputs.metafieldKey}") {
                  value
                }
              }
            }
          }
        }
      }`;

      try {
        var products = [], variables = {};
        do {
          var response = await axios.post(
            `${window.location.origin}/api/graphql.json`,
            { query: query, variables: variables },
            { headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': this.storeFrontAccessToken } }
          ).catch( err => { console.log(err) } );

          products = [
            ...products,
            ...response?.data?.data?.collectionByHandle?.products?.edges
          ];

          const cursor = response?.data?.data?.collectionByHandle?.products?.edges[ response?.data?.data?.collectionByHandle?.products?.edges.length - 1 ]?.cursor;
          variables = { cursor: cursor };
        } while ( response?.data?.data?.collectionByHandle?.products?.pageInfo?.hasNextPage === true );
      } catch (e) {
        console.log(e);
      }
      return products;
    },
    formatLineBreaks: function (string) {
      return this.$options.filters.formatLineBreaks(string);
    },
    slugify: function (string) {
      return this.$options.filters.slugify(string);
    },
    stripHtml: function (string) {
      return this.$options.filters.stripHtml(string);
    }
  }
}
