import {createContext,useContext,useEffect,useState} from "react";
import api from "../api";
const AuthContext=createContext(null);
export function AuthProvider({children}){
 const [user,setUser]=useState(null),[loading,setLoading]=useState(true);
 const refresh=async()=>{try{const {data}=await api.get("/auth/me");setUser(data.user);}catch{setUser(null);}finally{setLoading(false);}};
 useEffect(()=>{refresh();},[]);
 const login=async values=>{const {data}=await api.post("/auth/login",values);setUser(data.user);return data.user;};
 const register=async values=>{await api.post("/auth/register",values);return login({email:values.email,password:values.password});};
 const logout=async()=>{await api.post("/auth/logout");setUser(null);};
 return <AuthContext.Provider value={{user,loading,login,register,logout,refresh}}>{children}</AuthContext.Provider>;
}
export const useAuth=()=>useContext(AuthContext);
