const serverStoreUrl = "http://localhost:4000/api";

export const updateUser = async (id, profileImage, userName, email, password, passwordVerify) => {
    const response = await fetch(serverStoreUrl + "/user/" + id, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
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

const apis = {
    updateUser
}
export default apis;