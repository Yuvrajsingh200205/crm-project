import { State, City } from 'country-state-city';

const indiaStates = State.getStatesOfCountry('IN');
const indiaCities = City.getCitiesOfCountry('IN');

const stateMap = {};
indiaStates.forEach(s => {
    stateMap[s.isoCode] = s.name;
});

/**
 * India City → State mapping
 * Each entry: { city: string, state: string }
 */
export const INDIA_CITIES = indiaCities.map(city => ({
    city: city.name,
    state: stateMap[city.stateCode] || ''
}));

/** Return the state for a given city name (case-insensitive). Returns '' if not found. */
export function getStateForCity(cityName) {
    if (!cityName) return '';
    const match = INDIA_CITIES.find(
        (c) => c.city.toLowerCase() === cityName.toLowerCase()
    );
    return match ? match.state : '';
}

/** All unique states sorted alphabetically — for the State dropdown */
export const STATE_OPTIONS = [...indiaStates]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((s) => ({ id: s.name, label: s.name }));

/** All cities for SearchableSelect (unfiltered) */
export const CITY_OPTIONS = INDIA_CITIES.map((c) => ({
    id: c.city,
    label: c.city,
    state: c.state,
}));

/** Return city options filtered to a specific state */
export function getCitiesForState(stateName) {
    if (!stateName) return CITY_OPTIONS;
    
    const state = indiaStates.find(s => s.name === stateName);
    if (!state) return [];
    
    const citiesOfState = City.getCitiesOfState('IN', state.isoCode);
    return citiesOfState.map(c => ({
        id: c.name,
        label: c.name,
        state: stateName
    }));
}
