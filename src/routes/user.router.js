import { Router } from "express";
import { loggedOutUser, loginUser, registerUser, refreshAcessToken, changePassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getWatchHistory } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {name:"avatar",
            maxCount:1
        },
        {name:"coverImage",
            maxCount:1}
    ]),
    registerUser
);
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, loggedOutUser)
router.route("/refresh-token").post(refreshAcessToken)
router.route("/change-password").post(verifyJWT,changePassword)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/update-account").patch(verifyJWT,updateAccountDetails)
router.route("/avatr").path(verifyJWT,upload.single("avatar"),updateUserAvatar)
router.route("/cover-image").patch(verifyJWT,upload.single("/coverImage"),updateUserCoverImage)
router.route("/c/:username").get(verifyJWT,getUserChannelProfile)
router.route("/history").get(verifyJWT,getWatchHistory)

export default router;