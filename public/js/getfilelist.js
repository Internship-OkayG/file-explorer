const table = '<table class="fileproperties">\
        <tr>\
            <th>Name</th>\
            <th>Size</th>\
            <th>Address</th>\
            <th>Permissions</th>\
        </tr>'


function getListOfFiles(filestype, fileholderid) {
	const fileholder = document.getElementById(fileholderid)
	let requestedfileslist = ''

	switch (filestype) {
		case 'image':
			requestedfileslist = 'image-list'
			break
		default:
			requestedfileslist = 'files-list'
			break
	}

	if (requestedfileslist != '') {
		axios
			.post(`/${requestedfileslist}?folder=${filestype}`, true)
			.then(res => {
        if (filestype == 'image') {
          fileholder.innerHTML = res.data
        } else {
          fileholder.innerHTML = table + res.data + '</table>'
        }

			})
			.catch(err => console.log(err))
	}
}

function openTab(evt, tabid) {
	var i, tabcontent, tablinks
	tabcontent = document.getElementsByClassName('tabcontent')

	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = 'none'
	}

	tablinks = document.getElementsByClassName('tablinks')

	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(' active', '')
	}

	document.getElementById(tabid).style.display = 'block'
	evt.currentTarget.className += ' active'
}

function search(value, id) {
  const fileholder = document.getElementById(id)
  axios.get(`/search?value=${value}`)
    .then(res => {
      fileholder.innerHTML = table + res.data + '</table>'
      // console.log(res.data);
    })
    .catch(err => {
      console.log(err)
    })
}