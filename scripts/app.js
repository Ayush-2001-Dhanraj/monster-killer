const PLAYER_ATTACK_VALUE = 10; //global value that is hardcoded by convention must be in Cap
const MONSTER_ATTACK_VALUE = 14;
const STRONG_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

const MODE_ATTACK = "ATTACK"; //mode = 0
const MODE_STRONG_ATTACK = "STRONG_ATTACK"; //mode = 1

const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";
const battleLog = [];

function getMaxLifeValue() {
  let parsedValue = parseInt(
    prompt("Maximum life for you and the monster", "100")
  );
  if (isNaN(parsedValue) || parsedValue <= 0) {
    throw { message: "Invalid life input, can't be be used!!!!" };
  }
  return parsedValue;
}
let choosenMaxHealth;
try {
  choosenMaxHealth = getMaxLifeValue();
} catch (err) {
  console.log(err);
  choosenMaxHealth = 100;
  alert("You entered something wrong, using default health = 100.");
}
let currentMonsterHealth = choosenMaxHealth;
let currentPlayerHealth = choosenMaxHealth;
let hasBonusLife = true;

adjustHealthBars(choosenMaxHealth);

function writeLogEntry(event, val, monsterHealth, playerHealth) {
  let logEntry = {
    event: event,
    value: val,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth,
  };
  if (
    event === LOG_EVENT_PLAYER_ATTACK ||
    event === LOG_EVENT_PLAYER_STRONG_ATTACK
  ) {
    logEntry.target = "Monster";
  } else if (
    event === LOG_EVENT_MONSTER_ATTACK ||
    event === LOG_EVENT_PLAYER_HEAL
  ) {
    logEntry.target = "Player";
  } else if (event === LOG_EVENT_GAME_OVER) {
  } else {
    return;
  }
  battleLog.push(logEntry);
}

function reset() {
  currentMonsterHealth = choosenMaxHealth;
  currentPlayerHealth = choosenMaxHealth;
  alert("Resetting the game!");
  resetGame(choosenMaxHealth);
  addBonusLife();
}

function endRound() {
  const initialPlayerHealth = currentPlayerHealth;
  const monsterDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= monsterDamage;

  writeLogEntry(
    LOG_EVENT_MONSTER_ATTACK,
    monsterDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );

  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    currentPlayerHealth = initialPlayerHealth;
    alert(
      "You just would have been dead but you got lucky b/c of your bonus life"
    );
    removeBonusLife();
    setPlayerHealth(currentPlayerHealth);
  }

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("You won!");
    writeLogEntry(
      LOG_EVENT_GAME_OVER,
      "player_won",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert("You lost!");
    writeLogEntry(
      LOG_EVENT_GAME_OVER,
      "Monster_won",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    alert("It is a Draw!");
    writeLogEntry(
      LOG_EVENT_GAME_OVER,
      "Draw",
      currentMonsterHealth,
      currentPlayerHealth
    );
  }
  if (currentPlayerHealth <= 0 || currentMonsterHealth <= 0) {
    reset();
  }
}

function attackMonster(mode) {
  const damageValue =
    mode === MODE_ATTACK ? PLAYER_ATTACK_VALUE : MONSTER_ATTACK_VALUE;
  const logEvent = MODE_ATTACK
    ? LOG_EVENT_PLAYER_ATTACK
    : LOG_EVENT_PLAYER_STRONG_ATTACK;
  // if (mode === "ATTACK") {
  //   damageValue = PLAYER_ATTACK_VALUE;
  //   logEvent = LOG_EVENT_PLAYER_ATTACK;
  // } else if (mode === "STRONG_ATTACK") {
  //   damageValue = MONSTER_ATTACK_VALUE;
  //   logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
  // }
  const playerDamage = dealMonsterDamage(damageValue);
  currentMonsterHealth -= playerDamage;
  writeLogEntry(
    logEvent,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
}

function attackHandler() {
  if (currentPlayerHealth <= 0) {
    alert("You are Dead!");
    return;
  } else if (currentMonsterHealth <= 0) {
    alert("Monster is dead. Stop Attacking him!");
    return;
  }
  attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
  if (currentPlayerHealth <= 0) {
    alert("You are Dead!");
    return;
  } else if (currentMonsterHealth <= 0) {
    alert("Monster is dead. Stop Attacking him!");
    return;
  }
  attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler() {
  let healValue;
  if (currentMonsterHealth <= 0) {
    alert("You have already killed monster no need of heal");
  } else if (currentPlayerHealth <= 0) {
    alert("You are dead!! No option of heal");
  } else {
    if (currentPlayerHealth >= choosenMaxHealth - HEAL_VALUE) {
      alert(
        "You can't heal to more than your max initial health. But now monster will attack you."
      );
      alert("Stupid 😱");
      healValue = choosenMaxHealth - currentPlayerHealth;
    } else {
      healValue = HEAL_VALUE;
    }
    increasePlayerHealth(healValue);
    currentPlayerHealth += healValue;
    writeLogEntry(
      LOG_EVENT_PLAYER_HEAL,
      healValue,
      currentMonsterHealth,
      currentPlayerHealth
    );
    endRound();
  }
}

function printLogHandler() {
  let i = 0;
  battleLog.forEach(function (element) {
    console.log(`-----------`);
    console.log(`#${i}`);
    //console.log(element);
    for (const key in element) {
      if (element.hasOwnProperty(key)) {
        const value = element[key];
        console.log(`${key} : ${value}`);
      }
    }
    i++;
  });
  //console.log(battleLog);
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
