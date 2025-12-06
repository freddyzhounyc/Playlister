const backendAuthURL = "http://localhost:4000/auth";

export const getLoggedIn = async () => {
    const response = await fetch(backendAuthURL + "/loggedIn", {
        method: "GET",
        credentials: "include"
    });
    return response;
}
export const loginUser = async (email, password) => {
    const response = await fetch(backendAuthURL + "/login", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });
    return response;
}

export const registerUser = async (profileImage, userName, email, password, passwordVerify) => {
    const response = await fetch(backendAuthURL + "/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
            profileImage: profileImage,
            userName: userName,
            email: email,
            password: password,
            passwordVerify: passwordVerify
        })
    });
    return response;
}

const authRequestSender = {
    getLoggedIn,
    loginUser,
    registerUser
}
export default authRequestSender;