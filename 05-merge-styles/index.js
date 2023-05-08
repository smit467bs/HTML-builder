const fs = require('fs');
const path = require('path');

const srcMerge = path.join(__dirname, 'styles');
const srcBundle = path.join(__dirname, 'project-dist', 'bundle.css');
let arrayMerge = [];


fs.readdir(srcMerge, {withFileTypes: true}, (err, files) => {
	if (err) throw err;
	else {
		files.forEach(file => {
			const srcFile = path.join(__dirname, 'styles', file.name.toString());
			if (path.extname(srcFile) === '.css') {
				fs.readFile(srcFile, 'utf-8', (err, readingFile) => {
					if (err) throw err;
					else {
						arrayMerge.push(readingFile);
					}
					fs.access(path.join(__dirname, 'project-dist', 'bundle.css'), err => {
						if (err) {
							fs.writeFile(srcBundle, `${[...arrayMerge]}`, err => {
								if (err) throw err;
							})
						} else {
							fs.truncate(srcBundle, err => {
								fs.appendFile(srcBundle, `${[...arrayMerge]}`, err => {
									if (err) throw err;
								});
							});
						}
					})
				});
			}
		})
	}
})

