const express = require("express");
const router = express.Router()
const userController = require("../controllers/users")
const {authorization, authorizeRoles} = require("../middleware/auth")

router.post("/", userController.createUsers);

router.post("/login", userController.loginUser)
router.post("/logout", userController.logoutUser)


router.put("/password/update", authorization, userController.changePassword)
router.put("/password/forgot", userController.forgotPassword)
router.put("/password/reset/:token", userController.changePasswordByUrl)
router.put("/profile/update", authorization, userController.updateSelfProfile)
router.get("/profile/me", authorization, userController.getSelfProfile)


// Admin Routes
router.get("/", authorization, authorizeRoles('admin'), userController.usersList)
router.get("/:id", authorization, authorizeRoles('admin'), userController.usersList)
router.put("/:id", authorization, authorizeRoles('admin'), userController.updateUsersById)
router.delete("/:id", authorization, authorizeRoles('admin'), userController.deleteUserById)



module.exports = router