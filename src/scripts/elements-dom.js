const elementsDOM = {
    body: document.querySelector('body'),
    /* MENU ELEMENTS */
    menuContainer: getElementDOM('.container-game-menu'),
    totalWordsSpan: getElementDOM('.total-words'),

    messageCreatedLevelIsEmpty: getElementDOM('.createdLevels-empty'),

    TypeWordsTitle: getElementDOM('h1'),
    answerInput: getElementDOM('#input_word'),
    word: getElementDOM('.word'),

    gameOverArea: getElementDOM('.game-over'),
    gameOverMessage: getElementDOM('.game-over-message'),
    btnNewGame: getElementDOM('#btn_new_game'),
    gameOverPoints: getElementDOM('.point-span'),
    gameOverExpectedAnswer: getElementDOM('.expected-answer'),
    gameOverTypeError: getElementDOM('.type-error'),
    TimeIsEndMessage: getElementDOM('.timeIsEnd-message'),

    contentLength: getElementDOM('#content_length'),

    timerSpan: getElementDOM('#timer'),
    pointsSpan: getElementDOM('#points'),
    levelSpan: getElementDOM('.level', 'all'),

    gameStarter: getElementDOM('.game-start-container'),
    gameContainer: getElementDOM('.game-container'),
    btnCreateLevelPopup: getElementDOM("#btn_popup_creator"),
    popupLevelCreator: getElementDOM('.level-creator'),
    menuButtons: Array.from(getElementDOM('.menu-button', 'all')),
    btnsBackToMenu: getElementDOM('.btn-backToMenu', 'all'),

    totalTime: getElementDOM('.total-time'),
    maxLength: getElementDOM('.max-length'),
    showGameMode: getElementDOM('.game-mode'),
    pressEnterMessage: getElementDOM('.press-enter-message'),

    /* LEVEL CREATOR ELEMENTS */
    levelCreatorInputs: getElementDOM('.level-creator-input','all'), //getElementDOM('.level-creator-content').getElementsByTagName('input'),
    levelCreatorGameMode: getElementDOM('#game-mode-select'),
    levelCreatorMaxLength: getElementDOM('#max_length_select'),
    btnCreateLevel: getElementDOM('#btn_create'),

    /* CREATE AREA ELEMENTS */

    listCreatedLevels: getElementDOM('.custom'),
    //btnRemoveLevel: this.getElementDOM('.btn-remove-level'),
    setElementDOM(elementName, identifier, selectionMode = 'single') {
        elementsDOM[elementName] = getElementDOM(identifier, selectionMode)
    },

    
}

function getElementDOM(identifier, selectionMode = 'single') {
    if (selectionMode === 'all') return document.querySelectorAll(identifier)
    if (selectionMode === 'single') return document.querySelector(identifier)
}

export default elementsDOM