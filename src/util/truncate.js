module.exports = (text, length) => {
    return text.slice(0, length) + (text.length > length ? '...' : '');
};
