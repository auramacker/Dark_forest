// The game Dark forest v.001
$(document).ready(function() {
    var gameStarted = false;
    pressedKey = null;
    var height = $(window).height();
    $("#hide").css('height', height);
    var bg = new Audio(); // play background music
    if (bg.canPlayType("audio/wav")) {
        bg.src = "audio/background.wav";
        bg.play();
    }
    var press = new Audio();
    if (press.canPlayType("audio/wav")) {
        press.src = "audio/spacepress.wav";
        press.volume = 0.1;
    }
    $(document).keyup(function(eventObject){
      pressedKey = null;
    });
    $(document).keydown(function(eventObject) { // on press space start new game
      pressedKey = eventObject.which;
      if (!gameStarted) {
        if (eventObject.which == 32) {
            $("#content *").fadeOut(500);
            setTimeout(function() {
                $("#content").empty(); // clear main content
            }, 500);
            press.play(); // audio effect
            bg.pause();
            $("#content").css("backgroundImage", "url(" + _imgPath + "clear.png)");
            setTimeout('printNotification("You woke up in the woods with a terrible pain in the head. Trying to recall something failed.", "both")', 1700);
            setTimeout('startNewGame("What is your name?:")', 4500); // print intro and start game
            gameStarted = true;
        }
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
function startNewGame(text) {
    if (arguments[0] !== undefined) {
        var prev = showInputBlock("get-text", text);
        var inputBlock = $("#content .get-text .ok");
        inputBlock.click(function() {
            playerName = $("#content .get-text input").val();
            console.log(playerName);
            hideInputBlock(prev);
            showInputBlock("get-text", "Are you warrior or archer?: ");
            $("#content .get-text .ok").click(function() {
                var playerClass = $("#content .get-text input").val();
                console.log(playerClass);
                hideInputBlock("get-text");
                if (playerClass == "warrior" || playerClass == "archer") {
                    var player = new CreatePlayer(playerName, playerClass);
                    player.getPlayerSkills();
                } else {
                    alert("Enter \"Warrior\" or \"Archer\"! ");
                    location.reload();
                }
                console.log(player);
                mainGameLoop(player);
            })

        })
    }
}

function showInputBlock(block, text) {
    block += Math.round(Math.random() * 100); // every element is unical
    $("#content").append("<div class='get-text " + block + "'><p>" + text + "</p><input type='text'><div class='ok'>ok</div></div>"); // create new
    setInterval(function() {
        $("#content ." + block).css("opacity", "1");
    }, 100);
    printNotification();
    $("#content ." + block + " input").focus();
    return block;
}

function hideInputBlock(block) {
    $("#content ." + block).fadeOut(100); // empty arguments hide this block;
    $("#content ." + block).remove();


}

function printNotification(text, buttons, id, ) { // function print notification
  var buttonsText = "<div class='notify'><p>" + text + "</p><div class='ok'>ok</div></div>";
    if (arguments[0] !== undefined) {
      if (arguments[1] == "both") {
        buttonsText = "<div class='notify'><p>" + text + "</p></div>";
      }
      $("#content .notify").remove();
      if (id === undefined) {
        $("#content").append(buttonsText); // create new
      }
      else {
        $("#content").append("<div class='notify' id='" + id + "'><p>" + text + "</p><div class='ok'>ok</div></div>"); // create new
      }
        setInterval(function() {
            $("#content .notify").css("opacity", "1");
        }, 100);
    } else $("#content .notify").fadeOut(100); // empty arguments hide this block;
}
function printNotifyButtons(text, id, buttons) { // function print notification
  var i = 0, length = buttons.length;
    if (arguments[0] !== undefined) {
      $("#content .notify").remove();
      if (id === undefined) {
        $("#content").append("<div class='notify'><p>" + text); // create new
        for (;i < length; i++) {
          $("#content .notify").append("<p id='" + buttons[i] + "'>" + buttons[i] + "</p>" );
        }
      }
      else {
        $("#content").append("<div class='notify'><p>" + text); // create new
        for (;i < length; i++) {
          $("#content .notify").append("<p class='variant' id='" + buttons[i] + "'>" + buttons[i] + "</p>" );
        }      }
        setInterval(function() {
            $("#content .notify").css("opacity", "1");
        }, 100);
    } else $("#content .notify").fadeOut(100); // empty arguments hide this block;
}
// ********************** end visualization **********************

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function GameArea(available, safety, food, materials, medicaments, enemies) { // world constructor
    this.available = available;
    this.safety = safety;
    this.food = food;
    this.materials = [];
    this.getMaterials = function() {
      for (var i = 0; i < materials.length; i++) {
        this.materials[i] = {
          name: materials[i],
          image: "url(" + _imgPath + materials[i] + ".png)",
          number: 1,
          src: "url(" + _imgPath + materials[i] + "Inv.png)"
        }
      }
    }
    this.medicaments = medicaments;
    this.enemies = enemies;
}
GameArea.prototype = { // prototype
    temperature: 0,
    weather: "",
    setTemperature: function() {
        if (arguments.length > 0) this.temperature = arguments[0];
        else {
            var randomTemp = Math.random(); // choose game temperature
            if (randomTemp <= 0.25) {
                this.temperature = getRandomInt(-10, 0);
            } else if (randomTemp <= 0.50) {
                this.temperature = getRandomInt(0, 10);
            } else if (randomTemp <= 0.75) {
                this.temperature = getRandomInt(10, 20);
            } else this.temperature = getRandomInt(20, 30);
        }
    },
    setWeather: function() { // weather set depending on the temperature
        if (arguments.length > 0 && arguments.length <= 1) this.weather = arguments[0];
        else {
            var randWeather = Math.random();
            if (this.temperature <= 0) {
                if (randWeather <= 0.50) this.weather = weathersArray[0];
                else if (randWeather <= 0.80) this.weather = weathersArray[1];
                else this.weather = weathersArray[2];
            } else if (this.temperature <= 10) {
                if (randWeather <= 0.65) this.weather = weathersArray[3];
                else if (randWeather <= 0.75) this.weather = weathersArray[0];
                else if (randWeather <= 0.85) this.weather = weathersArray[1];
                else this.weather = weathersArray[2];
            } else if (this.temperature <= 20) {
                if (randWeather <= 0.50) this.weather = weathersArray[3];
                else if (randWeather <= 0.75) this.weather = weathersArray[1];
                else this.weather = weathersArray[2];
            } else {
                if (randWeather <= 0.65) this.weather = weathersArray[4];
                else this.weather = weathersArray[2];
            }
        }
    },

};

// characters
function CreatePlayer(name, playerClass) { // player constructor function
    this.name = name;
    this.level = 1;
    this.streight = 0;
    this.health = 0;
    this.weapon = "none";
    this.maxHealth = 0;
    this.playerClass = playerClass;
    this.inventory = [{image: "url(images/wood.png)", name: "wood" , number: 5, src: "url(images/woodInv.png)"},
  {image: "url(images/rock.png)", name: "rock" , number: 5, src: "url(images/rockInv.png)"},
{image: "url(images/meat.png)", name: "meat" , number: 5, src: "url(images/meatInv.png)"},
{image: "url(images/branch.png)", name: "branch" , number: 5, src: "url(images/branchInv.png)"},
{image: "url(images/roasted-meat.png)", name: "roasted-meat" , number: 5, src: "url(images/roasted-meat.png)", useful: true}];
    this.getPlayerWeapon = function() {
        if (this.weapon == "ax") {
            this.streight += 4;
        } else if (this.weapon == "bow") {
            this.streight += 3;
        }
    }
    this.getPlayerSkills = function() {
        if (this.playerClass == "archer") {
            this.streight = 7;
            this.health = 200;
            this.maxHealth = 200;
        } else if (this.playerClass == "warrior") {
            this.streight = 12;
            this.health = 250;
            this.maxHealth = 250;
        }
    }
    this.getNewLevel = function() {
        this.level++;
        this.streight++;
        this.maxHealth += 20;
    }
}

function CreateEnemy(name, enemyClass, player) { // enemies constructor
    this.name = name;
    this.enemyClass = enemyClass;
    this.health = 0;
    this.inventory = [];
    this.streight = 0;
    this.getEnemyProp = function() {
        switch (enemyClass) {
            case "bear":
                this.image = "url(" + _imgPath + "bear.png)";
                this.health = Math.round((player.level / 1.5) * defaultBearHealth);
                this.maxHealth = Math.round((player.level / 1.5) * defaultBearHealth);
                this.streight = (player.level / 2.5) * defaultBearStreight;
                this.inventory = [];
                this.inventory[0] = {
                    name: "leather",
                    number: 3,
                    src: _imgPath + "leather.png",
                    useful: false
                }
                this.inventory[1] = {
                    name: "meat",
                    number: 2,
                    src: _imgPath + "meat.png",
                    useful: false
                }
                break;
            case "wolf":
                this.image = "url(" + _imgPath +"wolf.png)";
                this.health = Math.round((player.level / 1.5) * defaultWolfHealth);
                this.maxHealth = Math.round((player.level / 1.5) * defaultWolfHealth);
                this.streight = (player.level / 2.5) * defaultWolfStreight;
                this.inventory = [];
                this.inventory[0] = {
                    name: "leather",
                    number: 3,
                    src: _imgPath + "leather.png",
                    useful: false
                }
                this.inventory[1] = {
                    name: "meat",
                    number: 3,
                    src: _imgPath + "meat.png",
                    useful: false
                }
                break;
            case "wild boar":
                this.image = "url(" + _imgPath + "boar.png)";
                this.health = Math.round((player.level / 1.5) * defaultBoarHealth);
                this.maxHealth = Math.round((player.level / 1.5) * defaultBoarHealth);
                this.streight = (player.level / 2.5) * defaultBoarStreight;
                this.inventory = [];
                this.inventory[0] = {
                    name: "leather",
                    number: 3,
                    src: _imgPath + "leather.png",
                    useful: false
                }
                this.inventory[1] = {
                    name: "meat",
                    number: 2,
                    src: _imgPath + "meat.png",
                    useful: false
                }
                break;
            case "elk":
                this.image = "url(" + _imgPath + "elk.png)";
                this.health = Math.round((player.level / 1.5) * defaultElkHealth);
                this.maxHealth = Math.round((player.level / 1.5) * defaultElkHealth);
                this.streight = (player.level / 2.5) * defaultElkStreight;
                this.inventory = [];
                this.inventory[0] = {
                    name: "leather",
                    number: 3,
                    src: _imgPath + "leather.png",
                    useful: false
                }
                this.inventory[1] = {
                    name: "meat",
                    number: 2,
                    src: _imgPath + "meat.png",
                    useful: false
                }
                break;
            default:
                throw ("Incorrect entered value enemyClass!");
                break;
        }
    };
}
//set game areas
var forest = new GameArea(true, false, ["berries", "potato"], ["branch", "wood"], ["medical berries", "herb"], ["elk",
    "wild boar", "wolf"
]);
  forest.getMaterials();
var river = new GameArea(true, false, ["fish", "water"], ["rock", "rope"], [], ["wolf", "bear", "wild boar"]);
  river.getMaterials();
var swamp = new GameArea(true, false, ["rise", "water"], ["branch", "wood"], ["medical berries", "herb"], ["elk"]);
  swamp.getMaterials();
var hovel = new GameArea(false, true, [], [], [], [], []);
// triggers
var meatClicked = false;

function mainGameLoop(player) {

  // actions on player info
  setInterval(function(){
    $(".playerInfo .roasted-meat").on("click", function(){
      meatClicked = true;
    });
    if (meatClicked) {
      increaseHP(50, player);
      meatClicked = false;
    }
  }, 50);
  // ---------------------

    $("#content div").remove();
    $("#content").css("backgroundImage", "url(" + _imgPath + "mainBackground.png)");
    printNotification("You need to find some food and find accommodation...");
    $("#content .notify .ok").click(function() {
        choosePath(player);
        printNotification();
        showPlayerStats(player);
        $("#content .forest").click(function() {
            $("#content #choise").css("opacity", 0);
            setTimeout(function() {
                $("#content #choise").remove();

            }, 500);
            weatherInit(forest, player);
            getWeatherEffects(forest, player);
            $("#content").css("background-image", "url(" + _imgPath + "forestBg.png)");
            chooseAreaAction("forest");
            $(".forestActions .hunt").click(function() {
                var randChance = Math.random();
                if (randChance <= 0.75) {
                    var randEnemyIndex = getRandomInt(0, forest.enemies.length - 1);
                    var randEnemy = forest.enemies[randEnemyIndex];
                    var enemy = new CreateEnemy(randEnemy, randEnemy, player);
                    enemy.getEnemyProp();
                    showEnemyStats(enemy);
                    battleInterface(enemy, player);
                    $("#content .choiseAttack").click(function() { // if coise attack enemy
                        if (player.health > 0) {
                            attack(enemy, player);
                        }
                        isDead(player, enemy);
                    })
                    $("#content .run").click(function(){ // if coise run from battle area
                      var isPlayerDead = isDead(player, enemy);
                      if (!isPlayerDead){
                        printNotification("You have successfully escaped", "both");
                        delete enemy;
                        setTimeout(function(){
                          mainGameLoop(player);
                        }, 3000);
                      }
                    })
                } else {
                    printNotification("Hunting failed! You could not find any animal ...", "both");
                    setTimeout(function(){
                      mainGameLoop(player);
                    }, 3000);
                }
            })
            $(".forestActions .searchMaterials").click(function() {
              var collectingTimer, collectingResult, changeLines;
              var randMaterialIndex = getRandomInt(0, forest.materials.length-1);
              showMaterial(forest.materials[randMaterialIndex]);
              var linesPosition = collectMaterialInterface(forest.materials[randMaterialIndex], player);
              setTimeout(function(){
                printNotification("To collect material press \"SPACE\" when white line will be in the green area", "ok" , "materialHelp");
                $("#materialHelp .ok").click(function(){
                  printNotification();
                  setGameTime(30);
                  changeLines = setInterval(function(){
                    linesPosition = changeLinesPos();
                  }, 3000);
                  setTimeout(function(){
                    clearInterval(collectingTimer);
                    clearInterval(changeLines);
                    printNotification("Time is over!", "both");
                    setTimeout(function(){
                      mainGameLoop(player);
                    }, 2000);
                  }, 30000);
                  collectingTimer = setInterval(function(){
                      if (!collectingResult) {
                        collectingResult = collectGame(linesPosition);
                      }
                      else {
                        addToPlayer(forest.materials[randMaterialIndex], player);
                        hideMaterial();
                        randMaterialIndex = getRandomInt(0, forest.materials.length-1);
                        showMaterial(forest.materials[randMaterialIndex]);
                        collectingResult = undefined;
                      }
                  }, 100);
                })
              }, 2500);
            })
        });
      $("#content .river").click(function() {
        $("#content #choise").css("opacity", 0);
        setTimeout(function() {
            $("#content #choise").remove();

        }, 500);
        weatherInit(river, player);
        getWeatherEffects(river, player);
        $("#content").css("background-image", "url(" + _imgPath + "riverBg.png)");
        chooseAreaAction("river");
        $(".riverActions .hunt").click(function(){
          var randChance = Math.random();
          if (randChance <= 0.75) {
              var randEnemyIndex = getRandomInt(0, river.enemies.length - 1);
              var randEnemy = river.enemies[randEnemyIndex];
              var enemy = new CreateEnemy(randEnemy, randEnemy, player);
              enemy.getEnemyProp();
              showEnemyStats(enemy);
              battleInterface(enemy, player);
              $("#content .choiseAttack").click(function() { // if coise attack enemy
                  if (player.health > 0) {
                      attack(enemy, player);
                  }
                  isDead(player, enemy);
              })
              $("#content .run").click(function(){ // if coise run from battle area
                var isPlayerDead = isDead(player, enemy);
                if (!isPlayerDead){
                  printNotification("You have successfully escaped", "both");
                  delete enemy;
                  setTimeout(function(){
                    mainGameLoop(player);
                  }, 3000);
                }
              })
          } else {
              printNotification("Hunting failed! You could not find any animal ...", "both");
              setTimeout(function(){
                mainGameLoop(player);
              }, 3000);
          }
        })
        $(".riverActions .searchMaterials").click(function(){
          var collectingTimer, collectingResult, changeLines;
          var randMaterialIndex = getRandomInt(0, river.materials.length-1);
          showMaterial(river.materials[randMaterialIndex]);
          var linesPosition = collectMaterialInterface(river.materials[randMaterialIndex], player);
          setTimeout(function(){
            printNotification("To collect material press \"SPACE\" when white line will be in the green area", "ok","materialHelp");
            $("#materialHelp .ok").click(function(){
              printNotification();
              setGameTime(30);
              changeLines = setInterval(function(){
                linesPosition = changeLinesPos();
              }, 3000);
              setTimeout(function(){
                clearInterval(collectingTimer);
                clearInterval(changeLines);
                printNotification("Time is over!", "both");
                setTimeout(function(){
                  mainGameLoop(player);
                }, 2000);
              }, 30000);
              collectingTimer = setInterval(function(){
                  if (!collectingResult) {
                    collectingResult = collectGame(linesPosition);
                  }
                  else {
                    addToPlayer(river.materials[randMaterialIndex], player);
                    hideMaterial();
                    randMaterialIndex = getRandomInt(0, river.materials.length-1);
                    showMaterial(river.materials[randMaterialIndex]);
                    collectingResult = undefined;
                  }
              }, 100);
            })
          }, 2500);
        })
      })
      $("#content .swamp").click(function(){
        $("#content #choise").css("opacity", 0);
        setTimeout(function() {
            $("#content #choise").remove();

        }, 500);
        weatherInit(swamp, player);
        getWeatherEffects(swamp, player);
        $("#content").css("background-image", "url(" + _imgPath + "swampBg.png)");
        chooseAreaAction("swamp");
        $(".swampActions .hunt").click(function(){
          var randChance = Math.random();
          if (randChance <= 0.75) {
              var randEnemyIndex = getRandomInt(0, swamp.enemies.length - 1);
              var randEnemy = swamp.enemies[randEnemyIndex];
              var enemy = new CreateEnemy(randEnemy, randEnemy, player);
              enemy.getEnemyProp();
              showEnemyStats(enemy);
              battleInterface(enemy, player);
              $("#content .choiseAttack").click(function() { // if coise attack enemy
                  if (player.health > 0) {
                      attack(enemy, player);
                  }
                  isDead(player, enemy);
              })
              $("#content .run").click(function(){ // if coise run from battle area
                var isPlayerDead = isDead(player, enemy);
                if (!isPlayerDead){
                  printNotification("You have successfully escaped");
                  delete enemy;
                  setTimeout(function(){
                    mainGameLoop(player);
                  }, 3000);
                }
              })
          } else {
              printNotification("Hunting failed! You could not find any animal ...", "both");
              setTimeout(function(){
                mainGameLoop(player);
              }, 3000);
          }
        })
        $(".swampActions .searchMaterials").click(function(){
          var collectingTimer, collectingResult, changeLines;
          var randMaterialIndex = getRandomInt(0, swamp.materials.length-1);
          showMaterial(swamp.materials[randMaterialIndex]);
          var linesPosition = collectMaterialInterface(swamp.materials[randMaterialIndex], player);
          setTimeout(function(){
            printNotification("To collect material press \"SPACE\" when white line will be in the green area", "ok","materialHelp");
            $("#materialHelp .ok").click(function(){
              printNotification();
              setGameTime(30);
              changeLines = setInterval(function(){
                linesPosition = changeLinesPos();
              }, 3000);
              setTimeout(function(){
                clearInterval(collectingTimer);
                clearInterval(changeLines);
                printNotification("Time is over!", "both");
                setTimeout(function(){
                  mainGameLoop(player);
                }, 2000);
              }, 30000);
              collectingTimer = setInterval(function(){
                  if (!collectingResult) {
                    collectingResult = collectGame(linesPosition);
                  }
                  else {
                    addToPlayer(swamp.materials[randMaterialIndex], player);
                    hideMaterial();
                    randMaterialIndex = getRandomInt(0, swamp.materials.length-1);
                    showMaterial(swamp.materials[randMaterialIndex]);
                    collectingResult = undefined;
                  }
              }, 100);
            })
          }, 2500);
        })
      })
      $("#content .buildHovel").click(function(){
        if (hovel.available) { // enter available
          $("#content #choise").css("opacity", 0);
          setTimeout(function() {
              $("#content #choise").remove();

          }, 500);
          $("#content").css("background", "#000");
          chooseAreaAction("hovel");
          $("#content").prepend("<canvas></canvas>");
          Bonfire();
          $("#content .create").click(function(){
            creatingInterface(player);
          })
        }
        else { // try to build
          printNotifyButtons("You need 4 wood, 3 rocks and 5 branches to build a hovel. Try to build?", "build", ["yes", "no"]);
          $("#yes").click(function(){
            var hovelResult = deleteInvElem("wood", 1, player);
            updatePlayerStats(player);
            if (hovelResult) {
              printNotification("Hovel built successfully!");
              $("#content .ok").click(function(){
                printNotification();
                $("#content .buildHovel").addClass("builded");
                hovel.available = true;
              })
            }
            else {
              setTimeout(function(){
                printNotification();
              }, 2500);
            }
          });
        $("#no").click(function(){
          printNotification();
        })
        }
      })
    })
};
function increaseHP(points, player) {
  var currentHp = player.health, maxHp = player.maxHealth, bufHp;
  bufHp = currentHp + points;
  if (bufHp > maxHp) {
    player.health = maxHp;
  }
  else player.health = bufHp;
  var healthPercents = Math.round(((player.health / player.maxHealth) * 100), 2), result = false;
  $(".playerInfo .health").css("width", healthPercents + "%");
  $(".playerInfo .text-health").text(player.health + " HP");
  deleteInvElem("roasted-meat", 1, player);
  for (var i = 0; i < player.inventory.length; i++) {
    if (player.inventory[i].name == "roasted-meat") {
      $(".playerInfo .roasted-meat .number").text(player.inventory[i].number);
      result = true;
    }
  }
  if (!result) {
    $(".playerInfo .roasted-meat").remove();
  }
}
function creatingInterface(player) {
  var i = 0, length = player.inventory.length, iCount = 1, jCount = 1, droppArray = [], checkInterval;
  $("#content .areaAction, canvas").fadeOut(); // clean content
  setTimeout(function(){
    $("#content .areaAction").remove();
    $("canvas").remove();
    $("#content").append("<div id='workshop'> \
      <div class='top'> \
        <div class='creating'>\
        <div class='1_1'></div> \
        <div class='1_2'></div> \
        <div class='1_3'></div> \
        <div class='2_1'></div> \
        <div class='2_2'></div> \
        <div class='2_3'></div> \
        <div class='3_1'></div> \
        <div class='3_2'></div> \
        <div class='3_3'></div> \
        </div>\
      <div class='player-items'>\
        <div class='1_1'></div> \
        <div class='1_2'></div> \
        <div class='1_3'></div> \
        <div class='2_1'></div> \
        <div class='2_2'></div> \
        <div class='2_3'></div> \
        <div class='3_1'></div> \
        <div class='3_2'></div> \
        <div class='3_3'></div> \
      </div>\
      </div>\
      <div class='middle'> \
      <div class='buttons'>\
        <a class='close-creator'>Quit creator</a> \
        <a class='cancel'>Cancel</a>\
        <a class='apply'>Create!</a>\
      </div>\
        <div class='result-item'>\
        </div>\
      </div>\
    </div>")
    for (; i < length; i++) { // adding player inventory in to the draggable block
      $(".player-items ." + iCount + "_" + jCount).append("<div class='item-block'><div class='" + player.inventory[i].name + "'><div class='number'>" + player.inventory[i].number + "</div></div></div>");
      jCount ++;
      if (jCount == 4) {
        jCount = 1;
        iCount ++;
      }
    }
    $(".player-items .item-block > div").draggable({
    addClasses: false,
    revert: true,
  });
    $(".creating > div").droppable({
      hoverClass: "creating-hover",
      drop: function(event, ui) {
          var dragResult, dropResult, resultObj;
          if ($(this).children().length == 0) {
            if (ui.draggable.children().text() == 1) {
                ui.draggable.clone().appendTo(this);
                $(this).children().css("left", "0px").css("top", "0px");
                ui.draggable.remove();
            }
            else {
              ui.draggable.clone().appendTo(this);
              $(this).children().css("left", "0px").css("top", "0px");
              $(this).children().find(".number").text("1");
              var draggableCounter = ui.draggable.text() - 1;
              ui.draggable.find(".number").text(draggableCounter);
              ui.draggable.css("left", "0px").css("top", "0px");
            }
          }
          else {
            if (ui.draggable.children().text() > 1)  {
              if (ui.draggable.attr("class").split(" ")[0] == $(this).children().attr("class") ){
                var draggableCounter = ui.draggable.children().text(), droppCounter = $(this).children().find(".number").text();
                console.log(draggableCounter, droppCounter);
                ui.draggable.children().text(draggableCounter - 1);
                $(this).children().find(".number").text(+droppCounter + 1);
                ui.draggable.css("left", "0px").css("top", "0px");
              }
            }
            else {
              if (ui.draggable.attr("class").split(" ")[0] == $(this).children().attr("class") ){
                var droppCounterLast = $(this).children().find(".number").text();
                $(this).children().find(".number").text(+droppCounterLast + 1);
                ui.draggable.remove();
              }
            }
          }
          dragResult = ui.draggable.attr("class").split(" ")[0];
          dropResult = $(this).attr("class").split(" ")[0];
          number = $(this).children().text();
          $(this).children().attr("class", $(this).children().attr("class").split(" ")[0]);
          resultObj = {
            dropped: dropResult,
            dragged: dragResult,
            num: number
          }
          if (droppArray.length == 0) {
            droppArray.push(resultObj);
          }
          else {
            var isIsset = false;
            for (var i = 0; i < droppArray.length; i++) {
              if (droppArray[i].dropped == resultObj.dropped && droppArray[i].dragged == resultObj.dragged) {
                droppArray.splice(i, 1);
                droppArray.push(resultObj);
                isIsset = true ;
                break;
              }
            }
            if (!isIsset) {
              droppArray.push(resultObj);
            }
          }
          console.log(droppArray);
          checkInterval = setInterval(function(){
            checkCreating();
          }, 50);
      }
    });
    $(".buttons .cancel").on("click", function(){
      $(".creating div").children().remove();
      $(".player-items div").children().remove();
      var i = 0, length = player.inventory.length, iCount = 1, jCount = 1;
      for (; i < length; i++) { // adding player inventory in to the draggable block
        $(".player-items ." + iCount + "_" + jCount).append("<div class='item-block'><div class='" + player.inventory[i].name + "'><div class='number'>" + player.inventory[i].number + "</div></div></div>");
        jCount ++;
        if (jCount == 4) {
          jCount = 1;
          iCount ++;
        }
      }
      $(".player-items .item-block > div").draggable({
      addClasses: false,
      revert: true,
    });
    });
    $(".buttons .apply").on("click", function(){
      if ($(".result-item").children().length > 0) {
        var result = $(".result-item").children().attr("class");
        switch (result) {
          case "ax":
            player.weapon = "ax";
            player.getPlayerWeapon();
            for (var i = 0; i < droppArray.length; i++) {
              deleteInvElem(droppArray[i].dragged, droppArray[i].num, player);
            }
            $(".creating div").children().remove();
            updatePlayerStats(player);
            droppArray.splice(0, droppArray.length);
          break;
          case "bow":
            player.weapon = "bow";
            player.getPlayerWeapon();
            for (var i = 0; i < droppArray.length; i++) {
              deleteInvElem(droppArray[i].dragged, droppArray[i].num, player);
            }
            $(".creating div").children().remove();
            updatePlayerStats(player);
            droppArray.splice(0, droppArray.length);
          break;
          case "roasted-meat":
            for (var i = 0; i < droppArray.length; i++) {
              deleteInvElem(droppArray[i].dragged, droppArray[i].num, player);
            }
            addToPlayer({image: "url(images/roasted-meat.png)", name: "roasted-meat" , number: 1, src: "url(images/roasted-meat.png)", useful: true}, player)
            $(".creating div").children().remove();
            updatePlayerStats(player);
          break;
        }
      }
    });
    $(".buttons .close-creator").on("click", function(){
      mainGameLoop(player);
    });
  }, 200);
}
function checkCreating(){
  var cr = $(".creating");
  function getCrClass(position){
    return cr.find("." + position).children().attr("class")
  }
  if ((getCrClass("3_2") == "wood") && (getCrClass("2_2") == "wood") // for ax
    && (getCrClass("1_2") == "rock") && (getCrClass("1_3") == "rock")
    && (getCrClass("2_3") == "rock") && (!getCrClass("1_1")) && (!getCrClass("2_1")) && (!getCrClass("3_1"))
    && (!getCrClass("3_3")) ) {
    if ($("#content .result-item").children().length == 0) {
      $("#content .result-item").append("<div class='ax'><span>Ax</span></div>");
    }
  }
  else if ((getCrClass("3_2") == "branch") && (getCrClass("2_3") == "branch") // for bow
    && (getCrClass("1_2") == "branch") && (getCrClass("2_2") == "rope")
    && (!getCrClass("1_3")) && (!getCrClass("1_1")) && (!getCrClass("2_1")) && (!getCrClass("3_1"))
    && (!getCrClass("3_3")) ) {
    if ($("#content .result-item").children().length == 0) {
      $("#content .result-item").append("<div class='bow'><span>Bow</span></div>");
    }
  }
  else if ((getCrClass("3_2") == "branch") && (getCrClass("3_1") == "rock") // for bow
    && (getCrClass("3_3") == "rock") && (getCrClass("2_2") == "meat") ) {
    if ($("#content .result-item").children().length == 0) {
      $("#content .result-item").append("<div class='roasted-meat'><span>Roasted meat</span></div>");
    }
  }
  else if ($("#content .result-item").children().length > 0) {
    $("#content .result-item").children().remove();
  }
}
function hideMaterial(){
    $("#content .materialInfo").remove();
};
function addToPlayer(loot, player) {
  var i = 0, j = player.inventory.length, analogFound;
  for (i; i < j; i++) {
    if (player.inventory[i].name == loot.name) {
      player.inventory[i].number++;
      analogFound = true;
    }
  }
  if (!analogFound) {
    player.inventory.push(loot);
  }
};
function collectGame(linesPos) {
  var currentWidth = $(".materialInfo .collect-status").width(), minimWidth, currentWidth, tansform, degree; // collect indicator position
  if (currentWidth > 0 ) {
    minimWidth = currentWidth - 5;
    $(".materialInfo .collect-status").css("width", minimWidth );
  }
  if (pressedKey == 32) {
    transform = $("#content .hiting-circle #line").css("transform");
    var values = transform.split('(')[1].split(')')[0].split(',');
    var a = values[0], b = values[1];
    degree = Math.round(Math.atan2(b, a) * (180/Math.PI));
    if (linesPos[0] > linesPos[1]) {
      if (degree < linesPos[0] && degree > linesPos[1]) {
        var newWidth, numWidth;
        if (currentWidth >= 350) {
          return true
        }
        else {
          newWidth = currentWidth + 150; // status line grows
          $(".materialInfo .collect-status").css("width", newWidth );
        }
      }
      else if (degree > linesPos[0] || degree < linesPos[1] && currentWidth > 50) { // if line not in the area
        newWidth = currentWidth - 50; // status line decrease
        $(".materialInfo .collect-status").css("width", newWidth );
      }
    }
    else if (linesPos[0] < linesPos[1]) {
      if (degree > linesPos[0] && degree < linesPos[1]) {
        var newWidth, numWidth;
        if (currentWidth >= 350) {
          return true
        }
        else {
          newWidth = currentWidth + 150; // status line grows
          $(".materialInfo .collect-status").css("width", newWidth );
        }
      }
      else if (degree < linesPos[0] || degree > linesPos[1] && currentWidth > 50) {
        newWidth = currentWidth - 50; // status line decrease
        $(".materialInfo .collect-status").css("width", newWidth );
      }
    }
  }
};
function setGameTime(seconds) {
  var sec = seconds;
  var time = "00:" + sec;
  if ($("#gameTimer")) {
    $("#gameTimer").remove();
    $("#content").append("<div id='gameTimer'></div>");
    $("#gameTimer").html(time);
  }
  else {
  $("#content").append("<div id='gameTimer'></div>");
  $("#gameTimer").html(time);
  }
  if (sec > 0) {
    var mainTimer = setTimeout(function(){
      setGameTime(sec-1);
    }, 1000)
  }
  else {
    return false
  }
}
function choiseWeaponToCreate(player) {
    var result;
    if (player.playerClass == "warrior") {
        result = window.prompt("You can create the ax. Try to create? (Y/N) ");
    } else result = window.prompt("You can create the bow. Try to create? (Y/N)");
    return result;
}

function deleteInvElem(element, qt, player) {
  var el = element, i = 0, length = player.inventory.length, result;
  if (length > 0) {
    for (; i < length; i++) {
      if (player.inventory[i].name == element ) {
        if (player.inventory[i].number >= qt) {
          player.inventory[i].number -= qt;
          if (player.inventory[i].number == 0) {
            player.inventory.splice(i, 1);
            break
          }
          result = true;
        }
      }
    }
  }
  else {
    printNotification("You have not enought elements ...", "both");
    result = false;
  }
  return result
}

function choseHovelActions(player) {
    var result = window.prompt("You can sleep, eat, heal, create weapon or exit. What are you going to do?");
    return result;
}

function searchInventoryElem(element, player) { // returns qt of searched elements
    var elemName = element, i = 0, length = player.inventory.length, qtResult ;
    for (;i < length; i++) {
      if (player.inventory[i].name == element) {
        qtResult = player.inventory[i].number;
      }
    }
    return qtResult
}

function weatherInit(area, player) {
    area.setTemperature(); // set weather in zone
    area.setWeather();
    $("content .weather").remove();
    $("#content .playerInfo").append("<div class='weather'><div class='" + area.weather + "'></div><br /><div class='info'><span class='t0'>" +
        area.temperature + "°C</span><br /><span class='title'>" + area.weather + "</span></div></div>");
    $("#content .weather").css("opacity", 1);
    $("#content .playerInfo").css("top", "40%");
    setInterval(function() {
        $("#content .playerInfo").css("top", "60%");
    }, 2000);
}

function searchMaterials(area, player) { // searching for materials
    var meetEnemy = Math.random(); // random enemy
    if (meetEnemy <= 0.1) {
        var randEnemy = getRandomInt(0, area.enemies.length - 1)
        var enemy = new CreateEnemy(area.enemies[randEnemy], area.enemies[randEnemy], player);
        enemy.getEnemyProp();
        showEnemyStats(enemy);
        battle(enemy, player);
    }
    var randFood = Math.random();
    if (randFood <= 0.4) {
        var randStuff = getRandomInt(0, area.materials.length - 1);
        player.inventory += area.materials[randStuff];
        alert("You find some materials! Maybe now you can build a hovel...");
        showPlayerStats(player);
    } else {
        alert("You find nothing...");
    }
}

function searchHerbs(area, player) { // searching for healing herbs
    var meetEnemy = Math.random(); // random enemy
    if (meetEnemy <= 0.1) {
        var randEnemy = getRandomInt(0, area.enemies.length - 1)
        var enemy = new CreateEnemy(area.enemies[randEnemy], area.enemies[randEnemy], player);
        enemy.getEnemyProp();
        showEnemyStats(enemy);
        battle(enemy, player);
    }
    var randFood = Math.random();
    if (randFood <= 0.4) {
        var randStuff = getRandomInt(0, area.medicaments.length - 1);
        player.inventory += area.medicaments[randStuff];
        alert("You find some healing herbs! You need go to the safe place to use it");
        showPlayerStats(player);
    } else {
        alert("You find nothing...");
    }
}

function searchFood(area, player) { // searching food
    var meetEnemy = Math.random(); // random enemy
    if (meetEnemy <= 0.1) {
        var randEnemy = getRandomInt(0, area.enemies.length - 1)
        var enemy = new CreateEnemy(area.enemies[randEnemy], area.enemies[randEnemy], player);
        enemy.getEnemyProp();
        showEnemyStats(enemy);
        battle(enemy, player);
    }
    var randFood = Math.random();
    if (randFood <= 0.4) {
        var randStuff = getRandomInt(0, area.food.length - 1);
        player.inventory += area.food[randStuff];
        alert("You find some food! You need go to the safe place to eat");
        showPlayerStats(player);
    } else {
        alert("You find nothing...");
    }
}

function getWeatherEffects(area, player) {
    var demage = false;
    var damagePercents;
    if (area.temperature <= 0 && area.weather == "snow") {
        player.health -= 20;
        updatePlayerStats(player);
        setInterval(function() {
            $("#content .playerInfo").css("top", "60%");
        }, 2000);
        demage = true;
        return demage;
    } else if (area.temperature >= 20 && area.weather == "heat") {
        player.health -= 20;
        updatePlayerStats(player);
        setInterval(function() {
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
function updatePlayerStats(player) {
  var healthPercents = Math.round(((player.health / player.maxHealth) * 100), 2), i = 0, length = player.inventory.length;
  $(".playerInfo .health").css("width", healthPercents + "%");
  $(".playerInfo .level").text(+player.level);
  $(".playerInfo .text-health").text(player.health + " HP");
  $(".playerInfo .streight").text("Streight: " + player.streight);
  $(".playerInfo .weapon").text("Weapon: " + player.weapon);
  console.log("infunction");
  if (length > 0) {
      $(".playerInfo .player-inventory").remove();
      $(".playerInfo .useful").remove();
      $(".playerInfo").append("<div class='player-inventory'></div>");
      $(".playerInfo").append("<div class='useful'></div>");
      console.log("working");
      for (var i = 0; i < player.inventory.length; i++) {
        if (player.inventory[i].useful) {
          $(".playerInfo .useful").append("<div class='item-block'><div class='" +
              player.inventory[i].name + "'><div class='number'>" + player.inventory[i].number +
              "</div></div></div></div>")
        }
        else {
          $(".playerInfo .player-inventory").append("<div class='item-block'><div class='" +
              player.inventory[i].name + "'><div class='number'>" + player.inventory[i].number +
              "</div></div></div></div>")
        }
      }
  };
};
function showPlayerStats(player) {
    var healthPercents = Math.round(((player.health / player.maxHealth) * 100), 2), timer = 0;
    if ($(".playerInfo").length) {
      timer = 300;
      $(".playerInfo").fadeOut();
      setTimeout(function(){
        $("playerInfo").remove();
      }, 250);
    }
    setTimeout(function(){
      $("#content").append("<div class='playerInfo'><div class='playerPicture'></div><div class='stats'>" +
          "<span class='name'>" + player.name + "</span><br />" + "<span class='playerClass'>" + player.playerClass + " <span class='level'>" +
           player.level + "</span>" + "<span> level</span></span>" +
          "<div class='health'></div></div><p class='text-health'>" + player.health + " HP</p><span class='streight'> Streight: " +
          player.streight + "</span><br /><span class='weapon'> Weapon: " +
          player.weapon + "</span></div></div>");
      $(".playerInfo .health").css("width", healthPercents + "%");
      if (player.inventory.length > 0) {
          $(".playerInfo .player-inventory").remove();
          $(".playerInfo").append("<div class='player-inventory'></div>");
          $(".playerInfo").append("<div class='useful'></div>");
          for (var i = 0; i < player.inventory.length; i++) {
            if (player.inventory[i].useful) {
              $(".playerInfo .useful").append("<div class='item-block'><div class='" +
                  player.inventory[i].name + "'><div class='number'>" + player.inventory[i].number +
                  "</div></div></div></div>")
            }
            else {
              $(".playerInfo .player-inventory").append("<div class='item-block'><div class='" +
                  player.inventory[i].name + "'><div class='number'>" + player.inventory[i].number +
                  "</div></div></div></div>")
            }
          }
      };
      setTimeout(function() {
          $("#content .playerInfo").css("opacity", "1");
      }, 500);
      setTimeout(function() {
          $(".playerInfo").css("top", '60%');
          $(".playerInfo").addClass("playerInfoScale");
      }, 2000)
    }, timer);

};

function showEnemyStats(enemy) {
    $("#content").append("<div class='enemyInfo'><div class='enemyPicture'></div><div class='stats'><span class='name'>" + enemy.name +
        "</span><br /><div class='health' ></div></div><p class='text-health'>" + enemy.health + " HP</p><span class='streight'>Streight: " + enemy.streight +
        " points</span> <div class='backface'>DEFEATED!</div></div></div>");
    $(".enemyInfo .enemyPicture").css("background-image", enemy.image);
    $(".enemyInfo").css("opacity", 1);
    setTimeout(function() {
        $(".enemyInfo").css("left", "10%");
    }, 2000);
}
function showMaterial(material) {
  $("#content").append("<div class='materialInfo'><div class='materialPicture'></div><div class='stats'><span class='name'>" + material.name +
      "</span><br /><div class='collect-status' ></div></div><div class='backface'>COLLECTED!</div></div></div>");
  $(".materialInfo .materialPicture").css("background-image", material.image);
  $(".materialInfo").css("left", "10%");
  $(".materialInfo").css("opacity", 0);
  setTimeout(function(){
    $(".materialInfo").css("opacity", 1);
  }, 500);
}
function changeLinesPos() {
  var rndDeg, firstLine, secondLine, firstLineDeg, secondLineDeg,result;
  rndDeg = getRandomInt(-90, 90);
  firstLine = rndDeg;
  if (rndDeg >= -60 && rndDeg <= 45) {
    var plusMinus = getRandomInt(0 ,1 );
    if (plusMinus) {
      secondLine = rndDeg + 45;
    }
    else {
      secondLine = rndDeg - 45;
    }
  }
  else if (rndDeg < -45) {
    secondLine = rndDeg + 45;
  }
  else {
    secondLine = rndDeg - 45;
  }
  firstLineDeg = firstLine + "deg";
  secondLineDeg = secondLine + "deg";
  $("#content .hiting-circle #first-limit").css("transform", "rotateZ(" + firstLineDeg + ")");
  $("#content .hiting-circle #second-limit").css("transform", "rotateZ(" + secondLineDeg + ")");
  result = [firstLine, secondLine];
  return result
}
function collectMaterialInterface(material, player) {
    var rndDeg, firstLine, secondLine, firstLineDeg, secondLineDeg,result;
    rndDeg = getRandomInt(-90, 90);
    firstLine = rndDeg;
    if (rndDeg >= -60 && rndDeg <= 45) {
      var plusMinus = getRandomInt(0 ,1 );
      if (plusMinus) {
        secondLine = rndDeg + 45;
      }
      else {
        secondLine = rndDeg - 45;
      }
    }
    else if (rndDeg < -45) {
      secondLine = rndDeg + 45;
    }
    else {
      secondLine = rndDeg - 45;
    }
    firstLineDeg = firstLine + "deg";
    secondLineDeg = secondLine + "deg";
    $("#content .areaAction").css("opacity", 0);
    setTimeout(function() {
        $("#content .areaAction").remove();
    }, 500);
    $(".playerInfo").css("opacity", 0);
    setTimeout(function() {
        $(".playerInfo").addClass("inBattle");
        $(".playerInfo").css("opacity", 1);
        $(".playerInfo").removeClass("playerInfoScale");
    }, 2000);
    $("#content").append("<div class='hiting-circle'><div id='first-limit'></div><div id='second-limit'></div><div id='line'></div></div>");
    $("#content .hiting-circle #first-limit").css("transform", "rotateZ(" + firstLineDeg + ")");
    $("#content .hiting-circle #second-limit").css("transform", "rotateZ(" + secondLineDeg + ")");
    $(".choiseAttack").css("opacity", 1);
    result = [firstLine, secondLine];
    return result
}
function choosePath() { // choose path from the start point
    $("#content").append("<div id='choise'> <div class='forest'></div><div class='river'></div><div class='swamp'></div><div class='buildHovel'></div></div>");
    var height = $(window).height();
    $("#choise .forest, #choise .river, #choise .swamp, #choise .buildHovel, #choise").css("height", height);
    if (hovel.available) {
      $("#content .buildHovel").addClass("builded");
    }
    setTimeout(function() {
        $("#content #choise").css("opacity", 1);
    }, 2700);
}

function chooseAreaAction(area) {
    $("#content .areaAction").remove();
    $("#content").append("<div class='areaAction'></div>");
    switch (area) {
        case "forest":
            $("#content .areaAction").addClass("forestActions");
            $("#content .areaAction").css("background-image", "url(" + _imgPath + "forestMain.png)");
            $("#content .forestActions").append("<div class='hunt'></div><div class='searchMaterials'></div>");
            break;
        case "river":
            $("#content .areaAction").addClass("riverActions");
            $("#content .areaAction").css("background-image", "url(" + _imgPath + "riverMain.png)");
            $("#content .riverActions").append("<div class='hunt'></div><div class='searchMaterials'></div>");
            break;
        case "swamp":
            $("#content .areaAction").addClass("swampActions");
            $("#content .areaAction").css("background-image", "url(" + _imgPath + "swampMain.png)");
            $("#content .swampActions").append("<div class='hunt'></div><div class='searchMaterials'></div>");
            break;
        case "hovel":
            $("#content .areaAction").addClass("hovelActions");
            $("#content .hovelActions").append("<div class='create'></div><div class='rest'></div><div class='exit'></div>");
            $("#content").append("<canvas></canvas>");
            break;
    }
}

function battleInterface(enemy, player, iteration) { // if iteration == true its a first call. If false else
    $("#content .areaAction").css("opacity", 0);
    setTimeout(function() {
        $("#content .areaAction").remove();
    }, 500);
    $(".playerInfo").css("opacity", 0);
    setTimeout(function() {
        $(".playerInfo").addClass("inBattle");
        $(".playerInfo").css("opacity", 1);
        $(".playerInfo").removeClass("playerInfoScale");
    }, 2000);
    $("#content").append("<div class='choiseAttack'><div class='attack'></div><div class='run'></div></div>")
    $(".choiseAttack").css("opacity", 1);
    displayInventory("enemy", enemy);
}

function attack(enemy, player) {
    //*************** attack block ****************//

    var chanceToHit;
    var chanceToEnemyHit;
    var randToEnemyHit = Math.random();
    var randToHit = Math.random();
    var hitPoints = player.streight * getRandomInt(5, 7);
    var enemyHitPoints = enemy.streight * getRandomInt(4, 6);

    if (player.playerClass == "warrior") {
        chanceToHit = 0.5;
        chanceToEnemyHit = 0.5;
    } else if (player.playerClass == "archer") {
        chanceToHit = 0.70;
        chanceToEnemyHit = 0.55;
    }
    if (randToHit <= chanceToHit) {
        enemy.health -= hitPoints;
        console.log(enemy.health);
        showDamage("enemy", enemy, hitPoints);
        //showEnemyStats(enemy);
    } else {
        console.log("You missed!" + "<br />");
        showDamage("enemy", enemy, "You missed!");
    }
    if (randToEnemyHit <= chanceToEnemyHit) {
        player.health -= enemyHitPoints;
        console.log(player.health);
        showDamage("player", player, enemyHitPoints);
        return;
    } else {
        console.log("Enemy missed!" + "<br />");
        showDamage("player", player, "Enemy missed!");
        return;
    }
}

function showDamage(charType, character, hitPoints) { // controll flow for "missed" or not missed
    var convertResult;
    tryConvert = isNaN(hitPoints)
    if (!tryConvert) {
        var healthPercents = Math.round((character.health / character.maxHealth) * 100, 2);
        hitPoints = Math.round(hitPoints, 2);
    } else if (tryConvert) {
        convertResult = hitPoints;
    }
    if (charType == "player") {
        if (convertResult === undefined) {
            $(".playerInfo .health").css("width", healthPercents + "%");
            if (character.health > 0) {
                $(".playerInfo .text-health").empty();
                $(".playerInfo .text-health").append(character.health + " HP");
            } else {
                $(".playerInfo .text-health").empty();
                $(".playerInfo .text-health").append("0 HP");
            }
            $(".playerInfo .hitPoints").remove();
            $(".playerInfo .playerPicture").append("<div class='hitPoints'><p> -" + hitPoints + "hp</p></div>");
            setTimeout(function() {
                $(".playerInfo .hitPoints").remove();
            }, 1000);
        } else if (convertResult !== undefined) {
            $(".playerInfo .hitPoints").remove();
            $(".playerInfo .playerPicture").append("<div class='hitPoints'><p> " + hitPoints + "</p></div>");
            setTimeout(function() {
                $(".playerInfo .hitPoints").remove();
            }, 1000);
        }

    } else if (charType == "enemy") {
        if (convertResult === undefined) {
            $(".enemyInfo .health").css("width", healthPercents + "%");
            if (character.health > 0) {
                $(".enemyInfo .text-health").empty();
                $(".enemyInfo .text-health").append(character.health + " HP");
            } else {
                $(".enemyInfo .text-health").empty();
                $(".enemyInfo .text-health").append("0 HP");
            }
            $(".enemyInfo .hitPoints").remove();
            $(".enemyInfo .enemyPicture").append("<div class='hitPoints'><p> -" + hitPoints + "hp</p></div>");
            setTimeout(function() {
                $(".enemyInfo .hitPoints").remove();
            }, 1000);
        } else if (convertResult !== undefined) {
            $(".enemyInfo .hitPoints").remove();
            $(".enemyInfo .enemyPicture").append("<div class='hitPoints'><p>" + hitPoints + "</p></div>");
            setTimeout(function() {
                $(".enemyInfo .hitPoints").remove();
            }, 1000);
        }
    }
}

function displayInventory(characterType, character) {
    if (characterType == "enemy") {
        if ($(".enemyInfo .inventory-wrapper").length) {
            $(".enemyInfo .inventory-wrapper div").remove();
        } else {
            $(".enemyInfo .backface").append("<div class='inventory-wrapper'></div>");
        }
        var inventory = character.inventory;
        for (var i = 0; i < inventory.length; i++) {
            $(".enemyInfo .inventory-wrapper").append("<div class='inventory-block'><div class='" + inventory[i].name + "'><div class='number'>" +
                inventory[i].number + "</div></div><span class='name'>" + inventory[i].name + "</span></div>");
        }
    }
}

function isDead(player, enemy) {
    if (enemy.health <= 0) {
        var isset = false;
        for (var i = 0; i < enemy.inventory.length; i++) { // player get enemy inventory
            for (var j = 0; j < player.inventory.length; j++) {
                if (player.inventory[j].name == enemy.inventory[i].name) {
                    isset = true;
                    player.inventory[j].number += enemy.inventory[i].number;
                }
            }
            if (!isset) {
                player.inventory.push(enemy.inventory[i]);
            }
            isset = false;
        }
        delete enemy;
        $(".enemyInfo").css("transform", "perspective(900px) rotate3d(0,1,0,-180deg)");
        player.getNewLevel();
        console.log(player);
        printNotification("You defeated opponent!", "both");
        setTimeout(function(){
          mainGameLoop(player)
        }, 3000);
    } else if (player.health <= 0) {
      printNotification("You are unable to survive", "both");
      setTimeout(function(){
        gameStarted = false;
        location.reload();
      }, 3500)
    } else return false;
}

//*************** end attack block ****************//
