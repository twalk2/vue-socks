var app = new Vue({
  el: "#app",
  data: {
    brand: "Vue Mastery",
    product: "Socks",
    description: "Soft, breathable material for maximum comfort.",
    selectedVariant: 0,
    website: "https://utah-ski-central.herokuapp.com/",
    inStock: false,
    onSale: true,
    details: ["80% cotton", "20% polyester", "Super Durable"],
    variants: [
      {
        variantId: 2234,
        variantColor: "green",
        variantImage: "./images/green-vue-socks.png"
      },
      {
        variantId: 2234,
        variantColor: "blue",
        variantImage: "./images/blue-vue-socks.png"
      }
    ],
    sizes: ["S", "M", "L", "XL"],
    cart: 0
  },
  methods: {
    addToCart() {
      this.cart += 1;
    },
    removeFromCart() {
      if (this.cart > 0) {
        this.cart -= 1;
      } else {
        return 0;
      }
    },
    updateProduct(index) {
      this.selectedVariant = index;
      console.log(index);
    }
  },
  computed: {
    title() {
      return this.brand + " " + this.product;
    },
    image() {
      return this.variants[this.selectedVariant].variantImage;
    }
  }
});
