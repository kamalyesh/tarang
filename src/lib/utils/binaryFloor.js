function binaryFloor(number) {
    let returnValue = 1
    while (number / 2 > 1) {
        returnValue = returnValue * 2;
        number = number / 2;
    }
    // console.log('returnValue', returnValue)
    return returnValue;
}

export default binaryFloor;
