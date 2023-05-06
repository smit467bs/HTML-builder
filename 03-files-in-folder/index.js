const fs = require('fs');
const path = require('path');
const {stat} = require("fs");
const src = path.join(__dirname, 'secret-folder');

fs.readdir(src,
	{withFileTypes: true},
	(err, files) => {
		if (err) throw err;
		files.forEach(file => {
			const srcFile = path.join(__dirname, 'secret-folder', file.name.toString());
			fs.stat(srcFile, (err, stats) => {
				if (stats.isFile()) console.log(` ${path.parse(srcFile).name} - ${path.extname(srcFile)} - ${stats.size} байтов`);
			})
		})
	});

