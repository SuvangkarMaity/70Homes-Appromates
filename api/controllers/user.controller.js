import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import Listing from "../models/listing.model.js";

export const test = (req, res) => {
  res.json({
    message: "Hello Pirate",
  });
};

// API route to update a user
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account!"));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10); // hashed pass
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          user_type: req.body.user_type,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// API route to delete a user
export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account!"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token"); // clear cookie then the json response
    res.status(200).json("User has been deleted!");
  } catch (error) {
    next(error);
  }
};

// API route to get user listings
export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only view your own listing"));
  }
};

// API route to get the user
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return next(errorHandler(404, "User not found!"));

    const { password: pass, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Controller to get all users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find(); // Fetch all users from the database

    if (!users || users.length === 0) {
      return next(errorHandler(404, "No users found!")); // Handle case where no users exist
    }

    // Remove the password field from each user object
    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest; // Return the user object without the password field
    });

    res.status(200).json(usersWithoutPassword); // Send back the modified list of users
  } catch (error) {
    next(error); // Pass error to the next middleware if something goes wrong
  }
};

// Controller to update user fields (adminApproved, paymentReceived)
export const updateUserStatus = async (req, res, next) => {
  const { userId } = req.params; // Extract userId from request parameters
  const { adminApproved, paymentReceived } = req.body; // Extract fields from request body

  try {
    // Validate that at least one field is provided for the update
    if (adminApproved === undefined && paymentReceived === undefined) {
      return next(errorHandler(400, "No valid fields provided for update"));
    }

    // Update the user document with provided fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          ...(adminApproved !== undefined && { adminApproved }),
          ...(paymentReceived !== undefined && { paymentReceived }),
        },
      },
      { new: true } // Return the updated document
    );

    // Check if user exists
    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }

    // Respond with success message and updated user data
    res.status(200).json({
      message: "User status updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    // Log the error and respond with a generic server error
    console.error("Error updating user status:", error);
    next(errorHandler(500, "Failed to update user status"));
  }
};
