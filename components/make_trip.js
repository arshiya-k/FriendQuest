import "@reach/combobox/styles.css";
import { useRouter } from "next/router";
import { useLoadScript } from "@react-google-maps/api";
import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList,
  } from "@choc-ui/chakra-autocomplete";
import { useState } from "react";
import PlacesAutocomplete from "./place-select";
import { Box } from "@chakra-ui/react";

const libs = ["places"];

export default function MakeTrip({users}){
    console.log(users);
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GMAPS_API_KEY,
        libraries: libs,
    });
    const [selected, setSelected] = useState('');
    const [selectedCompany, setSelectedCompany] = useState('');
    const router = useRouter();

    //https://stackoverflow.com/questions/32378590/set-date-input-fields-max-date-to-today
    const today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    const yy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }
     
    if (mm < 10) {
        mm = '0' + mm;
    } 
    
    const todayString = yy + '-' + mm + '-' + dd;

    const handleSelectedUsersChange = (friend) => {
        setSelectedCompany(friend.item.value);
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();

        console.log(selected);

        const res = await fetch("/api/create-quest", {
            body: JSON.stringify({
                    keywords: evt.target.keywords.value,
                    location: selected,
                    company: selectedCompany,
                    date: evt.target.planDate.value,
                    time: evt.target.time.value
                }),
                headers: {
                    "Content-Type" : "application/json"   
                },
                method: "POST"
        });

        const result = await res.json();
        console.log(result);
        // router.push('/dashboard');
        router.reload(window.location.pathname);
    }; 

    if (!isLoaded) { return <div>Loading...</div>; }

    // const { init }

    return (
        <div>
            <h2>Make a quest</h2>
            <form className="trip-form" onSubmit={handleSubmit}>
                <label htmlFor="keywords">In the mood for</label><br/>
                <input type="text" name="keywords" id="keywords"/><br/>
                <label htmlFor="location">Going to</label><br/>
                <Box>
                    <PlacesAutocomplete setSelected={setSelected} />
                </Box>
                {/* <input type="text" name="location" id="location"/><br/> */}
                <label htmlFor="company">With</label><br/>
                {users && (
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
                )}
                <input type="text" name="company" id="company"/><br/>
                <label htmlFor="planDate">Date</label><br/>
                <input type="date" id="planDate" name="planDate" min={todayString}/><br/>
                <label htmlFor="time">Time</label><br/>
                <input type="time" id="time" name="time"/><br/>
                <button type="submit" value="create-quest">Post</button>
            </form>
        </div>
    );
}



