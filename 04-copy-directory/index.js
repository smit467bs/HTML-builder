const fs = require('fs');
const path = require('path');
const src = path.join(__dirname, 'files');
const srcCopy = path.join(__dirname, 'files-copy');

function createFolder() {
	fs.mkdir(srcCopy, {recursive: true}, err => {
		if (err) throw err;

		console.log('Папка создана!');
	})
}

function copyFiles() {
	fs.readdir(src,
		{withFileTypes: true},
		(err, files) => {
			if (err) throw err;
			files.forEach(file => {
				fs.copyFile(path.join(src, `${file.name}`),
					path.join(srcCopy, `${file.name}`),
					err => {
						if (err) throw err;
						console.log(`${file.name} Скопирован`);
					});
			})
		})

}


fs.access(srcCopy, err => {
	if (err) {
		createFolder()
		copyFiles();

	} else {
		fs.rm(srcCopy, {recursive: true}, err => {
			if (err) throw err;
			createFolder()
			copyFiles();
		})
	}
})


