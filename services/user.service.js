const User = require('../models/userModel');

/**
 * Get all users
 * @returns {Promise<Array>}
 */
function findAll() {
  return User.find().exec();
}

/**
 * Find one user by username
 * @param {string} username
 * @returns {Promise<Object|null>}
 */
function findOne(username) {
  return User.findOne({ username }).exec();
}

/**
 * Find the last inserted user (by _id descending)
 * @returns {Promise<Object|null|false>}
 */
async function findLastInsertedUser() {
  console.log("Find last inserted user");

  try {
    const result = await User.find().sort({ _id: -1 }).limit(1).exec();
    if (result.length === 0) {
      console.log("No users found");
      return null;
    }
    console.log("Success in finding last inserted user", result[0]);
    return result[0];
  } catch (err) {
    console.error("Problem in finding last inserted user:", err);
    return false;
  }
}

module.exports = { findAll, findOne, findLastInsertedUser };
