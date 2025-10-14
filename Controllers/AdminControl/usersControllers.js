const Users = require("../../models/AdminModel/usersModels");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await Users.getAll();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error Admin Users" });
  }
};

exports.deleteUsers = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res
        .status(400)
        .json({ message: "Valid user ID is required." });
    }

    const result = await Users.remove(id);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "users not found or already deleted." });
    }

    return res.status(200).json({ message: "user deleted successfully." });
  } catch (error) {
    console.error("Error deleting users:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


exports.updateUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Valid user ID is required." });
    }

    const result = await Users.update(id, data);


    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ message: "User updated successfully." });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
