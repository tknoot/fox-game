import { modFox, modScene } from "./ui";
import { RAIN_CHANCE, SCENES } from "./constants";

const gameState = {
  current: "INIT",
  clock: 1,
  wakeTime: -1,
  scene: -1,
  tick() {
    this.clock++;
    console.log("clock", this.clock);

    if (this.clock === this.wakeTime) {
      this.wake();
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
    modFox("idling");
    this.scene = Math.random() > RAIN_CHANCE ? 0 : 1;
    modScene(SCENES[this.scene]);
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
    // let gameElement = document.querySelector(".game");
    // if (this.weather === "day") {
    //   this.weather = "night";
    //   gameElement.classList.toggle("day", false);
    //   gameElement.classList.toggle("night", true);
    // } else {
    //   this.weather = "day";
    //   gameElement.classList.toggle("day", true);
    //   gameElement.classList.toggle("night", false);
    // }
  },
  cleanUpPoop() {
    console.log("clean poop");
  },
  feed() {
    console.log("feed");
  },
};

export const handleUserAction = gameState.handleUserAction.bind(gameState);
export default gameState;
