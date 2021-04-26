const handler = () => {
    return {
        apply: function(target, thisArg, args) {
            return []
        }
    }
};


export const createGetElementsByTagNameProxy = (getElementsByTagName) => {
    return new Proxy(getElementsByTagName, handler())
};