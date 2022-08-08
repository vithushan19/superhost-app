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
      <ComboboxInput className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={location ?? value} placeholder="Casa Loma, Toronto, ON, Canada" onChange={handleInput} disabled={!ready} />
      <ComboboxPopover>
        <ComboboxList>
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <ComboboxOption key={place_id} value={description} />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
};

export default PlacesAutocomplete