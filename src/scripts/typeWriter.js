function typeWriter(element, time = 0) {
    const txt_array = element.textContent.split('')
    element.textContent = ''

    txt_array.forEach((letra, i) => {
        setTimeout(() => element.textContent += letra, time * i)
    })
}

export default typeWriter