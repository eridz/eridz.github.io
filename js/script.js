document.addEventListener('DOMContentLoaded', function () {
	const addMatrixButton = document.querySelector('.add-matrix');
	const themeToggle = document.getElementById('theme-toggle');
	const sectionInputMatrix = document.querySelector('section.input-matrix');
	const matrixWrapper = document.querySelector('.matrix-wraper');
	const style = document.body.classList;
	const operans = document.querySelectorAll('section.operation .operan');
	const resultBtn = document.querySelector('button.result');
	const operationSection = document.querySelector('section.operation');
	const operator = document.querySelector('.operator');

	addMatrix('example_matrix');
	addMatrix('second_matrix');

	// alert(sectionInputMatrix.clientWidth);

	// sectionInputMatrix.addEventListener("resize", () => {
	//     alert(sectionInputMatrix.clientWidth);
	// });

	if (localStorage.getItem('lightTheme') === 'true') {
		style.add('light');
		themeToggle.querySelector('.moon').classList.add('show');
		themeToggle.querySelector('.sun').classList.remove('show');
		themeToggle.querySelector('p').innerText = 'to dark mode';
	}

	operans.forEach(operan => {
		operan.addEventListener('drop', dragDrop);
		operan.addEventListener('dragleave', dragLeave);
		operan.addEventListener('dragenter', dragEnter);
		operan.addEventListener('dragover', dragOver);
	});

	themeToggle.addEventListener('click', () => {
		style.toggle('light');
		themeToggle.querySelector('.moon').classList.toggle('show');
		themeToggle.querySelector('.sun').classList.toggle('show');

		style.contains('light') === true
			? (themeToggle.querySelector('p').innerText = 'to dark mode')
			: (themeToggle.querySelector('p').innerText = 'to light mode');

		localStorage.setItem('lightTheme', style.contains('light'));
	});

	addMatrixButton.addEventListener('click', () => {
		promptNameMatrix(operans);
	});

	operator.addEventListener('click', ev => {
		const listOperator = document.createElement('div');
		const container = document.querySelector('.container-operator');
		listOperator.classList.add('operation');
		listOperator.classList.add('select-operator');

		listOperator.innerHTML = `<div class="operator">×</div><div class="operator">+</div><div class="operator">-</div>`;

		container.appendChild(listOperator);
		// document.body.style.overflow = "hidden";

		listOperator.querySelectorAll('.operator').forEach(oper => {
			oper.addEventListener('click', () => {
				operator.innerText = oper.innerText;
				listOperator.outerHTML = '';
			});
		});
	});

	resultBtn.addEventListener('click', explanation);
});

const mobileBreakPoint = 576;

function selectOperator() {
	const operator = document.querySelector('.operator');
}

function promptNameMatrix() {
	const prompt = document.createElement('div');
	prompt.classList.add('prompt');
	const promptElement = `<h4 class="title">Enter the name of the matrix</h4><input type="text" maxlength="15" placeholder="example 'a' or 'wp'" /><p class="information"></p><button class="ok">ok</button><button class="cancel">cancel</button>`;
	prompt.innerHTML = promptElement;
	document.body.appendChild(prompt);

	const info = prompt.querySelector('.information');
	const ok = prompt.querySelector('.ok');
	const cancel = prompt.querySelector('.cancel');
	const nameMatrix = prompt.querySelector('input[type="text"]');

	nameMatrix.addEventListener('input', validToAddMatrix);

	ok.addEventListener('click', validToAddMatrix);

	cancel.addEventListener('click', () => (prompt.outerHTML = ''));

	nameMatrix.addEventListener('keyup', ev => {
		if (ev.key === 'Enter') {
			validToAddMatrix(ev);
		}
	});
}

function createTableUseArray(arrayMatrix, location) {
	const table = document.createElement('table');
	table.classList.add('matrix');

	for (let i = 0; i < arrayMatrix.length + 1; i++) {
		const newRow = table.insertRow();
		for (let j = 0; j < arrayMatrix[0].length + 1; j++) {
			const newCell = newRow.insertCell();
			if (i === 0 && j === 0) {
				newRow.classList.add('count-column');
				newCell.innerText = '•';
			} else if (i === 0 && j != 0) {
				newRow.classList.add('count-column');
				newCell.innerText = j;
			} else if (j === 0 && i != 0) {
				newCell.innerText = i;
			} else {
				newRow.classList.add('rows-matrix');
				newCell.classList.add('element-matrix');
				if (typeof arrayMatrix[i - 1][j - 1] === 'object') {
					newCell.appendChild(arrayMatrix[i - 1][j - 1]);
				} else {
					newCell.innerText = arrayMatrix[i - 1][j - 1];
				}
			}
		}
	}

	location.innerHTML = '';
	location.appendChild(table);
}

function addMatrix(nameMatrix) {
	const matrixWrapper = document.querySelector('.matrix-wraper');
	const newMatrixCard = document.createElement('div');
	newMatrixCard.setAttribute('id', nameMatrix);
	newMatrixCard.draggable = true;

	const childCardMatrix = `<div class="caption"><h3 class="name-matrix">${nameMatrix}</h3><button class="padlock unlock"><svg viewBox="0 378 720 720"><path class="half-round" d="M197.34038,769.5473L197.34038,769.5473C198.26624,713.81036,197.4314,674.955,196.80867,645.986L196.80867,645.986C196.44559,629.0953,196.13713,614.95374,196.33725,602.90607L196.33725,602.906C196.9865,563.8213,203.42233,544.10297,224.88173,508.93054L224.88173,508.93054C248.3996,470.38422,305.26648,435.53177,356.3244,436.89423L356.3244,436.89423C393.49033,437.886,449.92828,445.02365,493.81314,506.9357L493.81314,506.9357C523.4387,548.73096,522.9731,577.8127,522.7714,626.1312L522.7714,626.13116C522.71106,640.596,522.64355,657.1144,523.21497,677.07117C523.64996,692.26337,511.68686,704.93164,496.4947,705.36664C481.30252,705.80164,468.6342,693.83856,468.19922,678.64636L468.19922,678.64636C467.59955,657.70233,467.67316,640.3792,467.73358,625.90155L467.73358,625.9015C467.93176,578.4195,467.6427,565.1899,448.91098,538.7635L448.91098,538.7635C419.70703,497.56305,384.7645,492.711,354.85626,491.9129L354.85626,491.9129C324.98584,491.1158,285.91382,514.571,271.8656,537.5963L271.8656,537.5963C254.85167,565.48254,251.83452,575.7323,251.36795,603.8202L251.36795,603.8201C251.18909,614.5876,251.46324,627.544,251.83424,644.80316L251.83424,644.80316C252.4611,673.96466,253.3147,713.65576,252.37108,770.4615C252.11865,785.6578,239.59497,797.77216,224.39867,797.5197C209.20236,797.2673,197.08795,784.7436,197.34038,769.5473 Z"/><path class="place-key" d="M361.07614,803.2347Q373.69867,803.2347,384.84195,809.70416Q401.47055,819.358,407.2217,839.0158L408.47354,845.44806Q410.51913,865.3486,398.8921,880.69073Q394.71094,886.1653,389.405,890.08856L389.40887,890.08856L389.43457,928.3871C389.44522,944.24817,376.59586,957.1148,360.73474,957.1254L360.7151,957.1254C344.863,957.1254,332.00705,944.2802,331.9964,928.42566L331.97067,890.09534L331.974,890.09534Q331.6527,889.85925,331.33337,889.61725Q326.4065,885.85034,322.54776,880.8902L319.02634,875.67267Q315.8071,870.1773,314.07733,863.7336Q309.32492,843.8108,318.97888,827.1822Q328.63287,810.5537,348.29056,804.80237Q354.86258,803.2347,361.07614,803.2347 Z M553.00745,687.8704Q166.83649,687.8714,166.83649,687.8714C150.82297,687.8715,137.84146,700.8531,137.8414,716.8665L137.84091,880.1805L137.84042,1043.4944C137.8404,1059.508,150.82193,1072.4897,166.83551,1072.4897L166.83575,1072.4897Q263.37888,1072.4893,359.92203,1072.4893Q456.46518,1072.4893,553.0083,1072.4897C560.69836,1072.4897,568.0735,1069.4348,573.5111,1063.9973C578.94885,1058.5596,582.00366,1051.1846,582.00366,1043.4944L582.0027,716.86554C582.00256,700.8521,569.0211,687.8704,553.00757,687.8704 Z" /></svg></button></div><table class="matrix"><tr class="count-column"><td>•</td><td>1</td><td>2</td><td>3</td><td>4</td></tr><tr class="rows-matrix"><td>1</td><td><input type="text" class="element-matrix" placeholder="0"/></td><td><input type="text" class="element-matrix" placeholder="0"/></td><td><input type="text" class="element-matrix" placeholder="0"/></td><td><input type="text" class="element-matrix" placeholder="0"/></td></tr><tr class="rows-matrix"><td>2</td><td><input type="text" class="element-matrix" placeholder="0"/></td><td><input type="text" class="element-matrix" placeholder="0"/></td><td><input type="text" class="element-matrix" placeholder="0"/></td><td><input type="text" class="element-matrix" placeholder="0"/></td></tr><tr class="rows-matrix"><td>3</td><td><input type="text" class="element-matrix" placeholder="0"/></td><td><input type="text" class="element-matrix" placeholder="0"/></td><td><input type="text" class="element-matrix" placeholder="0"/></td><td><input type="text" class="element-matrix" placeholder="0"/></td></tr><tr class="rows-matrix"><td>4</td><td><input type="text" class="element-matrix" placeholder="0"/></td><td><input type="text" class="element-matrix" placeholder="0"/></td><td><input type="text"class="element-matrix" placeholder="0"/></td><td><input type="text" class="element-matrix" placeholder="0"/></td></tr></table><div class="setting"><div class="input rows"><h5>rows :</h5><input type="number" value="4" placeholder="0"><button class="increment rows">+</button><button class="decrement rows">-</button></div><div class="input columns"><h5>columns :</h5><input type="number" value="4" placeholder="0"><button class="increment columns">+</button><button class="decrement columns">-</button></div><button class="random">random</button><button class="clear">clear</button></div>`;

	newMatrixCard.classList.add('card-matrix');
	newMatrixCard.innerHTML = childCardMatrix;
	matrixWrapper.appendChild(newMatrixCard);

	const table = newMatrixCard.querySelector('table.matrix');
	const inpNumColumn = newMatrixCard.querySelector(
		'.input.columns input[type="number"]'
	);
	const inpNumberRow = newMatrixCard.querySelector(
		'.input.rows input[type="number"]'
	);
	let arrayMatrix = [];

	newMatrixCard.addEventListener('dragstart', ev =>
		dragStart(ev, newMatrixCard, arrayMatrix)
	);

	newMatrixCard.querySelector('.padlock').addEventListener('click', ev => {
		const isUnlocked = ev.srcElement
			.closest('.caption')
			.querySelector('.padlock')
			.classList.toggle('unlock');
		unlock(newMatrixCard, isUnlocked);
	});

	newMatrixCard
		.querySelector('.decrement.columns')
		.addEventListener('click', ev => {
			if (inpNumColumn.value > 1) {
				--inpNumColumn.value;
				IoDColumn(ev);
			}
		});

	newMatrixCard
		.querySelector('.increment.columns')
		.addEventListener('click', ev => {
			++inpNumColumn.value;
			IoDColumn(ev);
		});

	inpNumColumn.addEventListener('input', IoDColumn);

	newMatrixCard
		.querySelector('.decrement.rows')
		.addEventListener('click', ev => {
			if (inpNumberRow.value > 1) {
				--inpNumberRow.value;
				IoDRow(ev);
			}
		});

	newMatrixCard
		.querySelector('.increment.rows')
		.addEventListener('click', ev => {
			++inpNumberRow.value;
			IoDRow(ev);
		});

	inpNumberRow.addEventListener('input', IoDRow);

	newMatrixCard
		.querySelector('.random')
		.addEventListener('click', () => insertRandom(table));

	newMatrixCard
		.querySelector('.setting .clear')
		.addEventListener('click', () => clearValueElementMatrix(table));
}
