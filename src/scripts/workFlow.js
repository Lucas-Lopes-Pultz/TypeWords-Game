const myLibrary = {
    isOpen(element) {
        return element.classList.contains('show')
    },

    getNumberInString(string) {
        const stringIsEmpty = string === ''
        return isNaN(Number(string)) || stringIsEmpty ? string : Number(string)
    },

    createElement(element_name, attributes, who_append) {
        const element = document.createElement(element_name)

        if (attributes) {
            const attributesArray = Object.entries(attributes)
            attributesArray.forEach(([key, value]) => element.setAttribute(key, value))
        }

        if (who_append) who_append.appendChild(element)

        return element
    },

    objectKeys(object) {
        return Object.keys(object)
    },

    getRandomNumber(maxLength = 1, minLength = 0) {
        return Math.floor(Math.random() * maxLength + minLength)
    },

    hide(element) {
        element.classList.remove('hide')
        element.classList.remove('show')
        element.classList.add('hide')
    },

    show(element) {
        element.classList.remove('show')
        element.classList.remove('hide')
        element.classList.add('show')
    },

    forEachStorageKey(callback) {
        for (let item = 0; item < localStorage.length; item++) {
            callback(localStorage.key(item))
        }
    },

    findStorageKey(callback) {
        for (let index = 0; index < localStorage.length; index++) {
            let item = localStorage.key(index)
            callback(item)
            if (callback(item)) return item
        }
    },

    getLowerLetters() {
        let array_lower = []
        for (let letter = 97; letter < 123; letter++) {
            array_lower.push(String.fromCharCode(letter))
        }
        return array_lower
    },

    getUpperLetters() {
        let array_upper = []
        for (let letter = 65; letter < 91; letter++) {
            array_upper.push(String.fromCharCode(letter))
        }
        return array_upper
    },

    getAllLetters() {
        return [...this.getUpperLetters(), ...this.getLowerLetters()]
    },

    addClass(element, classValue) {
        element.classList.add(classValue)
    },

    removeElementInArray(array, element) {
        const elementIndex = array.indexOf(element)
        array.splice(elementIndex, 1)
    },

    getMaxNumberOf(array){
        return array.reduce((maxLength, length) => length > maxLength ? length : maxLength, 0)
    },

    getMinNumberOf(array){
        return array.reduce((minLength, length) => 
            length < minLength ? length : minLength, this.getMaxNumberOf(array))
    }   

}

export default myLibrary