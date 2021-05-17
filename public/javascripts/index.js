$(document).ready( function(){

  $('.clockpicker').clockpicker();

});

function times(count, callbackOrScalar) {
    let type = typeof callbackOrScalar
    let sum
    if (type === 'number') sum = 0
    else if (type === 'string') sum = ''

    for (let j = 0; j < count; j++) {
        if (type === 'function') {
            const callback = callbackOrScalar
            const result = callback(j, count)
            if (typeof result === 'number' || typeof result === 'string')
                sum = sum === undefined ? result : sum + result
        }
        else if (type === 'number' || type === 'string') {
            const scalar = callbackOrScalar
            sum = sum === undefined ? scalar : sum + scalar
        }
    }
    return sum
}