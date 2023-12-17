import { createContext, useContext } from "react";
import { useStorageState } from "../hooks/useStorageState";
import { authTypes } from "src/types/AuthTypes";

export const authContext = createContext<{
    signIn: (token:string) => void,
    signOut: () => void,
    session?: string | null,
    isLoading: boolean
}>({
    signIn: (token:string) => {},
    signOut: () => {},
    session: '',
    isLoading: true
}) ;

export function useSession() : authTypes {
    const value = useContext(authContext);

    if(process.env.NODE_ENV === "production") {
        if(!value) {
            throw new Error("useSession must be wrapped in a <SessionProvider />");
        }
    }

    return value;
}

export function SessionProvider(props:React.PropsWithChildren) {
    const [[isLoading, session], setSession] = useStorageState('session');

    return (
        <authContext.Provider
        value={{ 
            signIn: (auth) => {
                // Perform sign-in logic here
                setSession(JSON.stringify(auth));
            },
            signOut: () => {
                setSession(null);
            },
            session,
            isLoading
         }}>
            {props.children}
         </authContext.Provider>
    )
}