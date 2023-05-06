const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'styles');
const srcBundle = path.join(__dirname, 'project-dist', 'bundle.css');
let array = [];


fs.readdir(src, {withFileTypes: true}, (err, files) => {
	if (err) throw err;
	else {
		files.forEach(file => {
			const srcFile = path.join(__dirname, 'styles', file.name.toString());
			if (path.extname(srcFile) === '.css') {
				fs.readFile(srcFile, 'utf-8', (err, readingFile) => {
					if (err) throw err;
					else {
						array.push(readingFile);
					}
					fs.access(path.join(__dirname, 'project-dist', 'bundle.css'), err => {
						if (err) {
							fs.writeFile(srcBundle, `${[...array]}`, err => {
								if (err) throw err;
							})
						} else {
							fs.truncate(srcBundle, err => {
								fs.appendFile(srcBundle, `${[...array]}`, err => {
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

