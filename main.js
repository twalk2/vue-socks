var eventBus = new Vue();

Vue.component("product-review", {
  template: `
    <form class="review-form" @submit.prevent="onSubmit">

    <p v-if="errors.length">
    <b>Please correct the following error(s):</b>
    <ul>
    <li v-for="error in errors">{{error}}</li>
    </ul>   
    </p>

    <p>
    <label for="name">Name:</label>
    <input id="name" v-model="name" placeholder="name" >
    </p>

    <p>
    <label for="review">Review:</label>
    <textarea id="review" v-model="review" ></textarea>
    </p>

    <p>
    <label for="rating">Rating:</label>
    <select id="rating" v-model.number="rating" >
    <option>5</option>
    <option>4</option>
    <option>3</option>
    <option>2</option>
    <option>1</option>
    </select>
    </p>

    <p>Would you recommend this product?</p>
    <label>
      Yes
      <input type="radio" value="Yes" v-model="recommend"/>
    </label>
    <label>
      No
      <input type="radio" value="No" v-model="recommend"/>
    </label>

    <p>
    <button type="submit" value="Submit">Submit</button>
    </p>
    </form>
    `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      recommend: null,
      errors: []
    };
  },
  methods: {
    onSubmit() {
      if (this.name && this.review && this.rating) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommend: this.recommend
        };
        eventBus.$emit("review-submitted", productReview);
        this.name = null;
        this.review = null;
        this.rating = null;
        this.recommend = null;
      } else {
        if (!this.name) this.errors.push("Name required.");
        if (!this.review) this.errors.push("Review required.");
        if (!this.rating) this.errors.push("Rating required.");
        if (!this.recommend) this.errors.push("Recommendation required.");
      }
    }
  }
});

Vue.component("product-details", {
  props: {
    details: {
      type: Array,
      required: true
    }
  },
  template: `
      <ul>
        <li v-for="detail in details">{{ detail }}</li>
      </ul>
    `
});

Vue.component("product", {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: `
    <div class="product">
    <div class="product-image">
      <img :src="image" :alt="description" />
    </div>

    <div class="product-info">
      <h1>{{ title }}</h1>
      <p v-if="inStock">In Stock</p>
      <p v-else :class="{ outOfStock: !inStock }">Out of Stock</p>
      <p> Shipping: {{shipping}}</p>
      <product-details :details="details"></product-details>
      <p>{{ sale }}</p>


      <div
        v-for="(variant, index) in variants"
        :key="variant.varianId"
        class="color-box"
        :style="{ backgroundColor: variant.variantColor}"
        @mouseover="updateProduct(index)"
      ></div>

      <ul>
        <li v-for="size in sizes">{{ size }}</li>
      </ul>

      <h2>{{ description }}</h2>
      <h3><a :href="website" target="_blank">View my site</a></h3>

      <div class="cart-actions">
        <button
          v-on:click="addToCart"
          :disabled="!inStock"
          :class="{ disabledButton: !inStock }"
        >
          Add to Cart
        </button>
        <button v-on:click="removeFromCart">Remove from Cart</button>

      </div>

      <product-tabs :reviews="reviews"></product-tabs>


    </div>


  </div>
    `,
  data() {
    return {
      brand: "Vue Mastery",
      product: "Socks",
      description: "Soft, breathable material for maximum comfort.",
      selectedVariant: 0,
      details: ["80% cotton", "20% polyester", "Gender-neutral"],
      website: "https://utah-ski-central.herokuapp.com/",
      onSale: true,
      variants: [
        {
          variantId: 2234,
          variantColor: "green",
          variantImage: "./images/green-vue-socks.png",
          variantQuantity: 10
        },
        {
          variantId: 2234,
          variantColor: "blue",
          variantImage: "./images/blue-vue-socks.png",
          variantQuantity: 0
        }
      ],
      sizes: ["S", "M", "L", "XL"],
      reviews: []
    };
  },
  methods: {
    addToCart() {
      this.$emit("add-to-cart", this.variants[this.selectedVariant].variantId);
    },
    removeFromCart() {
      this.$emit(
        "remove-from-cart",
        this.variants[this.selectedVariant].variantId
      );
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
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    },
    sale() {
      if (this.onSale) {
        return this.brand + " " + this.product + " are on sale!";
      }
      return this.brand + " " + " are not on sale";
    },
    shipping() {
      if (this.premium) {
        return "Free";
      }
      return 2.99;
    }
  },
  mounted() {
    eventBus.$on("review-submitted", productReview => {
      this.reviews.push(productReview);
    });
  }
});

Vue.component("product-tabs", {
  props: {
    reviews: {
      type: Array,
      required: true
    }
  },
  template: `
    <div>
        <span class="tab"
        :class="{ activeTab: selectedTab === tab}"
        v-for="(tab, index) in tabs" :key="index"
        @click="selectedTab = tab">{{tab}}</span>

        <div v-show="selectedTab === 'Reviews'">
        <p v-if="!reviews.length">There are no reviews yet.</p>
        <ul>
        <li v-for="review in reviews">
        <p>{{review.name}}</p>
        <p>Rating: {{review.rating}}</p>
        <p>{{review.review}}</p>
        <p>Would you recommend this product? {{review.recommend}}</p>
        
        </li>
        </ul>
        </div>
    
        <product-review v-show="selectedTab === 'Leave a Review'" ></product-review>
    </div>


    `,
  data() {
    return {
      tabs: ["Reviews", "Leave a Review"],
      selectedTab: "Reviews"
    };
  }
});

var app = new Vue({
  el: "#app",
  data: {
    premium: true,
    cart: []
  },
  methods: {
    updateCart(id) {
      this.cart.push(id);
    },
    removeItem(id) {
      for (var i = this.cart.length - 1; i >= 0; i--) {
        if (this.cart[i] === id) {
          this.cart.splice(i, 1);
        }
      }
    }
  }
});
