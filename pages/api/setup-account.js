
import { getSession } from "next-auth/react";
import { Account } from "../../db.mjs";


export default async function edit (req, res) {
    const session = await getSession({ req });

    if (!session) {
        return res.json({error: "not logged in"});
    }

    if (req.method === "POST"){
        const accountExists = await Account.findOne({username: session.user.email });

        if (accountExists) {
            return res.json({
                status: "account already exists",
                flag: 0,
                createdAccount: null
            });
        } else {
            const newAccount = new Account({
                email: session.user.email,
                name: session.user.name,
                username: req.body.username,
                preferred: req.body.preferred,
                location: req.body.homecity,
                bio: req.body.bio,
                friends: [],
                history: []
            });

            try {
                const createdAccount = await newAccount.save();
                res.json({
                    status: 'success',
                    flag: 1,
                    createdAccount
                });
            } catch (e) {
                res.json({
                    status: 'error creating account',
                    flag: 0,
                    createdAccount: null
                });
            }
        }
    }
}