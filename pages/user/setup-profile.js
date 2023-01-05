import { Link } from "@chakra-ui/react";
import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import Header from "../../components/navbar";
import PlacesAutocomplete from "../../components/place-select";
import { Account } from "../../db.mjs";


const libs = ["places"];
export default function AddDetails({exists})
{
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GMAPS_API_KEY,
        libraries: libs,
    });


    const [selected, setSelected] = useState('');
    const router = useRouter();
    const {data: session} = useSession();

    const editDetails = async (evt) => {
        evt.preventDefault();
    


        const res = await fetch("/api/setup-account", {
            body: JSON.stringify({
                purpose: 'other',
                // name: session.user.name,
                // email: session.user.email,
                username: evt.target.username.value,
                preferred: evt.target.preferred.value,
                homecity: selected,
                bio: evt.target.bio.value
            }),
            headers: {
                "Content-Type": "application/json",
            }, 
            method: "POST",
        });


        const result = await res.json();
       

        if (result.status === 'success') {
            router.push('/dashboard');
        }

    };

    if (!isLoaded) { return <div>Loading...</div>; }
    if (exists) { return <div>Already have an account, go to your dashboard <Link href ="/dashboard">Here</Link></div>; }

    return (
        <div>
            <Header />
        
            {!session && (
                <h3>do not have access</h3>
            )}
            {session && (
                <form onSubmit={editDetails}>
                    <label htmlFor="preferred">Preferred Name</label><br/>                   
                    <input id="preferred" name="preferred" type="text"/><br/>
                    <label htmlFor="username">Username</label><br/>
                    <input id="username" name="username" type="text"/><br/>
                    <label htmlFor="homecity">Based in</label><br/>
                    <PlacesAutocomplete setSelected={setSelected}/>
                    <label htmlFor="bio">Tell us a little about yourself</label><br/>
                    <input id="bio" name="bio" type="text"/><br/>
                    <button type="submit">Update</button><br/>
                </form>
            )} 
            </div>

    );
}



export async function getServerSideProps(context){
    const session = await getSession(context);
    if (session) {
    const user = await Account.findOne({ email: session.user.email });

    let exists;
    if (user) {
        exists = true;
    } else {
        exists = false;
    }

    return (
        {props: {
            exists: exists,
        }}
    );
    } else {
        return {props: {
            exists: null
        }};
    }

}