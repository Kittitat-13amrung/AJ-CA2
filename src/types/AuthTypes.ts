export interface authTypes {
    signIn: (auth:string) => void,
    signOut: () => void,
    session?: string | null,
    isLoading: boolean
}