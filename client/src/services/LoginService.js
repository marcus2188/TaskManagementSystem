import { useState } from "react";

/* LOGINSERVICE IS AN INJECTABLE CLASS THAT HANDLES ALL LOGIN LOGOUT REGISTER LOGIC/CONTROLLER */
export default class LoginService{
    // Check inputs if valid, Valid means not blank
    usernameValid = usernamestr => {
        return usernamestr.trim().length > 0;
    }
    passwordValid = passwordstr => {
        return passwordstr.trim().length > 0;
    }
    emailValid = emailstr => {
        return emailstr.trim().length > 0;
    }

    // Check inputs if acceptable, Acceptable means hit criterion for register and updateprofile
    usernameAcceptable = usernamestr => {
        return usernamestr.trim().length >= 5;
    }
    passwordAcceptable = passwordstr => {
        var hasNumber = /\d/; 
        var hasSymbol = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/; 
        return passwordstr.length >= 8 && passwordstr.length <= 10 && hasNumber.test(passwordstr) && hasSymbol.test(passwordstr);
    }
    emailAcceptable = emailstr => {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailstr);
    }

    // Check if input is blank (for editaccount page, blanks are allowed)
    isBlank = inputstr => {
        return inputstr==='';
    }

    // Send fetch POST request to /login endpoint passing username and password hash over to log in
    loginUser = async credentials => {
        const data = await fetch('http://localhost:3001/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(credentials) });
        return await data.json();
    }

    // To log out clear SessionStorage of tokens and refresh window
    logoutUser = () => {
        sessionStorage.removeItem('token');
        window.location.reload(true);
    }

    // Send fetch POST request to /updateprofile endpoint to update account details of password and email
    updateAccount = async credentials => {
        const data = await fetch('http://localhost:3001/updateprofile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(credentials) });
        return await data.json();
    }
    
    // Register a user by making POST request with credentials encrypted
    registerUser = async (credentials) => {
        return fetch('http://localhost:3001/register', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(credentials)}).then(data => data.json())
    }

    // Token setting, saving, getting from SessionStorage
    useToken = () => {
        const getToken = () =>{
            const tokenstr = sessionStorage.getItem('token');
            const userToken = JSON.parse(tokenstr);
            return userToken?.token
        };
        const [token, setToken] = useState(getToken());
        const saveToken = (userToken) =>{
            sessionStorage.setItem('token', JSON.stringify(userToken));
            setToken(userToken.token);
        };
        return {setToken: saveToken, token}
    }
}