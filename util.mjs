/* Created both the classes for one main reason: using them made it much easier to send data as props from getServerSide props to
 the page component */


/* The idea for the message class is to create a generic message class that could be extended to different types of messages for future 
use. In addition to the FriendRequest class, two other possible future inherited classes could be TextMessage and JoinTripRequest  */
class GenericMessage{
    constructor(id, from, to) {
        this.id = id;
        this.from = from;
        this.to = to;
    }
}

class FriendRequest extends GenericMessage{
    constructor(id, from, to){
        super(id, from, to);
        this.accepted = false;
    }

    acceptRequest(){
        this.accepted = true;
    }

    // addFriend(){
    //     if (this.accepted){

    //     }
    // }
}

class Profile {
    constructor(id, name, email, bio, location, friends, inbox, history){
        this.id = id;
        this.name = name;
        this.email = email;
        this.bio = bio;
        this.location = location;
        this.friends = friends;
        this.inbox = inbox;
        this.history = history;
    }
}


export {
    Profile,
    FriendRequest
};