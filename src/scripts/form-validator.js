const formValidator = {
    inputsAreEmpty(inputs, errorText) {
        const emptyInput = Array.from(inputs).find(input => input.value === '')
        const thereException = emptyInput ? true : false
        const errorMessage = emptyInput ? new Error(errorText) : undefined

        return {
            thereException,
            errorMessage
        }
    }
}

export default formValidator