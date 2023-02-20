import Main from "./pages/Main";
import WebsiteHeader from "./components/WebsiteHeader";
import React, { useEffect } from "react";
import { isEmpty } from "lodash";
import Network from "./utils/network";

const empty_profile = {
    first_name: "Expired Account.",
    last_name: " | Please Log In Again",
    email: "",
};

function App() {
    const [token, setToken] = React.useState(null);
    const [userProfile, setUserProfile] = React.useState(empty_profile);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!isEmpty(token)) {
            setToken(token);
        }
    }, []);

    useEffect(() => {
        // Update the user profile if the token changes
        if (!isEmpty(token)) {
            Network.profile(token)
                .then((user) => {
                    setUserProfile(user);
                })
                .catch((e) => {
                    setUserProfile(empty_profile);
                });
        }
    }, [token]);

    async function updateAndSaveToken(token) {
        if (isEmpty(token)) {
            setToken(null);
            setUserProfile(empty_profile);
            localStorage.removeItem("token");
        } else {
            localStorage.setItem("token", token);
            setToken(token);
        }
    }

    return (
        <>
            <WebsiteHeader
                token={token}
                updateAndSaveToken={updateAndSaveToken}
                userProfile={userProfile}
            />
            <Main token={token} userProfile={userProfile} />
        </>
    );
}

export default App;
