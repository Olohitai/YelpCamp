const { default: mongoose } = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");
const axios = require("axios").default;

mongoose
  .connect("mongodb://localhost:27017/yelp-camp")
  .then(console.log("Database Connected"))
  .catch((error) => console.error.bind(error, "connection error"));
mongoose.connection.on("error", (err) => {
  console.error("connection error", err);
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];
const seedImg = async () => {
  try {
    const resp = await axios.get("https://api.unsplash.com/photos/random", {
      params: {
        client_id: "bdcFfCWjkDMpoo9W5qFweZ6hCn-Vnsql30P42ybf77E",
        collections: 20431456,
      },
    });
    return resp.data.urls.small;
  } catch (err) {
    console.error(err);
  }
};
const seedDB = async () => {
  await Campground.deleteMany({});
  for (i = 0; i < 20; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;

    const description =
      descriptors[Math.floor(Math.random) * descriptors.length];
    const camp = new Campground({
      author: "62686485da6ab90d73caef07",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: await seedImg(),
      description:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tempore, rem temporibus doloremque enim dolor sunt velit sit necessitatibus praesentium provident, culpa perspiciatis magnam, repellat voluptatum. Dolorum qui magni deleniti reprehenderit?",
      price,
    });

    await camp.save();
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});
