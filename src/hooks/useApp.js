import { useContext } from 'react';
import { AppContext } from '../context/AppContextValue';

export function useApp() {
    return useContext(AppContext);
}
