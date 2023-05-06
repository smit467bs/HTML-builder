const {stdin, stdout} = process;
const fs = require('fs');
const path = require('path');


fs.writeFile(path.join(__dirname, 'text.txt'), '', err => {
	if (err) throw err;
})

stdout.write('Введите текст: \n');
stdin.on('data', data => {
	const dataStringed = data.toString().trim();
	if (dataStringed === 'exit') exit();

	fs.appendFile(path.join(__dirname, 'text.txt'), data, err => {
		if (err) throw err;
	});
})

function exit() {
	stdout.write('Процесс завершён, текс сохранён в файл text.txt')
	process.exit()
}

process.on("SIGINT", exit);


