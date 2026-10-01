import { createContext, useContext } from "react";
import type { AuthContextType } from "./authTypes";




export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

export const useAuth = (): AuthContextType => {

    const context = useContext(AuthContext);

    if ( !context ){
        
        throw new Error(
             "useAuth debe utilizarse dentro de un AuthProvider"
        )
    }
    
    return context;
}


