import {useEffect} from "react";
import {createWindowProxy} from "./windowProxy";
import {createDocumentProxy} from "./documentProxy";

import "./App.css";

import "ses";

window.lockdown();

function Analytics({url}) {
    useEffect(() => {
        fetch(url)
            .then(res => res.text())
            .then(res => {
                const documentProxy = createDocumentProxy(document);
                const windowProxy = createWindowProxy(window);

                const c = new window.Compartment({
                    window: windowProxy,
                    self: windowProxy,
                    document: documentProxy,
                    Math
                });

                c.evaluate(res);
            });

        fetch("/googleAnalytics.js")
            .then(res => res.text())
            .then(res => {
                const windowProxy = createWindowProxy(window);
                const documentProxy = createDocumentProxy(document);

                const c = new window.Compartment({
                    window: windowProxy,
                    self: windowProxy,
                    document: documentProxy,
                    Math
                });

                c.evaluate(res);
            });
    }, []);

    const sendEvent = () => {
        const tracker = window.ga.getAll()[0];
        tracker.send("event", "test", "click");
    };

    return (
        <div>
            <button onClick={() => sendEvent()}>Click me</button>
        </div>
    );
}

export default Analytics;
