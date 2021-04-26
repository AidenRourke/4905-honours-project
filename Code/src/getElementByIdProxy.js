const handler = () => {
    return {
        apply: function(target, thisArg, args) {
            return null
        }
    }
};


export const createGetElementByIdProxy = (getElementById) => {
    return new Proxy(getElementById, handler())
};