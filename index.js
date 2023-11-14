const express = require('express');
const cors = require('cors');
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.send("hello");
})

app.post("/api/create-checkout-session", async (req, res) => {
    const {products} = req.body;
    // console.log(product);

    const lineItems = products.map((product) => ({
        price_data: {
            currency: "inr",
            product_data: {
                name: product.dish
            },
            unit_amount: product.price * 100,
        },
        quantity: product.qnty
    })
    )

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: "https://mern-e-commerce-frontend.netlify.app/success",
        cancel_url: "https://mern-e-commerce-frontend.netlify.app/cancel"
    })

    res.json({ id: session.id });

})

app.listen(7000, () => {
    console.log("server started...");
})