import {createSetTimeoutProxy} from "./setTimeoutProxy";
import {createDocumentProxy} from "./documentProxy";

const policy = {
    get: {
        navigator: true,
        location: true,
        gtag_enable_tcf_support: true,

        google_tag_manager: true,
        GoogleAnalyticsObject: true,
        dataLayer: true,
        google_tag_data: true,
        gaplugins: true,
        gaGlobal: true,
        ga: true,
        gaData: true,

        history: true,
        setTimeout: true,
        document: true,

        clearTimeout: true
    },
    set: {
        gaplugins: true,
        gaGlobal: true,
        gaData: true,
        google_tag_manager: true,
        ga: true,
        GoogleAnalyticsObject: true,
        dataLayer: true,
        google_tag_data: true
    }
};

const SET_TIMEOUT = "setTimeout";
const HISTORY = "history";
const DOCUMENT = "document";

const handler = withLogs => {
    return {
        get: function (target, prop) {
            if (policy.get[prop]) {

                let property = target[prop];

                if (typeof target[prop] === 'function') {
                    property = property.bind(target);
                }
                if (prop === SET_TIMEOUT) {
                    property = createSetTimeoutProxy(property)
                }
                if (prop === HISTORY) {
                    property = {length: window.history.length}
                }
                if (prop === DOCUMENT) {
                    property = createDocumentProxy(property)
                }
                return property;
            }
            if (withLogs) {
                console.log(`window get ${prop} blocked`);
            }
        },
        set: function (target, prop, value) {
            if (policy.set[prop]) {
                target[prop] = value;
                return true;
            }
            if (withLogs) {
                console.log(`window set ${prop} blocked`);
            }
        }
    };
};

export const createWindowProxy = (window, withLogs) => {
    return new Proxy(window, handler(withLogs));
};
