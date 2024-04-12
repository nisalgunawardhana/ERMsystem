const mongoose = require ('mongoose')

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isCashier: {
        type: Boolean,
        default: false,
    },
    isFinanceManager: {
        type: Boolean,
        default: false,
    },
    isLogisticManager: {
        type: Boolean,
        default: false,
    },
    isStaffManager: {
        type: Boolean,
        default: false,
    },
    isTrainingCoordinator: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
})

const userModel = mongoose.model('users2', userSchema)

module.exports = userModel