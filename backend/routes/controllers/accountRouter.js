const express = require("express")
const app = express()
const router = express.Router()
const isAuthenticated = require("../../middlewares/isAuth")
const { Accounts, User, Transactions } = require("../../db")
const { default: mongoose } = require("mongoose")

router.get("/myBalance", isAuthenticated, async (req, res) =>{
    const userId = req.userId
    const account = await Accounts.findOne({userId})
    if(!account){
        return res.status(400).json({status:"Fail", message:"Account not found"})
    }

    // remove userId and _id

    account.userId = undefined
    account._id = undefined
    res.status(200).json({status:"Success", message:"Account found", data:account}) 
})


router.get("/getUserDetails", isAuthenticated, async (req, res) =>{
    const userId = req.userId
    console.log(userId)
    const user = await User.findOne({_id:userId})
    if(!user){
        return res.status(400).json({status:"Fail", message:"User not found"})
    }

    // remove password field from user

    user.password = undefined
    res.status(200).json({status:"Success", message:"User found", data:user})
})

router.get("/getPeople", isAuthenticated, async (req, res) =>{
    console.log("enter here")
    const userId = req.userId
    const users = await User.find({_id:{$ne:userId}})
    if(!users){
        return res.status(400).json({status:"Fail", message:"No users found"})
    }

    // remove password field from user

    users.forEach(user => {
        user.password = undefined
    });
    res.status(200).json({status:"Success", message:"Users found", data:users})
})

router.post("/transfer", isAuthenticated, async (req, res) =>{
    console.log("enterhere")
    const session = await mongoose.startSession();
    session.startTransaction();

    const {amount, to} = req.body;
    const from = req.userId;

    const fromAccount = await Accounts.findOne({userId:from}).session(session)

    if(!fromAccount || fromAccount.balance < amount){
        await session.abortTransaction();
        session.endSession();
        console.log("enter to failed")
        return res.status(400).json({status:"Fail", message:"Insufficient balance"})
    }

    const toAccount = await Accounts.findOne({userId:to}).session(session)

    if(!toAccount){
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({status:"Fail", message:"Account not found"})
    }

    await Accounts.updateOne({userId:from}, {$inc:{balance:-amount}}).session(session)
    await Accounts.updateOne({userId:to}, {$inc:{balance:amount}}).session(session)

    const transaction = new Transactions({
        from,
        to,
        amount,
        type:"Debit"
    })
    await transaction.save({session:session})

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({status:"Success", message:"Transfer successful"})
})

router.get("/getMyTransactions", isAuthenticated, async (req, res) => {
    const userId = req.userId
    const transactions = await Transactions.find({ $or: [{ from: userId }, { to: userId }] }).lean()

    if (!transactions) {
        return res.status(400).json({ status: "Fail", message: "No transactions found" })
    }

    const modifiedTransactions = await Promise.all(transactions.map(async (transaction) => {
        const fromUser = await User.findById(transaction.from).select("username first_name last_name")
        const toUser = await User.findById(transaction.to).select("username first_name last_name")

        transaction.type = transaction.from._id == userId ? "Debit" : "Credit"
        transaction.from = {
            _id: transaction.from,
            username: fromUser.username,
            first_name: fromUser.first_name,
            last_name: fromUser.last_name
        }
        transaction.to = {
            _id: transaction.to,
            username: toUser.username,
            first_name: toUser.first_name,
            last_name: toUser.last_name
        }

        return transaction
    }))

    console.log(modifiedTransactions)
    res.status(200).json({ status: "Success", message: "Transactions found", data: modifiedTransactions })
})

module.exports = router;