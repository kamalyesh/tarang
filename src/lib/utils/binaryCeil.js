function binaryCeil(number) {
    let returnValue = 1
    do {
        returnValue = returnValue * 2;
        number = number / 2;
    } while (number / 2 > 0)
    return returnValue;
}

export default binaryCeil;