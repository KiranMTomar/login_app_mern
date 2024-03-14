
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/store";

export const AuthorizedUser = ({ children }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    if(!token){
        return navigate('/', {replace: true});
    }

    return children;
}


export const ProtectRoute = ({ children }) => {
    const navigate = useNavigate();
    const username = useAuthStore.getState().auth.username;
    if(!username){
        return navigate('/', {replace: true});
    }
    return children;
}