// The game Dark forest v.001
$(document).ready(function(){
	var height = $( window) .height();
	$("#hide").css('height', height);
	var bg = new Audio(); // play background music
	if (bg.canPlayType("audio/wav")){
		bg.src = "audio/background.wav";
		bg.play();
	}
	var press = new Audio();
		if (press.canPlayType("audio/wav")){
			press.src = "audio/spacepress.wav";
			press.volume = 0.1;
		}
	$(document).keydown(function(eventObject){ // on press space start new game
		if (eventObject.which == 32){
			$("#content *").fadeOut(500);
			setTimeout(function(){
				$("#content").empty();  // clear main content
			}, 500);
			press.play(); // audio effect
			bg.pause();
			$("#content").css("backgroundImage", "url(images/clear.png)");
			setTimeout('printNotification("You woke up in the woods with a terrible pain in the head. Trying to recall something failed.")', 1700);
			setTimeout('startNewGame("What is your name?:")', 4500); // print intro and start game
		}
	})

})


// Vars in the game world
var weathersArray = ["snow", "cloudy", "sunny", "rain", "heat"];
var defaultBearHealth = 400; // current enemies propertyes
var defaultBearStreight = 20;
var defaultWolfHealth = 320;
var defaultWolfStreight = 15;
var defaultBoarHealth = 300;
var defaultBoarStreight = 13;
var defaultElkHealth = 350;
var defaultElkStreight = 11;

var _imgPath = "images/";
// functions block

// ********************** visualization **********************
function startNewGame(text){
	if (arguments[0] !== undefined){
		var prev = showInputBlock("get-text", text);
		var inputBlock = $("#content .get-text .ok");
 				inputBlock.click(function(){
					//var playerName = window.prompt("What is your name?");
					//document.write( playerName+ " But you remembered that you know how to ...<br />");
					//var playerClass = window.prompt("Are you warrior or archer?");
					playerName = $("#content .get-text input").val();
					console.log(playerName);
					hideInputBlock(prev);
					showInputBlock("get-text", "Are you warrior or archer?: ");
					$("#content .get-text .ok").click(function(){
						var playerClass = $("#content .get-text input").val();
						console.log(playerClass);
						hideInputBlock("get-text");
						if (playerClass == "warrior" || playerClass == "archer"){
						var player = new CreatePlayer(playerName, playerClass);
						player.getPlayerSkills();
						}
						else{
							alert("Enter \"Warrior\" or \"Archer\"! ");
							location.reload();
						}
						console.log(player);
						mainGameLoop(player);
					})

 			})
	}
}
function showInputBlock(block, text){
	block += Math.round(Math.random() * 100); // every element is unical
	$("#content").append("<div class='get-text " + block +"'><p>" + text + "</p><input type='text'><div class='ok'>ok</div></div>" ); // create new
 		setInterval(function(){
 				$("#content ." + block).css("opacity", "1");
 			}, 100);
 			printNotification();
 			$("#content ." + block + " input").focus();
 			return block;
}

function hideInputBlock(block){
	$("#content ." + block).fadeOut(100);  // empty arguments hide this block;
	$("#content ."+ block).remove();


}
function printNotification(text){ // function print notification
	if (arguments[0] !== undefined){
		$("#content .notify").remove();
			$("#content").append("<div class='notify'><p>" + text + "</p><div class='ok'>ok</div></div>"); // create new
 			setInterval(function(){
 				$("#content .notify").css("opacity", "1");
 			}, 100);
	}
	else $("#content .notify").fadeOut(100);  // empty arguments hide this block;
}
// ********************** end visualization **********************

function getRandomInt(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function GameArea(available, safety, food, materials, medicaments, enemies){ // world constructor
	this.available = available;
	this.safety = safety;
	this.food = food;
	this.materials = materials;
	this.medicaments = medicaments;
	this.enemies = enemies;
}
GameArea.prototype = { // prototype
	temperature: 0,
	weather: "",
	setTemperature: function(){
		if (arguments.length > 0) this.temperature = arguments[0];
		else {
			var randomTemp = Math.random(); // choose game temperature
			if (randomTemp <= 0.25) {
				this.temperature = getRandomInt(-10, 0);
			}
			else if (randomTemp <= 0.50){
				this.temperature = getRandomInt(0, 10);
			}
			else if (randomTemp <= 0.75){
				this.temperature = getRandomInt(10, 20);
			}
			else this.temperature = getRandomInt(20, 30);
			}
		},
	setWeather: function(){  // weather set depending on the temperature
		if (arguments.length > 0 && arguments.length <= 1 ) this.weather = arguments[0];
		else {
			var randWeather = Math.random();
			if (this.temperature <= 0){
				if (randWeather <= 0.50) this.weather = weathersArray[0];
				else if (randWeather <= 0.80) this.weather = weathersArray[1];
				else this.weather = weathersArray[2];
			}
			else if (this.temperature <= 10){
				if (randWeather <= 0.65) this.weather = weathersArray[3];
				else if (randWeather <= 0.75) this.weather = weathersArray[0];
				else if (randWeather <= 0.85) this.weather = weathersArray[1];
				else this.weather = weathersArray[2];
			}
			else if(this.temperature <= 20){
				if (randWeather <= 0.50) this.weather = weathersArray[3];
				else if (randWeather <= 0.75) this.weather = weathersArray[1];
				else this.weather = weathersArray[2];
			}
			else {
				if (randWeather <= 0.65) this.weather = weathersArray[4];
				else this.weather = weathersArray[2];
			}
		}
	},

};

// characters
function CreatePlayer(name, playerClass){ // player constructor function
	this.name = name;
	this.level = 1;
	this.streight = 0;
	this.health = 0;
	this.weapon = "none";
	this.maxHealth = 0;
	this.playerClass = playerClass;
	this.inventory = ["leather x2", "rock x2", "leather x2", "wood x3", "wood x3"];
	this.getPlayerWeapon = function(){
		if (this.weapon == "ax"){
			this.streight += 4;
		}
		else if (this.weapon == "bow"){
			this.streight += 3;
		}
	}
	this.getPlayerSkills = function(){
		if (this.playerClass == "archer"){
			this.streight = 7 ;
			this.health = 200;
			this.maxHealth = 200;
		}
		else if (this.playerClass == "warrior") {
			this.streight = 12;
			this.health = 250;
			this.maxHealth = 250;
		}
	}
	this.getNewLevel = function(){
		this.level++;
		this.streight++;
		this.maxHealth += 20;
	}
}
function CreateEnemy(name, enemyClass, player){ // enemies constructor
	this.name = name;
	this.enemyClass = enemyClass;
	this.health = 0;
	this.inventory = [];
	this.streight = 0;
	this.getEnemyProp = function(){
		switch(enemyClass){
			case "bear":
				this.image = "url(images/bear.png)";
				this.health = Math.round((player.level/1.5) * defaultBearHealth);
				this.maxHealth = Math.round((player.level/1.5) * defaultBearHealth);
				this.streight = (player.level/2.5) * defaultBearStreight;
				this.inventory = ['lather','meat'];
			break;
			case "wolf":
				this.image = "url(images/boar.png)";
				this.health = Math.round((player.level/1.5) * defaultWolfHealth);
				this.maxHealth = Math.round((player.level/1.5) * defaultWolfHealth);
				this.streight = (player.level/2.5) * defaultWolfStreight;
				this.inventory = ['lather','meat'];
			break;
			case "wild boar":
				this.image = "url(images/boar.png)";
				this.health = Math.round((player.level/1.5) * defaultBoarHealth);
				this.maxHealth = Math.round((player.level/1.5) * defaultBoarHealth);
				this.streight = (player.level/2.5) * defaultBoarStreight;
				this.inventory = ['lather','meat'];
			break;
			case "elk":
				this.image = "url(images/elk.png)";
				this.health = Math.round((player.level/1.5) * defaultElkHealth);
				this.maxHealth = Math.round((player.level/1.5) * defaultElkHealth);
				this.streight = (player.level/2.5) * defaultElkStreight;
				this.inventory = ['lather','meat'];
			break;
			default:
				throw ("Incorrect entered value enemyClass!");
			break;
		}
	};
}
		//set game areas
	var forest = new GameArea(true, false, ["berries", "potato"], ["bushwood", "wood"], ["medical berries", "herb"], ["elk",
		"wild boar", "wolf"]);
	var river = new GameArea(true, false, ["fish", "water"], ["rock"], [], ["wolf", "bear", "wild boar"]);
	var swamp = new GameArea(true, false, ["rise", "water"], ["bushwood", "wood"], ["medical berries", "herb"], ["elk"]);
	var cave = new GameArea(false, false, [], [], [], [], []);
	var shelter = new GameArea(false, true, ["water", "potato", "meat"], ["leather"], ["medical berries"], []);
	var hovel = new GameArea(false, true, [], [], [], [], []);





function mainGameLoop(player){
	$("#content div").remove() ;
	$("#content").css("backgroundImage", "url(images/mainBackground.png)");
	printNotification("You need to find some food and find accommodation...");
	$("#content .notify .ok").click(function(){
			choosePath(player);
			printNotification();
			showPlayerStats(player) ;
			$("#content .forest").click(function() {
				$("#content #choise").css("opacity", 0);
				setTimeout(function(){
					$("#content #choise").remove();

				}, 500);
				weatherInit(forest, player);
				getWeatherEffects(forest, player);
				$("#content").css("background-image", "url(images/forestBg.png)");
				chooseAreaAction("forest");
					$(".forestActions .hunt").click(function(){
						var randChance = Math.random();
						if ( randChance <= 1){
							var randEnemyIndex = getRandomInt(0, forest.enemies.length - 1);
							var randEnemy = forest.enemies[randEnemyIndex];
							var enemy = new CreateEnemy(randEnemy, randEnemy, player);
							enemy.getEnemyProp();
							showEnemyStats(enemy);
							battleInterface(enemy, player);
							$("#content .choiseAttack").click(function(){
								if (player.health > 0 ) {
									attack(enemy, player);
								}
								isDead(player, enemy);
							})

						}
						else {
							document.write("<br />Hunting failed! You can not find any animal.");
							mainGameLoop(player);
						}
					})

						// case "look for food":
						// 	searchFood(forest, player);
						// 	mainGameLoop(player);
						// break;
						// case "search healing herbs":
						// 	searchHerbs(forest, player);
						// 	mainGameLoop(player);
						// break;
						// case "search materials":
						// 	searchMaterials(forest, player);
						// 	mainGameLoop(player);
						// break;
					 });

			switch(chosenPath){

				case "river":
					weatherInit(river, player);
					getWeatherEffects(river, player);
					var areaAction = chooseAreaAction();
					switch (areaAction){
						case "hunt":
							var randChance = Math.random();
							if ( randChance <= 0.75){
								var randEnemyIndex = getRandomInt(0, river.enemies.length - 1);
								var randEnemy = river.enemies[randEnemyIndex];
								switch(randEnemy){
									case "wolf":
										var riverWolf = new CreateEnemy("river wolf", "wolf", player);
										riverWolf.getEnemyProp();
										showEnemyStats(riverWolf);
										battle(riverWolf, player, true);
									break;
									case "bear":
										var riverBear = new CreateEnemy("river bear", "bear", player);
										riverBear.getEnemyProp();
										showEnemyStats(riverBear);
										battle(riverBear, player, true);
									break;
									case "wild boar":
										var riverBoar = new CreateEnemy("river boar", "wild boar", player);
										riverBoar.getEnemyProp();
										showEnemyStats(riverBoar);
										battle(riverBoar, player, true);
									break;
								}
							}
							else {
								document.write("<br />Hunting failed! You can not find any animal.");
								mainGameLoop(player)
							}
						break;
						case "look for food":
							searchFood(river, player);
							mainGameLoop(player);
						break;
						case "search healing herbs":
							searchHerbs(river, player);
							mainGameLoop(player);
						break;
						case "search materials":
							searchMaterials(river, player);
							mainGameLoop(player);
						break;
					 }
				break;
				case "swamp":
					weatherInit(swamp, player);
					getWeatherEffects(swamp, player);
					var areaAction = chooseAreaAction();
					switch (areaAction){
						case "hunt":
							var randChance = Math.random();
							if ( randChance <= 0.75){
								var randEnemyIndex = getRandomInt(0, swamp.enemies.length - 1);
								var randEnemy = swamp.enemies[randEnemyIndex];
								switch(randEnemy){
									case "elk":
										var swampElk = new CreateEnemy("swamp elk", "elk", player);
										swampElk.getEnemyProp();
										showEnemyStats(swampElk);
										battle(swampElk, player);
									break;
								}
							}
							else {
								document.write("<br />Hunting failed! You can not find any animal.");
								mainGameLoop(player);
							}
						break;
						case "look for food":
							searchFood(swamp, player);
							mainGameLoop(player);
						break;
						case "search healing herbs":
							searchHerbs(swamp, player);
							mainGameLoop(player);
						break;
						case "search materials":
							searchMaterials(swamp, player);
							mainGameLoop(player);
						break;
					 }
				break;
				case "cave":

				break;
				case "shelter":

				break;
				case "build a hovel":
					var qtOfWood = searchInventoryElem("wood", player);
					var qtOfleather = searchInventoryElem("leather", player);
					console.log(qtOfWood, qtOfleather);
					if (qtOfleather >= 4 && qtOfWood >= 6){
						hovel.available = true;
						alert("You've built a hovel!");
						mainGameLoop(player);
					}
					else {
						alert("You need 4 leather and 6 wood to build a hovel!");
						mainGameLoop(player);
					}
				break;
				case "hovel":
					weatherInit(hovel, player);
					var choise = choseHovelActions(player);
					switch(choise){
						case "sleep":
							if (hovel.temperature <= 0 && hovel.safety !== true){
								player.health -= 20;
								alert("It was very cold night. Your health has decreased...")
								if (player.health <= 0) {
									alert("You dead!");
									startNewGame();
								}
							}
							else {
								player.health = player.maxHealth;  // set health to maxhealth
								alert ("You slept very well. Health fully restored!");
							}
							hovel.safety = false;
							mainGameLoop(player);
						break;
						case "eat":
							var eatResult = deleteInvenotryElem("meat", player);
							if (eatResult !== 0){
								player.health += 30;
								if (player.health > player.maxHealth) player.health = player.maxHealth;
								alert("Your health has been increaced!");
								showPlayerStats(player);
							}
							else {
								alert("You have not enought meat...");
							}
							console.log(player);
							mainGameLoop(player);
						break;
						case "heal":
							var healResult = deleteInvenotryElem("medical berries", player);
							if (healResult == 0){
								var herbResult = deleteInvenotryElem("herb", player);
								if (herbResult !== 0){
									player.health += 40;
									if (player.health > player.maxHealth) player.health = player.maxHealth;
								}
								else alert("You have nothing to be threated...")
							}
							else {
								player.health += 40;
								if (player.health > player.maxHealth) player.health = player.maxHealth;
							}
						break;
						case "create weapon":
							var createWeapon = choiseWeaponToCreate(player);
							if (player.playerClass == "warrior" && createWeapon == "Y"){
								var qtOfRocks = searchInventoryElem("rock", player);
								var qtOfWood = searchInventoryElem("wood", player)
								if (qtOfWood >= 2 && qtOfRocks >= 2){
									//for (var i = 0; i < 2; i++){
										deleteInvenotryElem("rock", player, 2);
										deleteInvenotryElem("wood", player);
									//}
									player.weapon = "ax";
									player.getPlayerWeapon();
									alert("You made the ax! Your streight increaced!");
									console.log(player);
									mainGameLoop(player);
								}
								else {
									alert("You have not enought materials! To create the ax you need: rock x2 and wood x2.");
									mainGameLoop(player);
								}

							}
							else if (player.playerClass == "archer" && createWeapon == "Y"){
								var qtOfWood = searchInventoryElem("wood", player);
								var qtOfleather = searchInventoryElem("leather", player);
								if (qtOfWood >= 3 && qtOfleather >= 4){
									var i = 0;
									var j = 0;
									deleteInvenotryElem("wood", player, 3);
									deleteInvenotryElem("leather", player, 4);
									player.weapon = "bow";
									player.getPlayerWeapon();
									alert("You made the bow! Your streight increaced!");
									console.log(player);
									mainGameLoop(player);
								}
								else {
									alert("You have not enought materials! To create the bow you need: wood x3 and leather x4. ");
									mainGameLoop(player);
								}
							}
						break;
						case "exit":
							mainGameLoop(player);
						break;
					}
				break;
				}
			})
};

function choiseWeaponToCreate(player){
	var result;
	if (player.playerClass == "warrior"){
		result = window.prompt("You can create the ax. Try to create? (Y/N) ");
	}
	else result = window.prompt("You can create the bow. Try to create? (Y/N)");
	return result;
}

function deleteInvenotryElem(element, player){ // 3rd argument of this function is qt of deleted element
	var result = 0;
	var re = new RegExp(element, "g");
	for (var i = 0; i < player.inventory.length; i++){
		if (player.inventory[i].toString().search(re) !== -1){ // find element and check number
			var lastElem = player.inventory[i];
			var qtOfElements = +lastElem[lastElem.length-1];
			qtOfElements--; // dec last element and save
			if (qtOfElements == 0 ){ // if qtOf element is 0 delete element from array
				player.inventory.splice([i], 1);
			}
			else{
				qtOfElements.toString();  // if QtOfElement greater than 0 replace number
				var str = player.inventory[i].slice(0, -1);
				var repl = str + qtOfElements;
				player.inventory[i] = repl;
				result++ ;
				break;
			}
		}
	}
	var qt = arguments[2];
	if (qt !== undefined && qt > 1){ // recursion
		qt--;
		deleteInvenotryElem(element, player, qt);
	}
	return result;
}

function choseHovelActions(player){
	var result = window.prompt("You can sleep, eat, heal, create weapon or exit. What are you going to do?");
	return result;
}

function searchInventoryElem(element, player){ // returns qt of searched elements
	var result = 0;
	var re = new RegExp(element, "g");
	for (var i = 0; i < player.inventory.length; i++){
			if (player.inventory[i].toString().search(re) !== -1){
				var lastElem = player.inventory[i].toString();
				result += +lastElem[lastElem.length-1];
			}
		}
	return result;
	}

function weatherInit(area, player){
	area.setTemperature(); // set weather in zone
	area.setWeather();
	$("content .weather").remove();
	$("#content .playerInfo").append("<div class='weather'><div class='" + area.weather + "'></div><br /><div class='info'><span class='t0'>" +
		area.temperature + "°C</span><br /><span class='title'>" + area.weather + "</span></div></div>");
	$("#content .weather").css("opacity", 1);
	$("#content .playerInfo").css("top", "40%");
	setInterval(function(){
		$("#content .playerInfo").css("top", "60%");
	}, 2000);
}

function searchMaterials(area, player){ // searching for materials
	var meetEnemy = Math.random(); // random enemy
	if (meetEnemy <= 0.1){
		var randEnemy = getRandomInt(0, area.enemies.length -1)
		var enemy = new CreateEnemy(area.enemies[randEnemy], area.enemies[randEnemy], player );
		enemy.getEnemyProp();
		showEnemyStats(enemy);
		battle(enemy, player);
	}
	var randFood = Math.random();
	if (randFood <= 0.4){
		var randStuff = getRandomInt(0, area.materials.length - 1);
		player.inventory += area.materials[randStuff];
		alert("You find some materials! Maybe now you can build a hovel...");
		showPlayerStats(player);
	}
	else{
			alert("You find nothing...");
	}
}
function searchHerbs(area, player){ // searching for healing herbs
	var meetEnemy = Math.random(); // random enemy
	if (meetEnemy <= 0.1){
		var randEnemy = getRandomInt(0, area.enemies.length -1)
		var enemy = new CreateEnemy(area.enemies[randEnemy], area.enemies[randEnemy], player );
		enemy.getEnemyProp();
		showEnemyStats(enemy);
		battle(enemy, player);
	}
	var randFood = Math.random();
	if (randFood <= 0.4){
		var randStuff = getRandomInt(0, area.medicaments.length - 1);
		player.inventory += area.medicaments[randStuff];
		alert("You find some healing herbs! You need go to the safe place to use it");
		showPlayerStats(player);
	}
	else{
			alert("You find nothing...");
	}
}

function searchFood(area, player){ // searching food
	var meetEnemy = Math.random(); // random enemy
	if (meetEnemy <= 0.1){
		var randEnemy = getRandomInt(0, area.enemies.length -1)
		var enemy = new CreateEnemy(area.enemies[randEnemy], area.enemies[randEnemy], player );
		enemy.getEnemyProp();
		showEnemyStats(enemy);
		battle(enemy, player);
	}
	var randFood = Math.random();
	if (randFood <= 0.4){
		var randStuff = getRandomInt(0, area.food.length - 1);
		player.inventory += area.food[randStuff];
		alert("You find some food! You need go to the safe place to eat");
		showPlayerStats(player);
	}
	else{
			alert("You find nothing...");
	}
}
function getWeatherEffects(area, player){
	var demage = false;
	var damagePercents;
	if (area.temperature <= 0 && area.weather == "snow"){
		player.health -= 20;
		if (character.health > 0) {
			$(".playerInfo .text-health").empty();
			$(".playerInfo .text-health").append(player.health + " HP");
		}
		else {
			$(".playerInfo .text-health").empty();
			$(".playerInfo .text-health").append("0 HP");
		}
		damagePercents = Math.round(((player.health / player.maxHealth) * 100), 2);
		$("#content .playerInfo").css("top", "40%");
		$("#content .health").css("width", damagePercents + "%");
		setInterval(function(){
			$("#content .playerInfo").css("top", "60%");
		}, 2000);
		demage = true;
		return demage;
	}
	else if (area.temperature >= 20 && area.weather == "heat"){
		player.health -= 20;
		damagePercents = Math.round(((player.health / player.maxHealth) * 100), 2);
		$("#content .playerInfo").css("top", "40%");
		$("#content .health").css("width", damagePercents + "%");
		setInterval(function(){
			$("#content .playerInfo").css("top", "60%");
		}, 2000);
		demage = true;
		return demage;
	}
	if (player.health <= 0) {
		alert("You dead!");
		startNewGame();
	}
}
function showPlayerStats(player){
	var healthPercents = Math.round(((player.health / player.maxHealth) * 100), 2);
	$("#content").append("<div class='playerInfo'><div class='playerPicture'></div><div class='stats'>" +
		"<span class='name'>" + player.name + "</span><br />" + "<span class='playerClass'>" + player.playerClass + " " +
		 player.level + "<span> level</span></span>" +
		"<div class='health'></div></div><p class='text-health'>" + player.health +" HP</p><span class='streight'> Streight: " +
		player.streight + "</span><br /><span class='weapon'> Weapon: "
		+ player.weapon +"</span></div></div>");
	$(".health").css("width", healthPercents + "%");
	if (player.inventory.length > 0){
		for (var i = 0; i < player.inventory.length; i++){
			//document.write(player.inventory[i]);
		}
	setTimeout(function(){
		$("#content .playerInfo").css("opacity", "1");
	}, 500);
	setTimeout(function(){
		$(".playerInfo").css("top", '60%');
		$(".playerInfo").addClass("playerInfoScale");
	}, 2000)

	}
}

function showEnemyStats(enemy){
	$("#content").append("<div class='enemyInfo'><div class='enemyPicture'></div><div class='stats'><span class='name'>" + enemy.name +
		"</span><br /><div class='health' ></div></div><p class='text-health'>" + enemy.health + " HP</p><span class='streight'>Streight: " + enemy.streight
		+ " points</span> <div class='backface'>DEFEATED!<div class='winnedInventory'></div></div></div>") ;
	$(".enemyInfo .enemyPicture").css("background-image", enemy.image);
	$(".enemyInfo").css("opacity", 1);
	setTimeout(function(){
		$(".enemyInfo").css("left", "10%");
	}, 2000);
}

function choosePath(){ // choose path from the start point
	if (cave.available == true){
		document.write("You can see the forest, river, swamp and the cave. Where are you going to go?");
		var choise = window.prompt("Forest, river, swamp or cave?");
		return choise;
	}
	else if (shelter.available == true){
		document.write("You can see the forest, river, swamp and the shelter. Where are you going to go?");
		var choise = window.prompt("Forest, river, swamp or shelter?");
		return choise;
	}
	else if (hovel.available == true){
		document.write("You can see the forest, river, swamp and the hovel. Where are you going to go?");
		var choise = window.prompt("Forest, river, swamp or hovel?");
		return choise;
	}
	else{
		$("#content").append("<div id='choise'> <div class='forest'></div><div class='river'></div><div class='swamp'></div><div class='buildHovel'></div></div>");
		var height = $(window).height();
		$("#choise .forest, #choise .river, #choise .swamp, #choise .buildHovel, #choise").css("height", height);
		setTimeout(function(){
			$("#content #choise").css("opacity", 1);
		}, 2700);
		}
}
function chooseAreaAction(area){
	$("#content .areaAction").remove();
	$("#content").append("<div class='areaAction'></div>");
	switch(area){
		case "forest":
			$("#content .areaAction").addClass("forestActions");
			$("#content .areaAction").css("background-image", "url(images/forestMain.png)");
			$("#content .forestActions").append("<div class='hunt'></div><div class='healingHerbs'></div><div class='lookForFood'></div><div class='searchMaterials'></div>");
		break;
		case "river":
		break;
		case "swamp":
		break;
		case "buildHovel":
		break;
	}
}
function battleInterface(enemy, player, iteration){ // if iteration == true its a first call. If false else
		$("#content .areaAction").css("opacity", 0);
		setTimeout(function(){
			$("#content .areaAction").remove();
		}, 500);
		$(".playerInfo").css("opacity", 0);
		setTimeout(function(){
			$(".playerInfo").addClass("inBattle");
			$(".playerInfo").css("opacity", 1);
			$(".playerInfo").removeClass("playerInfoScale");
		}, 2000);
			$("#content").append("<div class='choiseAttack'><div class='attack'></div><div class='run'></div></div>")
			$(".choiseAttack").css("opacity", 1);}

function attack(enemy, player){
	//*************** attack block ****************//

	 	var chanceToHit;
	 	var chanceToEnemyHit;
	 	var randToEnemyHit = Math.random();
	 	var randToHit = Math.random();
	 	var hitPoints = player.streight * getRandomInt(5,7);
	 	var enemyHitPoints = enemy.streight * getRandomInt(4, 6);

	 	if (player.playerClass == "warrior"){
	 		chanceToHit = 0.5;
	 		chanceToEnemyHit = 0.5;
	 	}
	 	else if (player.playerClass == "archer"){
	 		chanceToHit = 0.70;
	 		chanceToEnemyHit = 0.55;
	 	}
	 	if (randToHit <= chanceToHit){
	 		enemy.health -= hitPoints;
	 		console.log(enemy.health);
	 		showDamage("enemy", enemy, hitPoints);
	 		//showEnemyStats(enemy);
	 	}
	 	 else {
	 	 	console.log("You missed!" + "<br />");
	 	 	showDamage("enemy", enemy, "You missed!");
	 	 }
	 	if (randToEnemyHit <= chanceToEnemyHit){
	 		player.health -= enemyHitPoints;
	 		console.log(player.health);
	 		showDamage("player", player, enemyHitPoints);
	 		return ;
	 	}
	 	else {
	 		console.log("Enemy missed!" + "<br />");
	 	 	showDamage("player", player, "Enemy missed!");
	 		return;
	 	}
}
function showDamage(charType, character, hitPoints) { // controll flow for "missed" or not missed
	var convertResult;
	tryConvert = isNaN(hitPoints)
	if (!tryConvert) {
		var healthPercents = Math.round((character.health / character.maxHealth ) * 100, 2);
		hitPoints = Math.round(hitPoints, 2);
	}
	else if (tryConvert) {
		convertResult = hitPoints;
	}
	if (charType == "player") {
		if (convertResult === undefined ) {
			$(".playerInfo .health").css("width", healthPercents + "%");
			if (character.health > 0) {
				$(".playerInfo .text-health").empty();
				$(".playerInfo .text-health").append(character.health + " HP");
			}
			else {
				$(".playerInfo .text-health").empty();
				$(".playerInfo .text-health").append("0 HP");
			}
			$(".playerInfo .hitPoints").remove();
			$(".playerInfo .playerPicture").append("<div class='hitPoints'><p> -" + hitPoints + "hp</p></div>");
			setTimeout( function(){
				$(".playerInfo .hitPoints").remove();
			}, 1000);
		}
		else if (convertResult !== undefined) {
			$(".playerInfo .hitPoints").remove();
			$(".playerInfo .playerPicture").append("<div class='hitPoints'><p> " + hitPoints + "</p></div>");
			setTimeout( function(){
				$(".playerInfo .hitPoints").remove();
			}, 1000);
		}

	}
	else if (charType == "enemy") {
		if (convertResult === undefined ) {
			$(".enemyInfo .health").css("width", healthPercents + "%");
			if (character.health > 0) {
				$(".enemyInfo .text-health").empty();
				$(".enemyInfo .text-health").append(character.health + " HP");
			}
			else {
				$(".enemyInfo .text-health").empty();
				$(".enemyInfo .text-health").append("0 HP");
			}
			$(".enemyInfo .hitPoints").remove();
			$(".enemyInfo .enemyPicture").append("<div class='hitPoints'><p> -" + hitPoints + "hp</p></div>");
			setTimeout( function(){
				$(".enemyInfo .hitPoints").remove();
			}, 1000);
		}
		else if (convertResult !== undefined) {
			$(".enemyInfo .hitPoints").remove();
			$(".enemyInfo .enemyPicture").append("<div class='hitPoints'><p>" + hitPoints + "</p></div>");
			setTimeout( function(){
				$(".enemyInfo .hitPoints").remove();
			}, 1000);
		}
	}
}
function displayInventory(characterType, character) {
	if (characterType == "enemy") {
		var i;
		var invLength = character.inventory.length;
		for (i = invLength; i--;) {
			console.log(character);
			$(".enemyInfo .winnedInventory").append("<p>" +	character.inventory[i] + "</p>");
		}
		$(".enemyInfo .winnedInventory").append("")
	}
}
function isDead(player, enemy) {
	if (enemy.health <= 0){
	 	for (var i = 0; i < enemy.inventory.length; i++){
	 		player.inventory.push(enemy.inventory[i]);
			console.log(enemy.inventory[i]);
	 	}
		displayInventory("enemy", enemy);
	 	delete enemy;
	 	$(".enemyInfo").css("transform", "perspective(900px) rotate3d(0,1,0,-180deg)");
	 	alert("enemy is dead!");
	 	player.getNewLevel();
	 	console.log(player);
	 	mainGameLoop(player);
	 	}
	 	else if (player.health <= 0 ){
	 		alert("You are dead!");
	 	}
	 	else return false;
}

//*************** end attack block ****************//

// //*************** run block *******************//

// 	 else if (choise == "run"){
// 	 	var chanceToRun = 0;
// 	 	var randRun = Math.random();
// 	 	if (player.playerClass == "warrior"){ // set chance to run for warrior
// 	 		chanceToRun = 0.70;
// 	 	}
// 	 	else if (player.playerClass == "archer"){ // set chance to run for archer
// 	 		chanceToRun = 0.80;
// 	 	}
// 	 	if (randRun <= chanceToRun){
// 	 		document.write("You have successfully escaped!<br />")
// 	 		mainGameLoop(player);
// 	 	}
// 	 	else {
// 	 		var enemyRunHitPoints = enemy.streight * getRandomInt(4, 5);
// 	 		player.health -= enemyRunHitPoints;
// 	 		if (player.health <= 0){
// 	 			alert("You dead!");
// 	 			startNewGame();
// 	 		}
// 	 		else{
// 	 		document.write("The enemy caught up with you!<br />")
// 	 		showPlayerStats(player);
// 	 		battle(enemy, player);
// 	 		}
// 	 	}
// 	}



	//*************** end run block *******************//
