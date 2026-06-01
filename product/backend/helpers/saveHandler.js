function saveHandler(callback) {
    try {
        callback();
    } catch (err) {
        console.error(err.message);
    }
}

module.exports = saveHandler;