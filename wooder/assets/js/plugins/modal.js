function _createModal(options) {
    let modal = document.createElement('div')
    modal.classList.add('rmodal')
    modal.insertAdjacentHTML("afterbegin", `
    <div class="modal__overlay">
        <div class="modal__window">
            <div class="modal__header">
                <h1>Modal</h1>
                <div class="modal__close">&times;</div>
            </div>
            <div class="modal__body">
                Это шикарное модальное окно
            </div>
            <div class="modal__footer">
                А здесь кнопочка закрыть
                <button>Закрыть</button>
            </div>
        </div>
    </div>
    `)
    document.body.appendChild(modal)
    return modal
}

$.modal = function (options) {
    const ANIMATION_SPEED = 2000
    const $modal = _createModal(options)

    return ({
        open() {
            $modal.classList.add('open')
        },
        close() {
            $modal.classList.remove('open')
            $modal.classList.add('hide')
            setTimeout(() => {
                $modal.classList.remove('hide')
            }, ANIMATION_SPEED)
        }

    })
}