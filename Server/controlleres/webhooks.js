const { Webhook } = require("svix");
const User = require("../models/User");
require('dotenv').config(); 

const clerkWebhooks = async (req, res) => {
  console.log(" Clerk Webhook Triggered!");

  try {
    console.log(" Received Headers:", req.headers);
    console.log(" Received Body:", JSON.stringify(req.body, null, 2));
    
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    console.log(" Clerk Webhook Secret:", process.env.CLERK_WEBHOOK_SECRET);
    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    console.log("Webhook Verified!");

    const { data, type } = req.body;

    switch (type) {
      case "user.created":
        console.log(" Creating User:", data);
        await User.create({
          _id: data.id,
          email: data.email_addresses?.[0]?.email_address,
          name: `${data.first_name} ${data.last_name }`.trim(),
          imageUrl: data.image_url,
        });
        console.log(" User Created in DB!");
        res.json({});
        break;

      case "user.updated":
        console.log(" Updating User:", data);
        await User.findByIdAndUpdate(
          data.id,
          {
            email: data.email_addresses?.[0]?.email_address,
            name: `${data.first_name} ${data.last_name}`.trim(),
            imageUrl: data.image_url,
          },
          { new: true }
        );
        console.log("User Updated in DB!");
        res.json({});
        break;

      case "user.deleted":
        console.log(" Deleting User:", data.id);
        await User.findByIdAndDelete(data.id);
        console.log(" User Deleted from DB!");
        res.json({});
        break;

      default:
        console.warn("Unhandled Webhook Event:", type);
        res.json({});
    }
  } catch (error) {
    console.error(" Webhook Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = clerkWebhooks;
