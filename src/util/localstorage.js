function getKey(key) {
    return `kcapp:${key}`;
}

exports.get = key => localStorage.getItem(getKey(key));
exports.getInt = key => parseInt(localStorage.getItem(getKey(key)));
exports.getBool = key => {
    const item = localStorage.getItem(getKey(key));
    if (!item) {
        return false;
    }
    return item === 'true';
}
exports.set = (key, value) =>
    localStorage.setItem(getKey(key), value);
exports.getKey = getKey;
exports.remove = key => localStorage.removeItem(getKey(key));
