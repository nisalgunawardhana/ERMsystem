const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
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
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },
    
    userRole: {
        type: String,
        enum: ['Cashier', 'Staff Manager', 'Training Coordinator', 'Financial Manager', 'Logistic Manager', 'Admin'],
        required: true,
        unique: true
    },
    
    isCashier: {
        type: Boolean,
        default: fault
    },

    isStaffManager: {
        type: Boolean,
        default: fault
    },

    isStaffManager: {
        type: Boolean,
        default: fault
    },

    isCashier: {
        type: Boolean,
        default: fault
    },
    /*,

    isActive: {   
        type: Boolean,
        required: true
    }
}, { timestamps: true */});

//static signup method
userSchema.statics.signup = async function (first_name, last_name, email, password, userRole) {
    
    //validation
    if (!first_name || !last_name || !email || !password || !userRole) {
        throw Error('All fields must be filled');
    }
    if (!validator.isEmail(email)) {
        throw Error('Email is not valid');
    }
    if (!validator.isStrongPassword(password)) {
        throw Error('Password not strong enough');
    }

    const exists = await this.findOne({ email });

    if (exists) {
        throw Error('Email already in use');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({ first_name, last_name, email, password: hash, userRole });

    return user;
};

//static method to update user
userSchema.statics.updateUser = async function(userId, newData){
    try{
        const updatedUser = await this.findByIdAndUpdate(userId, newData, { new: true });
        return updatedUser;
    } catch (error)
 {
    throw new Error('Error updating user: ' + error.message);
 }
}

 //static method to delete a user
 userSchema.statics.deleteUser = async function(userId){
    try{
        const deletedUser = await this.findByIdAndDelete(userId);
        return deletedUser;
    }catch(error){
        throw new Error('Error deleting user: ' + error.message);
    } 
 }

//static login method
userSchema.statics.login = async function(email, password) {
    if (!email || !password) {
        throw Error('All fields must be filled');
    }

    const user = await this.findOne({ email });

    if (!user) {
        throw Error('Incorrect Email');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw Error('Incorrect password');
    }

    return user;
};

module.exports = mongoose.model('User', userSchema);
