$(document).ready( ()=>{

  $('.clockpicker').clockpicker();

  const user_id = document.cookie
  .split('; ')
  .find(row => row.startsWith('user='))
  .split('=')[1];

  $('.delete-me').on('click', (el)=>{ // add after table render
    var target_id = el.currentTarget.value;
    if(target_id){
      if(confirm('Är du säker att du vill radera denna dag?')) {
        delete_post(target_id, `row-for-${target_id}` );
      }
    } else {
      console.error(`No id for delete: ${target_id}`)
    } 
  });
   

});

