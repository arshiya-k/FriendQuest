import mongoose, { Schema } from 'mongoose';

//a notification
const NotificationSchema = new mongoose.Schema({
    from: {type: Schema.Types.ObjectId, ref: 'Account' },
    message: {type: String, enum: ['friend request']}
});

// a single trip
const TripSchema = new mongoose.Schema({
    date: String,
    time: String,
    keywords: String,
    stage: {type: String, enum: ['planning', 'in progress', 'done', 'nevermind']},
    company: [{
        type: Schema.Types.ObjectId, ref: 'Account'
    }],//users who accepted notification
    location: String
});

//user document
const AccountSchema = new mongoose.Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: "Account"
    },
    username: String, //username for login
    name: String, //user name
    location: String, //where user is based 
    bio: String,
    email: String,
    friends: [{
        type: Schema.Types.ObjectId,
        ref: "Account",
    }],
    //list of completed statuses
    history: [{
        type:Schema.Types.ObjectId,
        ref: "Trip"
    }],

    inbox: [{
        type:Schema.Types.ObjectId,
        ref: "Notification"
    }]
});




const MONGODB_URI = process.env.MONGODB_URI;



//https://stackoverflow.com/questions/19051041/cannot-overwrite-model-once-compiled-mongoose
export const Account = mongoose.models.Account || mongoose.model('Account', AccountSchema);
export const Trip = mongoose.models.Trip || mongoose.model('Trip', TripSchema);
export const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);


mongoose.connect(MONGODB_URI);