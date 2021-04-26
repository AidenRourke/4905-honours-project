import {createGetElementByIdProxy} from "./getElementByIdProxy";
import {createGetElementsByTagNameProxy} from "./getElementsByTagNameProxy";

const policy = {
    get: {
        location: true,
        cookie: true,

        createElement: true,

        getElementsByTagName: true,
        getElementById: true,
    },
    set: {
        cookie: true
    }
};

const GET_ELEMENTS_BY_TAG_NAME = "getElementsByTagName";
const GET_ELEMENT_BY_ID = "getElementById";

const handler = withLogs => {
    return {
        get: function (target, prop) {
            if (policy.get[prop]) {

                let property = target[prop];

                if  (typeof target[prop] === 'function') {
                    property = property.bind(target);
                }
                if (prop === GET_ELEMENTS_BY_TAG_NAME) {
                    property = createGetElementsByTagNameProxy(property)
                }
                if (property ===  GET_ELEMENT_BY_ID) {
                    property =  createGetElementByIdProxy(property)
                }
                return property
            }
            if (withLogs) {
                console.log(`document get ${prop} blocked`);
            }
        },
        set: function (target, prop, value) {
            if (policy.set[prop]) {
                target[prop] = value;
                return true;
            }
            if (withLogs) {
                console.log(`document set ${prop} blocked`);
            }
        }
    }
};

export const createDocumentProxy = (document, withLogs = false) => {
    return new Proxy(document, handler(withLogs))
};