import {useEffect, useState} from "react";
import "./App.css";

import Analytics from "./Analytics";
import {
    GoogleAPI,
    googleGetBasicProfil,
    GoogleLogin,
    GoogleLogout,
    googleGetAuthResponse
} from "react-google-oauth";

function App() {
    const [user, setUser] = useState(googleGetBasicProfil().email);
    const [tagManager, setTagManager] = useState("https://www.googletagmanager.com/gtag/js?id=UA-189964903-1");
    const [clicks, setClicks] = useState("0");

    useEffect(() => {
        const interval = setInterval(() => {
            console.log(user);
            if (user) {
                const auth = googleGetAuthResponse();
                fetch(
                    "https://www.googleapis.com/analytics/v3/data/realtime?ids=ga:237665081&metrics=rt:totalEvents&access_token=" +
                    auth.accessToken
                )
                    .then(response => response.json())
                    .then(result => {
                        setClicks(result.totalsForAllResults["rt:totalEvents"]);
                    });
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [user]);

    const updateSignInStatus = val => {
        if (val) {
            setUser(googleGetBasicProfil().email);
        } else {
            setUser(undefined);
        }
    };

    return (
        <div className="App">
            <h1>Test Application</h1>
            <p>This application isolates a Google Analytics script and enforces the principles of least privilege on
                it</p>
            <p>Clicking the button below makes a network request to google analytics to log the event</p>
            <Analytics url={tagManager}/>
            <h1 className="Clicks">Clicks: {clicks}</h1>
            <div className="Google">
                <label>Current link to google site tag script: </label>
                <input value={tagManager} onChange={(e) => setTagManager(e.target.value)}/>
                <GoogleAPI
                    clientId="739151456083-q1lgjcgnqcj29rvmue2k9kdlm5q5l6s6.apps.googleusercontent.com"
                    scope="https://www.googleapis.com/auth/analytics.readonly"
                    prompt="consent"
                    onUpdateSigninStatus={updateSignInStatus}
                >
                    <div>
                        {user ? (
                            <div>
                                <GoogleLogout/>
                            </div>
                        ) : (
                            <div>
                                <GoogleLogin/>
                            </div>
                        )}
                    </div>
                </GoogleAPI>
            </div>
        </div>
    );
}

export default App;
