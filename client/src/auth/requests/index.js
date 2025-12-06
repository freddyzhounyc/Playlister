const backendAuthURL = "http://localhost:4000/auth";

export const getLoggedIn = async () => {
    const response = await fetch(backendAuthURL + "/loggedIn", {
        method: "GET",
        credentials: "include"
    });
    return response;
}

const authRequestSender = {
    getLoggedIn
}
export default authRequestSender;