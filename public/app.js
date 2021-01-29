import { chronometer, getFormatedTime } from '../src/scripts/chronometer.js'
import elementsDOM from '../src/scripts/elements-dom.js'
import typeWriter from '../src/scripts/typeWriter.js'
import formValidator from '../src/scripts/form-validator.js'
import myLibrary from '../src/scripts/workFlow.js'


const timer = chronometer(elementsDOM.timerSpan)

let settings = {}

const words = {
    async fetchWords() {
        const response = await fetch('../src/words.json')
        const json = await response.json()
        return json
    },

    async getAllWords() {
        const data = await words.fetchWords()
        const allLevels = myLibrary.objectKeys(data)
        myLibrary.removeElementInArray(allLevels, 'Filmes')
        const allWordsArray = allLevels.flatMap(level => data[level])
        
        return allWordsArray
    },
    
    lengthOfWords(wordsArray, mode) {
        const lengthArray = wordsArray.map(word => word.length)
        if (mode === 'max') return myLibrary.getMaxNumberOf(lengthArray)
        if (mode === 'min') return myLibrary.getMinNumberOf(lengthArray)
    },
}


const typeWord = {
    points: 0,

    readyGame(event) {
        level.setGameLevelToSettings(event.target.classList[1])
        menu.readyGameStarter()
    },
    
    startNewGame() {
        typeWord.resetGame()
        typeWord.startNewTurn()
        /* timer.pause() */
    },
    
    startNewTurn() {
        elementsDOM.answerInput.focus()
        this.resetTurn()
        timer.start(settings.seconds, settings.miliseconds)
        this.showRandomContent(this.getWordOfGameMode(settings.gameMode))
    },

    getWordOfGameMode(modeGame) {
        if (modeGame === 'Letras Aleatórias')
            return gameModes.randomLettersMode(settings.maxWordsLength)
            
        if (modeGame === 'Palavras Aleatórias')
        return gameModes.randomWordsMode(settings.maxWordsLength)
        
        return gameModes.getWordsFrom(modeGame, settings.maxWordsLength)
    },
    
    addTurnDataToHTML(gameOverCause) {
        typeWriter(elementsDOM.gameOverMessage, 100)
        elementsDOM.gameOverPoints.textContent = `Pontos: ${this.points}`
        elementsDOM.gameOverExpectedAnswer.textContent = `palavra: ${elementsDOM.word.textContent}`
        elementsDOM.gameOverTypeError.textContent = elementsDOM.answerInput.value
        elementsDOM.TimeIsEndMessage.textContent = ''
        
        if (gameOverCause === 'timeIsEnd') {
            elementsDOM.gameOverTypeError.textContent = ''
            elementsDOM.TimeIsEndMessage.textContent = 'Que pena o tempo acabou :('
        }
    },
    
    gameOver(gameOverCause) {
        myLibrary.show(elementsDOM.gameOverArea)
        this.stopGame()
        this.addTurnDataToHTML(gameOverCause)
    },
    
    updatePoints(value) {
        value === 'reset' ?
        this.points = 0 :
        this.points += value

        elementsDOM.pointsSpan.textContent = this.points
    },

    stopGame() {
        timer.pause()
        elementsDOM.answerInput.setAttribute('readonly', 'readonly')
    },
    
    endTime(event) {
        if (event.detail.endTime) typeWord.gameOver('timeIsEnd')
    },

    changeTurn() {
        this.startNewTurn()
        this.updatePoints(+1)
    },

    validateAnswer(answer) {
        const answerIsCorrect = answer === elementsDOM.word.innerHTML
        answerIsCorrect ? this.changeTurn() : this.gameOver('answerIsIncorret')
    },

    async showRandomContent(randomWord) {
        elementsDOM.word.innerHTML = await randomWord
        elementsDOM.contentLength.textContent = (await randomWord).length
    },

    gameIsRunning() {
        return !myLibrary.isOpen(elementsDOM.gameStarter) &&
            !myLibrary.isOpen(elementsDOM.gameOverArea) && !menu.menuIsOpen
    },
    
    resetGame() {
        this.resetTurn()
        this.updatePoints('reset')
        elementsDOM.answerInput.removeAttribute('readonly')
        elementsDOM.answerInput.focus()
        myLibrary.hide(elementsDOM.gameOverArea)
    },
    
    resetTurn() {
        timer.stop()
        elementsDOM.answerInput.value = ''
        elementsDOM.word.innerHTML = ''
    }
}

const gameModes = {
    listName: ['Palavras Aleatórias', 'Letras Aleatórias'],
    
    concatOtherGameModesToListName() {
        const otherGamemodes = [
            'Animais', 'Cores', 'Filmes',
            'Heróis', 'Objetos', 'Países',
            'Plantas', 'Verbos', 'Alimentos',
            'Profissões', 'Nomes Femininos', 'Nomes Masculinos'
        ]

        this.listName = this.listName.concat(otherGamemodes.sort())
    },
    
    addToList() {
        this.concatOtherGameModesToListName()
        for (let gameMode of this.listName) {
            const option = myLibrary.createElement('option',
            { value: gameMode }, elementsDOM.levelCreatorGameMode)
            option.textContent = gameMode
        }
    },

    randomLettersMode(maxLength) {
        const randomLength = myLibrary.getRandomNumber(maxLength, 1)
        const allLetters = myLibrary.getAllLetters()
        
        const randomIndexs = () => {
            let randomIndexsArray = []
            for (let i = 0; i < randomLength; i++) {
                randomIndexsArray.push(myLibrary.getRandomNumber(allLetters.length))
            }
            return randomIndexsArray
        }

        const randomLetters = () => randomIndexs().map(index => allLetters[index]).join('')
        
        return randomLetters()
    },
    
    async randomWordsMode(maxLength) {
        const allWords = await words.getAllWords()
        const allWordsFiltered = allWords.filter(word => word.length <= maxLength)
        const randomIndex = myLibrary.getRandomNumber(allWordsFiltered.length)
        
        return allWordsFiltered[randomIndex]
    },
    
    async getWordsFrom(wordsArrayName, maxLength) {
        const wordsData = await this.getGameModeWords(wordsArrayName)
        const wordsDataFiltered = wordsData.filter(word => word.length <= maxLength)

        const randomIndex = myLibrary.getRandomNumber(wordsDataFiltered.length)
        return wordsDataFiltered[randomIndex]
    },

    async getGameModeWords(GameModeName) {
        const data = await words.fetchWords()
        return data[GameModeName]
    }
}


const menu = {
    get menuIsOpen() {
        return !myLibrary.isOpen(elementsDOM.gameContainer)
    },
    
    close() {
        myLibrary.hide(elementsDOM.menuContainer)
    },

    open() {
        myLibrary.show(elementsDOM.menuContainer)
        myLibrary.hide(elementsDOM.gameStarter)
        myLibrary.hide(elementsDOM.gameOverArea)
        myLibrary.hide(elementsDOM.gameContainer)
        myLibrary.hide(elementsDOM.popupLevelCreator)
    },
    
    readyGameStarter() {
        menu.close()
        myLibrary.show(elementsDOM.gameContainer)
        myLibrary.show(elementsDOM.gameStarter)
        typeWord.resetGame()
        
        level.showFeaturesOfLevel()
        typeWriter(elementsDOM.pressEnterMessage, 50)
    },

    readyLevelCreator() {
        
    },
    
    addAnimationToButtons() {
        elementsDOM.menuButtons.forEach(button => {
            button.classList.add('animate-btn')
        })
    },
    
    addEventListenerToButtons() {
        for (let button of elementsDOM.menuButtons) {
            button.addEventListener('click', typeWord.readyGame)
        }
    },
    
    addEventListenerToRemoveButtons() {
        elementsDOM.setElementDOM('btnRemoveLevel', '.btn-remove-level', 'all')
        elementsDOM.btnRemoveLevel.forEach(btn => {
            btn.addEventListener('click', level.removeCreatedLevel)
        })
    },
    
    async getTotalWords() {
        const data = await words.fetchWords()
        const keys = Object.keys(data)
        const totalWords = keys.flatMap(key => data[key])
        
        return totalWords.length
    },
    
    async showTotalWords() {
        const totalWords = await this.getTotalWords()
        elementsDOM.totalWordsSpan.textContent = `Total de Palavras: ${totalWords}`
    }
}


const levelCreator = {
    open() {
        menu.close()
        myLibrary.show(elementsDOM.popupLevelCreator)
        levelCreator.reset()
        levelCreator.addOptionsRandomWords()
    },

    getInputsData() {
        const inputs = Array.from(elementsDOM.levelCreatorInputs)
            .map(input => myLibrary.getNumberInString(input.value))
            
            const selectedIndexGameMode = elementsDOM.levelCreatorGameMode.selectedIndex
        const selectOptionGameMode =
        elementsDOM.levelCreatorGameMode.options[selectedIndexGameMode].value

        
        const selectedIndexMaxLength = elementsDOM.levelCreatorMaxLength.selectedIndex
        const selectOptionMaxLength =
        Number(elementsDOM.levelCreatorMaxLength.options[selectedIndexMaxLength].value)

        return [
            ...inputs,
            selectOptionMaxLength,
            selectOptionGameMode,
        ]
    },

    reset() {
        Array.from(elementsDOM.levelCreatorInputs).forEach(input => input.value = '')
        elementsDOM.levelCreatorGameMode.selectedIndex = 0
    },
    

    create() {
        menu.open()
        const customLevelFeatures = level.newLevel(...levelCreator.getInputsData())

        level.setCustomLevelTolevels(customLevelFeatures)
        level.setLevelsToLocalStorage()
        level.showMessageCreatedLevelsIsEmpty()
        level.createdLevelsList.add()

        myLibrary.hide(elementsDOM.popupLevelCreator)
    },

    validate() {
        const validator = formValidator.inputsAreEmpty(
            elementsDOM.levelCreatorInputs,
            'Preencha todos os campos'
            )
            
        validator.thereException ?
        alert(validator.errorMessage.message) :
        levelCreator.create()
    },
    
    async getMinAndMaxLength(gameModeName) {
        let maxLength = 0
        let minLength = 0

        if (gameModeName === 'Letras Aleatórias') {
            maxLength = 20
            minLength = 1
        }

        else if (gameModeName === 'Palavras Aleatórias') {
            const allWords = await words.getAllWords()
            maxLength = words.lengthOfWords(allWords, 'max')
            minLength = words.lengthOfWords(allWords, 'min')
        }

        else {
            const gameModeWords = await gameModes.getGameModeWords(gameModeName)
            maxLength = words.lengthOfWords(gameModeWords, 'max')
            minLength = words.lengthOfWords(gameModeWords, 'min')
        }
        
        return {
            maxLength,
            minLength
        }
    },
    
    addOption(lengthValue) {
        const option = `<option value="${lengthValue}">${lengthValue}</option>`
        elementsDOM.levelCreatorMaxLength.innerHTML += option
    },
    
    async changeSizeOfMaxLengthSelect() {
        const selectedIndex = elementsDOM.levelCreatorGameMode.selectedIndex
        const gameModeName = elementsDOM.levelCreatorGameMode[selectedIndex].value
        const { maxLength, minLength } = await levelCreator.getMinAndMaxLength(gameModeName)

        elementsDOM.levelCreatorMaxLength.innerHTML = ''
        for (let length = minLength; length <= maxLength; length++) levelCreator.addOption(length)

    },

    async addOptionsRandomWords() {
        const { maxLength, minLength } = await levelCreator.getMinAndMaxLength('Palavras Aleatórias')
        for (let length = minLength; length < maxLength; length++) this.addOption(length)
        
    },
}


const level = {
    levels: [],

    createdLevelsList: {
        add() {
            const levelName = levelCreator.getInputsData()[0]
            this.createItem(levelName)
            menu.addEventListenerToRemoveButtons()
        },
        
        createItem(levelName) {
            const li = myLibrary.createElement('li', null, elementsDOM.listCreatedLevels)
            
            const button = myLibrary.createElement('button', {
                type: 'button',
                class: 'menu-button btn-level-list',
                title: levelName
            }, li)
            
            const btnRemove = myLibrary.createElement('button', {
                type: 'button',
                class: 'btn-remove-level',
                title: 'Remover nível'
            }, li)
            btnRemove.textContent = 'X'

            button.innerHTML = levelName
            button.classList.add('animate-btn')
            
            button.addEventListener('click', (event) => {
                level.setGameLevelToSettings(event.target.textContent)
                menu.readyGameStarter()
            })
        }
    },

    setGameLevelToSettings(levelName) {
        const settingsValues = this.getLevel(levelName)
        settings = settingsValues
    },

    newLevel(levelName, seconds, miliseconds, maxWordsLength, gameMode) {
        return {
            levelName, seconds, miliseconds, maxWordsLength, gameMode
        }
    },
    
    getLevel(name) {
        return this.levels.find(level => String(level.levelName) === String(name))
    },

    showFeaturesOfLevel() {
        const setNameLevelToSpans = element => element.textContent = settings.levelName
        
        elementsDOM.levelSpan.forEach(setNameLevelToSpans)
        elementsDOM.totalTime.textContent = getFormatedTime(settings.seconds, settings.miliseconds)
        elementsDOM.maxLength.textContent = settings.maxWordsLength
        elementsDOM.showGameMode.textContent = settings.gameMode
    },
    
    setCustomLevelTolevels(levelFeatures) {
        level.levels.push(levelFeatures)
    },

    async callLocalStorageFunctions() {
        await this.setDefaultLevelsToLevels()
        this.levelsExistInLocalStorage()
        this.setLocalStorageToLevels()
        this.showMessageCreatedLevelsIsEmpty()

    },
    
    async setLevelsToMenuList() {
        await this.callLocalStorageFunctions()
        const levels = this.getLevelsFromLocalStorage()
        levels.forEach(level => this.createdLevelsList.createItem(level.levelName))
        menu.addEventListenerToRemoveButtons()
    },
    
    async setDefaultLevelsToLevels() {
        this.levels = [
            this.newLevel('Fácil', 6, 0, 4, 'Palavras Aleatórias'),
            this.newLevel('Médio', 5, 0, 7, 'Palavras Aleatórias'),
            this.newLevel('Difícil', 4, 0,
            words.lengthOfWords(await words.getAllWords(), 'max'), 'Palavras Aleatórias'),
            this.newLevel('Mestre', 5, 0, 8, 'Letras Aleatórias')
        ]
    },

    setLocalStorageToLevels() {
        this.levels.push(...this.getLevelsFromLocalStorage())
    },

    levelsExistInLocalStorage() {
        const exist = myLibrary.findStorageKey(item => item === 'levels')
        if (!exist) this.setLevelsToLocalStorage()
    },

    getLevelsFromLocalStorage() {
        const levels = localStorage.getItem('levels')
        return JSON.parse(levels)
    },
    
    setLevelsToLocalStorage() {
        const createdLevels = this.levels.slice(4, this.levels.length)
        const levelsJSON = JSON.stringify(createdLevels)
        localStorage.setItem('levels', levelsJSON)
    },
    
    showMessageCreatedLevelsIsEmpty() {
        const levels = this.getLevelsFromLocalStorage()
        levels.length === 0 ?
        myLibrary.show(elementsDOM.messageCreatedLevelIsEmpty) :
            myLibrary.hide(elementsDOM.messageCreatedLevelIsEmpty)
        },
        
    findClassIntoElementChilds(parent, className) {
        const childsArray = Array.from(parent.children)
        const elementFound = childsArray
            .find(element => element.classList.contains(className))
            return elementFound
    },
    
    removeCreatedLevel(event) {
        const li = event.target.parentNode
        
        level.removeLevelFromList(li)
        level.removeLevelFromLevel(li)
        level.removeLevelFromStorage()
        
    },
    
    removeLevelFromList(li) {
        const ul = li.parentNode
        myLibrary.addClass(li, 'removed')

        const liToRemove = this.findClassIntoElementChilds(ul, 'removed')
        ul.removeChild(liToRemove)
    },
    
    removeLevelFromStorage() {
        this.setLevelsToLocalStorage()
        this.showMessageCreatedLevelsIsEmpty()
    },

    removeLevelFromLevel(li) {
        const levelButton = this.findClassIntoElementChilds(li, 'menu-button')
        const levelToRemove = this.getLevel(levelButton.textContent)
        myLibrary.removeElementInArray(this.levels, levelToRemove)
    }
    
}


const shortcuts = {
    event(event) {
        const EnterIsPressed = event.key === 'Enter'
        const EscapeIsPressed = event.key === 'Escape'
        const spaceIsPressed = event.key === ' '
        
        if (EnterIsPressed) shortcuts.enterShortcutFunctions()
        if (EscapeIsPressed) shortcuts.escapeShortcutFunctions()
        if (spaceIsPressed) shortcuts.spaceShortcutFunctions()
    },
    
    enterShortcutFunctions() {
        if (typeWord.gameIsRunning()) typeWord.validateAnswer(elementsDOM.answerInput.value.trim())
        
        if (myLibrary.isOpen(elementsDOM.gameStarter)) {
            myLibrary.hide(elementsDOM.gameStarter)
            typeWord.startNewGame()
        }
    },
    
    escapeShortcutFunctions() {
        const arrayBtnsBack = Array.from(elementsDOM.btnsBackToMenu)
        const btnBackParentIsOpen = arrayBtnsBack
        .some(btn => myLibrary.isOpen(btn.parentNode.parentNode))

        if (btnBackParentIsOpen || myLibrary.isOpen(elementsDOM.gameOverArea)) {
            menu.open()
            timer.stop()
        }
    },
    
    spaceShortcutFunctions() {
        if (myLibrary.isOpen(elementsDOM.gameOverArea)) typeWord.startNewGame()
    }
}

function loadPage() {
    menu.addEventListenerToButtons()
    menu.addAnimationToButtons()
    menu.showTotalWords()
    
    typeWriter(elementsDOM.TypeWordsTitle, 200)
    words.fetchWords()
    gameModes.addToList()
    
    level.setLevelsToMenuList()
}


elementsDOM.btnCreateLevelPopup.addEventListener('click', levelCreator.open)
elementsDOM.btnCreateLevel.addEventListener('click', levelCreator.validate)
elementsDOM.levelCreatorGameMode.addEventListener('change', levelCreator.changeSizeOfMaxLengthSelect)

elementsDOM.btnsBackToMenu.forEach(btn => btn.addEventListener('click', menu.open))
elementsDOM.btnNewGame.addEventListener('click', typeWord.startNewGame)

document.addEventListener('timeChange', typeWord.endTime)
window.addEventListener('keyup', shortcuts.event)
window.addEventListener('load', loadPage)