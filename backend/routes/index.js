const express = require('express');
const router = express.Router();
const userRouter = require("./userRouter");
const accRouter = require("./controllers/accountRouter")

router.use("/user", userRouter);
router.use("/accounts", accRouter)


module.exports = router;