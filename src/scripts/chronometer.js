

export function chronometer(element) {
    const defaltTime = '00:00'
    if (element) window.addEventListener('load', () => { element.innerHTML = defaltTime })

    let chronometer
    let timerEvent
    let miliSeconds = 0
    let seconds = 0

    const createTimeEvent = () => {
        timerEvent = new CustomEvent('timeChange', {
            detail: {
                sec: seconds,
                milisec: miliSeconds,
                endTime: seconds <= 0 && miliSeconds <= 0
            }
        })
    }

    const timer = () => {
        miliSeconds--
        timerIsReset()
        showTime()
        if (miliSeconds === 0 && seconds > 0) {
            miliSeconds = 99
            seconds--
        }
    }

    const startTimes = () => {
        if (miliSeconds > 0)
            miliSeconds--

        if (seconds > 0) {
            seconds--
            miliSeconds = 99
        }
    }


    const timerIsReset = () => {
        let alltimeIsZero = miliSeconds <= 0 && seconds <= 0
        if (alltimeIsZero) {
            stop()
        }
        createTimeEvent()
        document.dispatchEvent(timerEvent)
        return alltimeIsZero
    }

    const stop = () => {
        clearInterval(chronometer)
        miliSeconds = 0
        seconds = 0
    }

    const showTime = () => {
        element.innerText = getFormatedTime(seconds, miliSeconds)
    }

    const start = (secInput = 0, miliSecInput = 0) => {
        seconds = secInput
        miliSeconds = miliSecInput
        startTimes()

        if (!timerIsReset())
            chronometer = setInterval(timer, 10)
    }

    const resume = () => {
        this.pause()
        this.start(seconds, miliSeconds)
    }

    const pause = () => clearInterval(chronometer)

    return {
        start,
        stop,
        resume,
        pause,
    }
}

function concatenateZero(time) {
    return time < 10 ? `0${time}` : time
}

export function getFormatedTime(seconds, miliSeconds) {
    return `${concatenateZero(seconds)}:${concatenateZero(miliSeconds)}`
}


