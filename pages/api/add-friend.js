import { getSession } from "next-auth/react";
import { Account, Notification } from "../../db.mjs";

export default async function addFriend(req, res){
    const session = await getSession({ req });

    //give error if user not logged in
    if (!session){
        return res.json({error: "not logged in"});
    }

    //action
    if (req.method === "POST") {
        //find the logged in users account from the database
        const from = await Account.findOne( {email: session.user.email});
        
        //search database for account user wants to send request to
        const to = await Account.findOne( { email: req.body.to });

        //create a new notification document
        const request = await new Notification({
            from: from._id,
            message: 'friend request'
        });

        try {
            //save the notification to the database
            const sentRequest = await request.save();
            
            //append to inbox of user who request is sent to 
            await Account
                .updateOne(
                    {_id: to._id},
                    { $push: {inbox: sentRequest._id}}
                )
                .exec();
            
            res.json({
                status: 'success',
                sentRequest
            });
        } catch (e) {
            res.json({
                status: 'fail',
                sentRequest: null
            });
        }
    }
}