const express = require("express");
const router = express.Router()
const userController = require("../controllers/users")
const {authorization} = require("../middleware/authorization")

router.post("/", userController.createUsers);

router.get("/", authorization, userController.usersList)


router.route("/:id").get(userController.getUserById).put(userController.updateUsersById).delete(userController.deleteUserById);

router.post("/login", userController.loginUser)
router.post("/logout", userController.logoutUser)

router.put("/password/update", authorization, userController.changePassword)
router.put("/profile/update", authorization, userController.updateSelfProfile)

module.exports = router