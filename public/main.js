function Delete(name){
  if (window.confirm('Do you confirm?')) {
    fetch('/quotes', {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name
      })
    })
    .then(res => {
      if (res.ok) return res.json()
    })
    .then(data => {
      window.location.reload()
    })
  }
}


function Edit(name,quote){
  $( document ).ready(function() {
    $('#UpdateModal').modal('show');
    $('#Updatename').val(name);
    $('#Updatequote').val(quote);
  });
}
