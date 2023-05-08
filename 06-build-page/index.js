const fs = require('fs');
const path = require('path');

srcTemplate = path.join(__dirname, 'template.html');
srcProject = path.join(__dirname, 'project-dist');
srcIndex = path.join(__dirname, 'project-dist', 'index.html');
srcComponents = path.join(__dirname, 'components');
srcAssets = path.join(__dirname, 'assets');

let arrayTemplate = [];
let strTemplate, replacingTemplate;

fs.access(srcProject, err => {
	if (err) {
		createFolder()
	} else {
		fs.rm(srcProject, {recursive: true}, err => {
			if (err) throw err;
			createFolder()
			// writeTemplate();
		})
	}
})

fs.readFile(srcTemplate, (err, data) => {
	if (err) throw err;
	else {
		strTemplate = data.toString();
		let re = /{{(.*?)}}/g;
		replacingTemplate = strTemplate.match(re); // отсортированный массив со скобками;
		for (let i = 0; i < replacingTemplate.length; i++) {
			arrayTemplate.push(replacingTemplate[i].split(re)[1]);
			replaceTemplate(arrayTemplate[i], i);
			// if (i === replacingTemplate.length - 1) {
			// 	writeTemplate();
			// }
		}
		// createFolder
	}
})


function createFolder() {
	fs.mkdir(srcProject, {recursive: true}, err => {
		if (err) throw err;
		console.log('Папка создана! PROJECT DIST');
		mergeStyles();
		fs.readdir(srcAssets, {withFileTypes: true}, (err, files) => {
			if (err) throw err;
			else {
				files.forEach(file => {
					console.log(file.name);
					goCopyAllFiles(file.name.trim());
				})
			}
		})

	})
	fs.writeFile(path.join(srcProject, 'index.html'), `${strTemplate}`, err => {
		if (err) throw err;
	});
	fs.mkdir(path.join(srcProject, 'assets'), {recursive: true}, err => {
		if (err) throw err;
		console.log('Папка создана! Assets');
	})
}

function writeTemplate() {
	fs.writeFile(path.join(srcProject, 'index.html'), `${strTemplate}`, err => {
		if (err) throw err;
	});
}

function replaceTemplate(file, i) {
	fs.readFile(path.join(srcComponents, `${file}.html`), (err, data) => {
		let str = data.toString();
		strTemplate = strTemplate.replace(`${replacingTemplate[i]}`, str);
		writeTemplate();
	})
}

/// MERGES STYLES

function mergeStyles() {
	const srcMerge = path.join(__dirname, 'styles');
	const srcBundle = path.join(__dirname, 'project-dist', 'style.css');
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
}

// read Folder before copy


/// SRC COPY
function goCopyAllFiles(nameFolder) {
	const srcCopy = path.join(srcAssets, `${nameFolder}`);
	const srcCopied = path.join(srcProject, 'assets', `${nameFolder}`);

	function createFolderCopy() {
		fs.mkdir(srcCopied, {recursive: true}, err => {
			if (err) throw err;

			console.log(`Папка создана! ${nameFolder}`);
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
}
