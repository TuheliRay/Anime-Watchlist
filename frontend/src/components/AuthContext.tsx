import {createContext} from "react";
import type {Session} from "@supabase/supabase-js";

const AuthContext = createContext<Session | null>(null);

export default AuthContext;