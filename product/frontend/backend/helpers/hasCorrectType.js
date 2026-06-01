function hasCorrectType(value, correctType) {
    return Object
        .prototype
        .toString
        .call(value)
        .split("[")
        .at(-1)
        .split("object ")
        .at(-1)
        .split("]")[0]
        .toLowerCase()
        === correctType;
}

module.exports = hasCorrectType;