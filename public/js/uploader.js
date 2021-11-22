function uploadToServer(form) {
	let formData = new FormData(form)

	axios
		.post(form.action, formData, true,{ headers: { "Content-Type": "multipart/form-data" }},)
		.then(response => {
      if(response.data){
        alert('File uploaded successfully')
      } else{
        alert('There was an error')
      }
    })
		.catch(err => alert('There was an error'))
}
