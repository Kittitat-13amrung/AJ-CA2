import React from 'react';
import { useSession } from '../contexts/AuthContext';

export function useProfileState() {
    const { session } = useSession();
    const [state, setState] = React.useState<{
        _id: string,
        avatar: string,
        username: string,
        token: string
    } | null>();

    React.useEffect(() => {
        const credentials: {
            _id: string,
            avatar: string,
            username: string,
            token: string
        } = JSON.parse(session as string);

        // remove unnescessarily properties
        // const { token } = credentials;

        // console.log(credentials);

        setState(credentials);
    }, [session]);

    return state;
}