<!DOCTYPE html>
<html>
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title><?=$title?></title> <!-- Возьмем тайтл из индекса -->
</head>
<body>
	<?php
		chdir("contents"); // Переезжаем в директорию с контентом (Чтоб потом путаницы небыло)
		require_once "static.php"; // И импортируем статичную основу
	?>
	<script src=".core./engine.js"></script> <!-- Подрубим наш JS движок -->
</body>
</html>