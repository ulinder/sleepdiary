moment.locale('sv');

function delete_post(id, target_element_id, redirect = false){
  var target_element = document.getElementById(target_element_id);
  var xhr1 = new XMLHttpRequest();
  xhr1.open('DELETE', "/posts/"+ id, true);
  xhr1.onreadystatechange = function() {
      if (this.status == 200 && this.readyState == 4) {
          console.log(target_element);
          if(target_element) target_element.className = target_element.className + "collapse";
          if(redirect) window.location = "/"; 
      }
  };//end onreadystate
  xhr1.send();
}

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
