const fs = require('fs');
const path = require('path');
const srcCopy = path.join(__dirname, 'files');
const srcCopied = path.join(__dirname, 'files-copy');

function createFolderCopy() {
	fs.mkdir(srcCopied, {recursive: true}, err => {
		if (err) throw err;

		console.log('Папка создана!');
	})
}
function copyFiles() {
	fs.readdir(srcCopy,
		{withFileTypes: true},
		(err, files) => {
			if (err) throw err;
			files.forEach(file => {
				fs.copyFile(path.join(srcCopy, `${file.name}`),
					path.join(srcCopied, `${file.name}`),
					err => {
						if (err) throw err;
						console.log(`${file.name} Скопирован`);
					});
			})
		})

}


fs.access(srcCopied, err => {
	if (err) {
		createFolderCopy()
		copyFiles();

	} else {
		fs.rm(srcCopied, {recursive: true}, err => {
			if (err) throw err;
			createFolderCopy()
			copyFiles();
		})
	}
})


