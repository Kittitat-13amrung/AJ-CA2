import React from 'react';
import { useSession } from '../contexts/AuthContext';
import { setStorageItemAsync, useStorageState } from './useStorageState';

export function useProfileState() {
    const { session } = useSession();
    const [state, setState] = React.useState<{
        _id: string,
        avatar: string,
        username: string,
        token: string
    } | null>();

    // retrieve profile state from session
    React.useEffect(() => {
        const credentials: {
            _id: string,
            avatar: string,
            username: string,
            token: string
        } = JSON.parse(session as string);

        setState(credentials);
    }, [session]);

    return state;
}