import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";




export const createListing = async (req, res, next) => {
  try {
    // Fetch user data to verify role and payment status
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(errorHandler(404, "User not found!"));
    }

    // Role-based logic
    if (user.user_type === "admin") {
      // Admins can create unlimited listings
    } else if (user.user_type === "agent" || user.user_type === "builder") {
      // Check payment status for agents and builders
      if (!user.paymentReceived) {
        return next(
          errorHandler(
            403,
            "Forbidden: Payment is required to create a listing. Please contact admin."
          )
        );
      }
    } else if (user.user_type === "buyer" || user.user_type === "seller") {
      // Restrict to one listing for buyers and sellers
      const existingListing = await Listing.findOne({ userRef: req.user.id });
      if (existingListing) {
        return next(
          errorHandler(403, "You can only create one property listing.")
        );
      }
    } else {
      // Deny access for other roles
      return next(
        errorHandler(403, "Forbidden: Unauthorized role to create listings.")
      );
    }

    // Create the listing
    const listing = await Listing.create({
      ...req.body,
      userRef: req.user.id, // Associate listing with the user
    });

    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};


export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only delete your own listing!"));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only update your own listing!"));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent", "lease"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" }, // i means regex search functionality wont care about lower or uppercase
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
