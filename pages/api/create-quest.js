import { getSession } from "next-auth/react";
import { Account, Trip } from "../../db.mjs";

export default async function createQuest(req, res){
    const session = await getSession({ req });

    if (!session){
        return res.json({error: "not logged in"});
    }

    if (req.method === "POST"){
        const acc = await Account.findOne({email: session.user.email});

        const newTrip = new Trip({
            date: req.body.date,
            time: req.body.time,
            stage: 'planning',
            location: req.body.location,
            // company: req.body.company
        });
        
        try {
            const createdTrip = await newTrip.save();

            const company = await Account.findOne({ email: req.body.company });

            if (company) {
                await Trip.updateOne(
                    {_id: createdTrip._id},
                    {$push: {company: company._id }}
                );
            }

            await Account.updateOne(
                {_id: acc._id},
                { $push: {history: createdTrip._id}}
            );
            
            res.json({
                status: 'success',
                createdTrip
            });
        } catch (e) {
            res.json({
                status: 'fail',
                createdTrip: null
            });
        }


    }
}