const generateRandom = () => {
    const randomString = (Math.random() + 1).toString(36).substring(7);
    return randomString
}

export default generateRandom