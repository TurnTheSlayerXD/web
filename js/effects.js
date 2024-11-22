function addSelectedTaskEvent() {
    const elems = document.getElementsByClassName('task_input')
    addLightningEffect('selected_input')
    removeEnterPressDefaultBehaviour(elems)
    for (const e of elems) {
        e.addEventListener('mouseenter', (event) => {
            const eventBut = event.target
            getCrossAxisElems(eventBut).forEach(t => t.classList.add('selected_cross'))
        })
        e.addEventListener('mouseleave', (event) => {
            const eventBut = event.target
            getCrossAxisElems(eventBut).forEach(t => t.classList.remove('selected_cross'))
        })
    }

}





function addLightningEffect(cssClass) {
    const elems =
        [...document.getElementsByClassName('task_input')].concat([...document.getElementsByClassName('time_input')])
    for (const e of elems) {
        e.addEventListener('mouseenter', (event) => {
            const eventBut = event.currentTarget
            eventBut.classList.add(cssClass)
        })
        e.addEventListener('mouseleave', (event) => {
            const eventBut = event.currentTarget
            eventBut.classList.remove(cssClass)
        })
    }
}

function removeEnterPressDefaultBehaviour() {

    const elems = [...document.getElementsByClassName('task_input')]
        .concat([...document.getElementsByClassName('time_input')])

    for (const e of elems) {
        e.addEventListener('keypress', (event) => {
                if (event.key === "Enter") {
                    event.preventDefault()
                }
            }
        )
    }
}


