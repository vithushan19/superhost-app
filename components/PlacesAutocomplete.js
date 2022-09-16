import usePlacesAutocomplete from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";

import "@reach/combobox/styles.css";

const PlacesAutocomplete = ({ setLocation, location }) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
  } = usePlacesAutocomplete()

  const handleInput = (e) => {
      setValue(e.target.value)
      
      setLocation(e.target.value)
  };

  const handleSelect = (val) => {
      setValue(val, false)
      
      setLocation(val)
  };
    
  return (
    <Combobox onSelect={handleSelect} aria-labelledby="demo">
      <ComboboxInput className="input input-bordered w-full max-w-s" value={location ?? value} placeholder="Casa Loma, Toronto, ON, Canada" onChange={handleInput} disabled={!ready} required />
      <ComboboxPopover>
        <ComboboxList>
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <ComboboxOption key={place_id} value={description} className="dropdown-content bg-base-100 shadow" />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
};

export default PlacesAutocomplete