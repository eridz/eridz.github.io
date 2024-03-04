function IoDRow(ev) {
	let inputNumberElement = ev.srcElement
		.closest('.setting')
		.querySelector('.input.rows input[type="number"]');

	let valueInput = parseInt(inputNumberElement.value);

	if (!isNaN((valueInput += 1)) && valueInput > 1) {
		const table = inputNumberElement
			.closest('.card-matrix')
			.querySelector('.matrix');
		const countRow = table.rows.length;
		const cellCount = table.rows[0].cells.length;

		if (valueInput > countRow) {
			addRow(countRow, valueInput, table, cellCount);
		} else if (valueInput < countRow) {
			removeRow(countRow, valueInput, table);
		}
	}

	function addRow(countRow, valueInput, table, cellCount) {
		for (let i = countRow; i < valueInput; i++) {
			let newCountRow = parseInt(table.rows.length);
			const newRow = table.insertRow();
			newRow.classList.add('rows-matrix');

			for (let j = 0; j < cellCount; j++) {
				const newCell = newRow.insertCell();

				j === 0
					? (newCell.innerText =
							parseInt(
								table.rows[newCountRow - 1].cells[0].innerText
							) + 1)
					: (newCell.innerHTML =
							'<input type="number" class="element-matrix" placeholder="0">');
			}
		}
	}

	function removeRow(countRow, valueInput, table) {
		for (let i = countRow; i > valueInput; i--) {
			table.deleteRow(i - 1);
		}
	}
}

function IoDColumn(ev) {
	let inputNumberElement = ev.srcElement
		.closest('.setting')
		.querySelector('.input.columns input[type="number"]');
	let valueInput = parseInt(inputNumberElement.value);

	if (!isNaN((valueInput += 1)) && valueInput > 1) {
		const table = inputNumberElement
			.closest('.card-matrix')
			.querySelector('.matrix');
		let countRow = table.rows.length;
		let countColumn = table.rows[0].cells.length;

		if (countColumn < valueInput) {
			addColumn(countColumn, valueInput, countRow, table);
		} else if (countColumn > valueInput) {
			removeColumn(table, valueInput, countColumn, countRow);
		}
	}

	function addColumn(countColumn, valueInput, countRow, table) {
		for (let i = countColumn; i < valueInput; i++) {
			for (let j = 0; j < countRow; j++) {
				const newCountColumn = table.rows[0].cells.length;
				const newColumnElement = table.rows[j].insertCell();

				j === 0
					? (newColumnElement.innerText =
							parseInt(
								table.rows[0].cells[newCountColumn - 1]
									.innerText
							) + 1)
					: (newColumnElement.innerHTML = `<input type="number" class="element-matrix" placeholder="0">`);
			}
		}
	}

	function removeColumn(table, valueInput, countColumn, countRow) {
		for (let i = countColumn; i > valueInput; i--) {
			for (let j = 0; j < countRow; j++) {
				table.rows[j].deleteCell(table.rows[0].cells.length - 1);
			}
		}
	}
}

function clearValueElementMatrix(table) {
	table.querySelectorAll('.element-matrix').forEach(em => {
		setTimeout(() => {
			em.value = '';
		}, 150);
	});
}

function insertRandom(table) {
	table.querySelectorAll('.element-matrix').forEach(em => {
		const min = -5;
		const max = 15;
		if (!em.value) {
			let random = Math.floor(Math.random() * (max - min + 1) + min);

			setTimeout(() => {
				em.value = random;
			}, 150);
		}
	});
}

function dragStart(ev, matrix, arrayMatrix) {
	const padlock = matrix.querySelector('.padlock');
	const table = matrix.querySelector('table.matrix');
	const isUnlocked = padlock.classList.remove('unlock');
	let name = matrix.getAttribute('id');

	unlock(matrix, isUnlocked);
	arrayMatrix = [name, []];

	for (let i = 1; i < table.rows.length; i++) {
		arrayMatrix[1].push([]);
		for (let j = 1; j < table.rows[0].cells.length; j++) {
			let valueElementMatrix = parseInt(
				table.rows[i].cells[j].querySelector('.element-matrix').value
			);

			if (!valueElementMatrix && valueElementMatrix != 0) {
				valueElementMatrix =
					table.rows[i].cells[j].querySelector(
						'.element-matrix'
					).value;
			}

			arrayMatrix[1][i - 1].push(valueElementMatrix);
		}
	}

	ev.dataTransfer.setData('text', JSON.stringify(arrayMatrix));
}
function dragOver(ev) {
	ev.preventDefault();
}
function dragEnter(ev) {
	ev.target.classList.add('highlight');
}
function dragLeave(ev) {
	ev.target.classList.remove('highlight');
}
function dragDrop(ev) {
	ev.preventDefault();
	const data = JSON.parse(ev.dataTransfer.getData('text'));
	ev.target.setAttribute('arrayMatrix', JSON.stringify(data[1]));
	ev.target.classList.add('draged');
	ev.target.classList.remove('highlight');
	ev.target.setAttribute('id', data[0]);
	if (window.innerWidth < mobileBreakPoint) {
		ev.target.innerText = data[0];
	} else {
		createTableUseArray(data[1], ev.target);
	}
}

function unlock(matrix, isUnlocked) {
	const table = matrix.querySelector('table.matrix');
	const inputNumberColumn = matrix.querySelector(
		'.input.columns input[type="number"]'
	);
	const decrementColumn = matrix.querySelector('.decrement.columns');
	const incrementColumn = matrix.querySelector('.increment.columns');
	const decrementRow = matrix.querySelector('.decrement.rows');
	const incrementRow = matrix.querySelector('.increment.rows');
	const inputNumberRow = matrix.querySelector(
		'.input.rows input[type="number"]'
	);
	const padlock = matrix.querySelector('.padlock');
	const randomButton = matrix.querySelector('.random');
	const clearButton = matrix.querySelector('.setting .clear');

	clearButton.disabled = !isUnlocked;
	randomButton.disabled = !isUnlocked;
	decrementRow.disabled = !isUnlocked;
	incrementColumn.disabled = !isUnlocked;
	incrementRow.disabled = !isUnlocked;
	decrementColumn.disabled = !isUnlocked;
	inputNumberColumn.readOnly = !isUnlocked;
	inputNumberRow.readOnly = !isUnlocked;
	table.querySelectorAll('.element-matrix').forEach(em => {
		em.readOnly = !isUnlocked;
	});
}

function validToAddMatrix(event) {
	const prompt = event.srcElement.closest('.prompt');
	const info = prompt.querySelector('.information');
	const elementInputName = prompt.querySelector('input[type="text"]');
	const nameMatrix = elementInputName.value;

	if (nameMatrix && !nameMatrix.includes(' ')) {
		info.classList.remove('already');
		info.classList.add('ready');
		info.innerText = 'Matrix Name Available';
		if (event.type != 'input') {
			prompt.outerHTML = '';
			addMatrix(nameMatrix);
		}
	} else if (nameMatrix.includes(' ')) {
		info.classList.remove('ready');
		info.classList.add('already');
		info.innerText = 'The name of Matrix should not contain a spaces';
	} else if (!nameMatrix) {
		info.classList.remove('ready');
		info.classList.add('already');
		info.innerText = 'The name of Matrix should not be empty';
	} else {
		info.classList.remove('already');
		info.classList.add('ready');
		info.innerText = 'Matrix Name Available';
	}
}

function explanation() {
	let operation = [];
	const operator = document.querySelector('.operator');
	const operans = document.querySelectorAll('.operan');

	operans.forEach(operan => {
		operation.push(JSON.parse(operan.getAttribute('arrayMatrix')));
	});

	if (
		operation[0].length === operation[1].length &&
		operation[0][0].length === operation[1][0].length &&
		(operator.innerText === '+' || operator.innerText === '-')
	) {
		let resultOperation = [];
		let step_1 = [];
		if (operator.innerText === '+') {
			for (let i = 0; i < operation[0].length; i++) {
				resultOperation.push([]);
				step_1.push([]);
				for (let j = 0; j < operation[0][i].length; j++) {
					if (operation[1][i][j] < 0) {
						step_1[i].push(
							`${operation[0][i][j]} + (${operation[1][i][j]})`
						);
					} else {
						step_1[i].push(
							`${operation[0][i][j]} + ${operation[1][i][j]}`
						);
					}

					let valueMatrix = operation[0][i][j] + operation[1][i][j];
					resultOperation[i].push(valueMatrix);
				}
			}
		} else if (operator.innerText === '-') {
			for (let i = 0; i < operation[0].length; i++) {
				resultOperation.push([]);
				step_1.push([]);
				for (let j = 0; j < operation[0][i].length; j++) {
					if (operation[1][i][j] < 0) {
						step_1[i].push(
							`${operation[0][i][j]} - (${operation[1][i][j]})`
						);
					} else {
						step_1[i].push(
							`${operation[0][i][j]} - ${operation[1][i][j]}`
						);
					}

					let valueMatrix = operation[0][i][j] - operation[1][i][j];

					if (!valueMatrix && valueMatrix != 0) {
						valueMatrix = `${operation[0][i][j]}${operation[1][i][j]}`;
					}
					resultOperation[i].push(valueMatrix);
				}
			}
		}

		createTableUseArray(
			step_1,
			document.querySelector('section.result-matrix .step-1')
		);

		createTableUseArray(
			resultOperation,
			document.querySelector('section.result-matrix .card')
		);
	} else if (
		operation[0][0].length === operation[1].length &&
		operator.innerText === '×'
	) {
		let step_1 = [];
		let resultOperation = [];
		for (let i = 0; i < operation[0].length; i++) {
			step_1.push([]);
			resultOperation.push([]);
			for (let h = 0; h < operation[1][0].length; h++) {
				let countValue = 0;
				let timesValue = 0;
				let tableElement = document.createElement('table');
				for (let j = 0; j < operation[1].length; j++) {
					timesValue = operation[0][i][j] * operation[1][j][h];
					if (!timesValue && timesValue != 0) {
						timesValue = `${operation[0][i][j]}\n${operation[1][j][h]}`;
					}
					let rowElement = tableElement.insertRow();
					rowElement.innerHTML = `<td>${operation[0][i][j]}</td><td>×</td><td>${operation[1][j][h]}</td><td> = </td><td>${timesValue}</td>`;

					countValue += timesValue;
				}
				step_1[i].push(tableElement);
				resultOperation[i].push(countValue);
			}
		}

		createTableUseArray(
			step_1,
			document.querySelector('section.result-matrix .step-1')
		);

		createTableUseArray(
			resultOperation,
			document.querySelector('section.result-matrix .card')
		);
	} else {
		alert('ordo tidak sama !');
	}
}
