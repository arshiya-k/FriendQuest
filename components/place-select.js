import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
  } from "@reach/combobox";
import "@reach/combobox/styles.css";
import usePlacesAutocomplete from "use-places-autocomplete";


export default function PlacesAutocomplete({setSelected}){
    const {
        ready,
        value,
        setValue,
        suggestions: {status, data},
        clearSuggestions
    } = usePlacesAutocomplete();

    const handleSelect = async (address) => {
        setValue(address, false);
        clearSuggestions();
        setSelected(address);
    };

    return (
        <Combobox onSelect={handleSelect}>
            <ComboboxInput
                value={value}
                onChange = {(e) => setValue(e.target.value)}
                disabled = {!ready}
                className="combobox-input"
                placeholder="City"
            />
            {/* {console.log(status)} */}
            <ComboboxPopover>
                <ComboboxList>
                    {status==="OK" && 
                        data.map(({placeID, description}) =>(
                            <ComboboxOption key={placeID} value={description}/>
                        ))}
                </ComboboxList>
            </ComboboxPopover>
        </Combobox>
    );
}
