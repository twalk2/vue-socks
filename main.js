var app = new Vue({
  el: "#app",
  data: {
    product: "Socks",
    description: "Soft, breathable material for maximum comfort.",
    image: "./images/green-vue-socks.png",
    // image: "./images/blue-vue-socks.png"
    website: "https://utah-ski-central.herokuapp.com/",
    inventory: 100,
    onSale: true,
    details: ["80% cotton", "20% polyester", "Super Durable"]
  }
});
