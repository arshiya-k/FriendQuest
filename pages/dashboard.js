
//https://www.npmjs.com/package/@choc-ui/chakra-autocomplete
import Head from 'next/head';
import { useRouter } from "next/router";
import { useSession, getSession } from "next-auth/react";
// import { Account } from '../db.mjs';
import MakeTrip from '../components/make_trip';
import { Account } from '../db.mjs';
import Header from '../components/navbar';
import { useState } from 'react';
// import { CUIAutoComplete } from 'chakra-ui-autocomplete'
import { 
    Link,
    FormControl, 
    FormLabel, 
    Button,
    Grid,
    GridItem
} from "@chakra-ui/react";
import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList,
  } from "@choc-ui/chakra-autocomplete";
import { FriendRequest, Profile } from '../util.mjs';
// import { useState, useEffect } from 'react';
//import { unstable_getServerSession } from 'next-auth/next';
//server side function
// const 
export default function Dashboard ({account, users}) {
    // console.log(account);
    // console.log(inbox);
    const {data: session} = useSession();
    //const [pickerItems, setPickerItems] = useState(users);
    const [selectedUser, setSelectedUsers] = useState([]);
    // const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();

    //if not logged in, do not give access tp page
    if (!session){
        return <div>do not have access</div>;
    }
    //if logged in, but hasn't set up an account yet, do not give access to page
    if (!account) {
            return <div>set up your account first <Link href="user/setup-profile">Here</Link></div>;
    }
    
   
    
    account = JSON.parse(account);

    //set the selected user as the one picked by the user
    const handleSelectedUsersChange = (selectedUser) => {
          setSelectedUsers(selectedUser.item.value);
    };
    
   
    //make post request to send a request to the user
    const sendRequest = async () => {
        const res = await fetch("/api/add-friend", {
            body: JSON.stringify({
                    to: selectedUser,
                    message: 'friend request'
                }),
                headers: {
                    "Content-Type" : "application/json"   
                },
                method: "POST"
        });

        const result = await res.json();

        if (result.status==='success') {
            router.reload();
        }

    };

    return (
        <>
        <Head />
        <Header/>
        <Grid 
            templateAreas={`     "header header"
                                "tripForm addFriend"
                            `}
            gridTemplateRows={'60px 1fr'}
            gridTemplateColumns={'1fr 1fr'}
            h='200px'
            gap='2'
        >

        
        <GridItem area={'header'}>
            <div className='dashboard-heading'>
                <h3>Welcome, {account.name}</h3>
            </div>
            </GridItem>
        <GridItem area={'tripForm'}>
        <div className='make-quest'>
            <MakeTrip users={users}/>
        </div>
        </GridItem>
        <GridItem area={'addFriend'}>
        <div>
                <FormControl id='friends' w="60">
                <FormLabel>Add friends</FormLabel>
                <AutoComplete openOnFocus onSelectOption={handleSelectedUsersChange}>
                    <AutoCompleteInput variant="filled"/>
                    <AutoCompleteList>
                        {users.map((u, uid) => (
                            <AutoCompleteItem 
                                key={`option-${uid}`}
                                value={u.value}
                                textTransform="capitalize"
                            >
                                {u.label}
                            </AutoCompleteItem>
                        ))}
                    </AutoCompleteList>
                </AutoComplete>
                    <Button colorScheme='teal' size='md' onClick = {() => sendRequest()}>
                        Send Request
                    </Button>
                </FormControl>
        </div>
        </GridItem>
        </Grid>
        </>
    );
}

export async function getServerSideProps(context){
    const session = await getSession(context);
    
    //stuff///
    if (session) {
    
    const accountDocument = await Account
                                    .findOne({email: session.user.email })
                                    .populate({
                                        path: 'friends',
                                        model: 'Account'
                                    })
                                    .populate({
                                        path: 'history',
                                        model: 'Trip',
                                        populate: {
                                            path: 'company',
                                            model: 'Account'
                                        }
                                    })
                                    .populate({
                                        path: 'inbox',
                                        model: 'Notification',
                                        populate: {
                                            path: 'from',
                                            model: 'Account'
                                        }
                                    })
                                    .exec();
                                    // .lean();

    if (!accountDocument) {
        return {
            props: {
                account: null,
                users: null
            }
        };
    }

    const inbox = accountDocument.inbox.map((message)=>{
        return new FriendRequest(message._id, message.from, accountDocument);
    });

    

    const account = JSON.stringify(
        new Profile(accountDocument._id, accountDocument.name, accountDocument.email, accountDocument.bio, accountDocument.location, accountDocument.friends, JSON.stringify(inbox), accountDocument.history)
    );

    const usersDocument = await Account.find();
    const usersList = usersDocument.map(u => {
        return {
            value: u.email,
            label: u.name,
        };
    });

    const users = usersList.filter(user => {
        return ((user.label) && (user.value));
    });

    return {
        props: {account, users}

    };
} else {
    return {
        props : {
            account: null,
            users: null
        }
    };
}


}