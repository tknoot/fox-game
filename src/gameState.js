import { modFox, modScene, togglePoopBag } from "./ui";
import {
  RAIN_CHANCE,
  SCENES,
  DAY_LENGTH,
  NIGHT_LENGTH,
  getNextHungerTime,
  getNextDieTime,
  getNextPoopTime,
} from "./constants";

// using a disconnected timer from endCelebrate for the poop bag anim is required to avoid a bug when transitioning to night time during celebration

const gameState = {
  current: "INIT",
  clock: 1,
  wakeTime: -1,
  sleepTime: -1,
  hungryTime: -1,
  poopTime: -1,
  timeToStartCelebrating: -1,
  timeToEndCelebrating: -1,
  dieTime: -1,
  scene: -1,
  tick() {
    this.clock++;
    console.log("clock", this.clock);

    if (this.clock === this.wakeTime) {
      this.wake();
    } else if (this.clock === this.sleepTime) {
      this.sleep();
    } else if (this.clock === this.hungryTime) {
      this.getHungry();
    } else if (this.clock === this.dieTime) {
      this.die();
    } else if (this.clock === this.timeToStartCelebrating) {
      this.startCelebrating();
    } else if (this.clock === this.timeToEndCelebrating) {
      this.endCelebrating();
    } else if (this.clock === this.poopTime) {
      this.poop();
    }

    return this.clock;
  },
  startGame() {
    this.current = "HATCHING";
    this.wakeTime = this.clock + 3;
    modFox("egg");
    modScene("day");
  },
  wake() {
    this.current = "IDLING";
    this.wakeTime = -1;
    this.sleepTime = this.clock + DAY_LENGTH;
    this.hungryTime = getNextHungerTime(this.clock);
    this.scene = Math.random() > RAIN_CHANCE ? 0 : 1;
    modScene(SCENES[this.scene]);
    this.determineFoxState();
  },
  sleep() {
    this.current = "SLEEP";
    this.sleepTime = -1;
    this.dieTime = -1;
    this.wakeTime = this.clock + NIGHT_LENGTH;
    modFox("sleep");
    modScene("night");
    this.scene = 2;
  },
  getHungry() {
    this.current = "HUNGRY";
    this.hungryTime = -1;
    this.dieTime = getNextDieTime(this.clock);
    modFox("hungry");
  },
  cleanUpPoop() {
    if (this.current != "POOPING") {
      return;
    } else {
      this.startCelebrating();
      this.dieTime = -1;
      this.hungryTime = getNextHungerTime(this.clock);
      togglePoopBag(true);
    }
  },
  feed() {
    if (this.current != "HUNGRY") {
      return;
    } else {
      this.current = "FEEDING";
      this.dieTime = -1;
      this.poopTime = getNextPoopTime(this.clock);
      this.timeToStartCelebrating = this.clock + 2;
      modFox("eating");
    }
  },
  startCelebrating() {
    this.current = "CELEBRATING";
    this.timeToStartCelebrating = -1;
    this.timeToEndCelebrating = this.clock + 2;
    modFox("celebrate");
  },
  endCelebrating() {
    this.current = "IDLING";
    this.timeToEndCelebrating = -1;
    this.determineFoxState();
    togglePoopBag(false);
  },
  determineFoxState() {
    if (this.current === "IDLING") {
      if (SCENES[this.scene] === "day") {
        modFox("idling");
      } else {
        modFox("rain");
      }
    }
  },
  poop() {
    this.current = "POOPING";
    this.poopTime = -1;
    this.dieTime = getNextDieTime(this.clock);
    modFox("pooping");
  },
  die() {
    console.log("wasted");
  },
  handleUserAction(icon) {
    if (
      ["SLEEP", "FEEDING", "CELEBRATING", "HATCHING"].includes(this.current)
    ) {
      return;
    }

    if (this.current === "INIT" || this.current === "DEAD") {
      this.startGame();
      return;
    }

    switch (icon) {
      case "weather":
        this.changeWeather();
        break;
      case "poop":
        this.cleanUpPoop();
        break;
      case "fish":
        this.feed();
        break;
    }
  },
  changeWeather() {
    if (SCENES[this.scene] === "night") {
      return;
    } else if (this.scene === 0) {
      this.scene = 1;
      modScene(SCENES[this.scene]);
      this.determineFoxState();
    } else if (this.scene === 1) {
      this.scene = 0;
      modScene(SCENES[this.scene]);
      this.determineFoxState();
    }
  },
};

export const handleUserAction = gameState.handleUserAction.bind(gameState);
export default gameState;
