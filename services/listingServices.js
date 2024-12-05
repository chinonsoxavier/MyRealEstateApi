const Listing = require("../models/listingsModel");

exports.getListing = async (listingId) => {
    const listing = Listing.findOne(listingId);
    return await listing;
};

exports.createListing = async (agentId, newListing) => {
    const listing = new Listing({
      name: newListing.name,
      price: newListing.price,
      agentId: agentId,
      condition: newListing.condition,
      sqft: newListing.sqft,
      bed: newListing.bed,
      bath: newListing.bath,
      kitchen: newListing.kitchen,
      type: newListing.type,
      location: newListing.location,
      overview: newListing.overview,
      features: newListing.features,
      Images: newListing.Images,
      Videos: newListing.Videos,
    });
    await user.save();
    return listing;
};

exports.updateListing = async (agentId, UListing) => {
    const existinglisting = await this.getListing(Listing._id);
    const updatedListing = await Listing.findOneAndUpdate(
        {
            _id: agentId,
        },
        {
            name: UListing.name,
            price: UListing.price,
            agentId: agentId,
            condition: UListing.condition,
            sqft: UListing.sqft,
            bed: UListing.bed,
            bath: UListing.bath,
            kitchen: UListing.kitchen,
            type: UListing.type,
            location: UListing.location,
            overview: UListing.overview,
            features: UListing.features,
            Images: UListing.Images,
            Videos: UListing.Videos,
        }
    );

    await updatedListing.save();

    return updatedListing;
};


exports.getListings = async (count) => {
    const listings = await Listing.find().limit(count);

    return listings;
}