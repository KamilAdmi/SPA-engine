// Сердце фреймворка, его движок плавных переходов

main = document.querySelector("main"); // Получили главный тег, нашу "Базу"

// Если у базы position по умолчанию, меняем, чтоб все работало. Мало ли, может юзер захочет абсолют поставить, поэтому только если не задано
if(getComputedStyle(main).position == "static") main.style.position = "relative";

main.style.overflow = "hidden"; // Скроем лишнее вылазящее содержимое базы

box = document.createElement("section"); // Создаем активный контейнер
[main.innerHTML, box.innerHTML] = ["", main.innerHTML]; // Перенесем содержимое базы в контейнер
box.style = "height:100%;width:100%;position:absolute;" // Задаём главные стили контейнера

main.appendChild(box); // Закидываем контейнер в пустую базу


// Главная функция переходов
async function transform(name, startNewStyles, endOldStyles, duration = 0.8) { // Принимает название файла с контентом, стили для подготовки элементов и время преобразования
	let newBox = document.createElement("section"); // Создаём новый котейнер
	// Сложнейшая крокозябра вместо простого изменения innerHTML... А все для того, чтобы вставляемый js работал
	newBox.appendChild(document.createRange().createContextualFragment(await fetch(`contents/${name}.php`).then(resp => resp.text())));
	newBox.style = "height:100%;width:100%;position:absolute;" // Задаём главные стили
	box.before(newBox); // Вставим его до старого

	for(let style in startNewStyles) { // И применим  к нему стили подготовки
		newBox.style[style] = startNewStyles[style];
	}
	
	newBox.style.transition = `${duration}s`; // И новому и старому зададим время перехода
	box.style.transition = `${duration}s`;

	newBox.offsetHeight; // Хак из прошлой версии))) Чтобы браузер остановился и призадумался. Без этого transition не применится.

	for(let style in endOldStyles) { // Зададим стили ухода старого контейнера
		box.style[style] = endOldStyles[style];
	}

	for(let style in startNewStyles) { // Новому же всё удалим, чтобы он тихонько нормализовался
		newBox.style.removeProperty(style);
	}

	newBox.addEventListener("transitionend", () => { // После завершения анимации...
		newBox.style.removeProperty("transition"); // Новому удаляем transition
		box.remove(); // Старый совсем удаляем
		box = newBox; // Передаём жезл новому
	}, {once: true});
}

// [Готовые анимации переходов]
// Замена
function replace(name, duration) {
	this.transform(name, {opacity: 0}, {opacity: 0}, duration);
}

// Уезжаем вверх
function moveUp(name, duration) {
	this.transform(name, {translate: "0% 100%"}, {translate: "0% -100%"}, duration);
}

// Уезжаем вниз
function moveDown(name, duration) {
	this.transform(name, {translate: "0% -100%"}, {translate: "0% 100%"}, duration);
}

// Уезжаем вправо
function moveRight(name, duration) {
	this.transform(name, {translate: "-100% 0%"}, {translate: "100% 0%"}, duration);
}

// Уезжаем влево
function moveLeft(name, duration) {
	this.transform(name, {translate: "100% 0%"}, {translate: "-100% 0%"}, duration);
}

// [Функция отправки данных обработчикам]
async function sendData(name, data) { // Получаем название обработчика и словарь данных
	let formData = new FormData(); // Создаем объек multipart-запроса
	for(let key in data) { // Закидываем в него все данные
		formData.append(key, data[key]);
	}

	return await fetch(`handlers/${name}.php`, { // И делаем запрос, дожидаясь ответа...
	   method: "POST", // В формате POST
	   body: formData
	}).then(resp => resp.json()); // Возвращаем в формате json
}