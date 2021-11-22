const express = require('express')
const app = express()
const fs = require('fs')
const multer = require('multer')
const mongoose = require('mongoose')
const File = require('./schema/fileModel.js')

const connectDB = async () => {
	try {
		await mongoose.connect('mongodb://localhost:27017/file', {
			useNewUrlParser: true
		})
		console.log('Database connected...')
	} catch (err) {
		if (err) {
			console.log(err)
			process.exit(1)
		}
	}
}

connectDB()

const port = 8000
const responsedelay = 50 // miliseconds

// static folders
app.use(express.static('public'))
app.use(express.static('userfiles'))
app.use(express.static('view'))

// home page
app.get('/', function (req, res) {
	res.sendFile('index.html')
})

// upload handler
var uploadStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, `./userfiles/${req.query.type}`)
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	}
})

var upload = multer({ storage: uploadStorage })

app.post('/', upload.single('file'), async function (req, res) {
	try {
		const newFile = new File(req.file)
		await newFile.save()
		res.json(true)
	} catch (error) {
		res.send(false)
	}
})

// file list
app.post('/files-list', async (req, res) => {
	let folder = req.query.folder
	let contents = ''

	let readingdirectory = `./userfiles/${folder}`

	const files = await File.find({ destination: readingdirectory })

	files.map(el => {
		let filesize = ConvertSize(el.size)
		contents +=
			'<tr><td><a href="/' + folder + '/' + encodeURI(el.originalname) + '">' + el.originalname + '</a></td><td>' + filesize + '</td><td>/' + folder + '/' + el.originalname + '</td><td</tr>' + '\n'
	})

	res.send(contents)
})

app.post('/image-list', async (req, res) => {
	let folder = req.query.folder
	var contents = ''

	let readingdirectory = `./userfiles/${folder}`

	const files = await File.find({ destination: readingdirectory })

	files.map(el => {
		let filesize = ConvertSize(el.size)
		contents +=
			'<div class="details"><div class="image"><img src="/' +folder + "/" +
			encodeURI(el.originalname) +
			'" alt="' +
			el.originalname +
			'"></div><p><a href="/' + folder + '/' + encodeURI(el.originalname) + '">' + el.originalname + '</a></p><p>' +
			filesize +
			'</p><p>' +
			el.destination +
			'/' +
			el.originalname +
			'</p></div>' +
			'\n'
	})

	res.send(contents)
})

app.get('/search', async(req, res) => {
  const files = await File.find({originalname: new RegExp("^" + req.query.value, "i")})
  let contents = ''
  files.map(el => {
    let folder = el.destination.slice(12)
		let filesize = ConvertSize(el.size)
		contents +=
			'<tr><td><a href="/' + folder + '/' + encodeURI(el.originalname) + '">' + el.originalname + '</a></td><td>' + filesize + '</td><td>/' + folder + '/' + el.originalname + '</td><td</tr>' + '\n'
	})
  res.send(contents)
})

function ConvertSize(number) {
	if (number <= 1024) {
		return `${number} Byte`
	} else if (number > 1024 && number <= 1048576) {
		return (number / 1024).toPrecision(3) + ' KB'
	} else if (number > 1048576 && number <= 1073741824) {
		return (number / 1048576).toPrecision(3) + ' MB'
	} else if (number > 1073741824 && number <= 1099511627776) {
		return (number / 1073741824).toPrecision(3) + ' GB'
	}
}

app.listen(port, function () {
	console.log(`Server is started on port: ${port}`)
})
