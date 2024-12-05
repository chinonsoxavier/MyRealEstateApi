const { createListing } = require("../services/listingServices");

exports.createListing = async (req, res) => {
  const agentId = req.user.id;
  const files = req.media;
  console.log(req.media);
  const newfle = files?.map((file, index) => {
    const listingImageFileName = file.filename;
    const listingImageFileUrl = `${req.protocol}://${req.get(
      "host"
    )}/uploads/${listingImageFileName}`;
    return listingImageFileName;
  });
  // }

  try {
    const listingPayload = {
      name: req.body.name,
      price: req.body.price,
      agentId: agentId,
      condition: req.body.condition,
      sqft: req.body.sqft,
      bed: req.body.bed,
      bath: req.body.bath,
      kitchen: req.body.kitchen,
      type: req.body.type,
      location: req.body.location,
      overview: req.body.overview,
      features: req.body.features,
      Images: newfle,
      Videos: req.body.Videos,
    };
    if (listingPayload == null) {
      res.status(400).json("cannot create listing with listing details");
    } else if (req.user.role != "agent") {
        console.log(req.user);
      res.status(403).json("you can only create a listing as an agent!.");
      return;
    } else {
      await createListing(listingPayload);
      res.status(200).json("your listing has been created successfully");
    }
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};
