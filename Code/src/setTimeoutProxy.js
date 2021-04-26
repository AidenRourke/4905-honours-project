const handler = () => {
    return {
        apply: function(target, thisArg, args) {
            const callBack = args[0];
            const i = args[1];
            const safeCallBack = callBack.bind(thisArg);

            return target(safeCallBack, i)
        }
    }
};


export const createSetTimeoutProxy = (setTimeout) => {
    return new Proxy(setTimeout, handler())
};