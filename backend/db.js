const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://tanishq:tmf0PQp3IAZ8lWs4@ledgerlytics.lhpfnam.mongodb.net/paytm");

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true,
        unique: true,
    },
    first_name : {
        type: String,
    },
    last_name : {
        type: String,
    },
    password : {
        type: String,
        required: true,
        minLength: 6,
    },
});

const accSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true 
    },

    balance : {
        type : Number,
        required : true
    }
})

const transactionSchema = new mongoose.Schema({
    from : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true 
    },

    to : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true 
    },

    amount : {
        type : Number,
        required : true
    },
    type : {
        type : String,
        required : true
    }
})

const User = mongoose.model("User", userSchema);
const Accounts = mongoose.model("Accounts", accSchema)
const Transactions = mongoose.model("Transactions", transactionSchema)

module.exports = {
    User, Accounts, Transactions
};