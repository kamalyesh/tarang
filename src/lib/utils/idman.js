var { getNextId } = (function () {
    var id_counter = 0
    function getNextId() {
        if (id_counter < 0) return "id_0"
        else return `id_${++id_counter}`
    }
    return { getNextId }
}())

export const idman = { next: getNextId }