import Main from "./pages/Main";
import WebsiteHeader from "./components/WebsiteHeader";
import React, { useEffect } from "react";
import { isEmpty } from "lodash";
import Network from "./utils/network";
import {
    createBrowserRouter,
    createHashRouter,
    RouterProvider,
} from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";

const empty_profile = {
    first_name: "Expired Account.",
    last_name: " | Please Log In Again",
    email: "",
    admin: false,
};

function App() {
    const [token, setToken] = React.useState(null);
    const [userProfile, setUserProfile] = React.useState(empty_profile);

    const [refreshItemToken, setRefreshItemToken] = React.useState(0);
    function refreshItems() {
        setRefreshItemToken(refreshItemToken + 1);
    }

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
                    updateAndSaveToken(null);
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

    const router = createHashRouter([
        {
            path: "*",
            element: <>
                <WebsiteHeader token={token} updateAndSaveToken={updateAndSaveToken} userProfile={userProfile} refreshItems={refreshItems} />
                <Main token={token} userProfile={userProfile} refreshItems={refreshItems} refreshItemToken={refreshItemToken} />
            </>,
            errorElement: <ErrorPage />,
        },
    ]);


    return <RouterProvider router={router} />
}

export default App;
