<script>
  import Tailwindcss from "./Tailwindcss.svelte";
  import HabitView from "./Habit.svelte";
  import { onMount } from "svelte";
  import localforage from "localforage";

  const habitState = {
    COMPLETE: "complete",
    ALMOSTCOMPLETE: "almostComplete",
    INCOMPLETE: "incomplete",
  };

  class Habit {
    constructor() {
      this.id = create_UUID();
      this.name = "";
      this.duration = null;
      this.hitCount = 0;
      this.habitState = habitState.INCOMPLETE;
    }
  }

  // localforage.config({ name: "HabitReminder" });

  let habits;
  let habitView = [];

  onMount(async () => {
    console.log("onMount triggered");
    habits = await loadHabits();
    await updateHabitView();
  });

  async function saveHabits() {
    console.log("Saving habits");
    await localforage.setItem("habits", JSON.stringify([...habits.values()]));
  }

  async function loadHabits() {
    let habitMap = new Map();

    console.log("Loading habits");

    let loadedHabits;

    await localforage
      .getItem("habits")
      .then((value) => {
        loadedHabits = JSON.parse(value);
        if (loadedHabits.length != 0) {
          for (let val of loadedHabits) {
            habitMap.set(val.id, val);
          }
        } else {
          habitMap = new Map();
        }
      })
      .catch((err) => {
        console.log(err);
        loadedHabits = new Array();
        habitMap = new Map();
      });

    console.log("Loaded objects:");
    console.log("loadedHabits:");
    console.log(loadedHabits);
    console.log("HabitMap:");
    console.log(habitMap);

    return habitMap;
  }

  function create_UUID() {
    var dt = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
    return uuid;
  }

  function addHabit() {
    let newHabit = new Habit();
    console.log("addHabit");
    console.log(habits);
    habits.set(newHabit.id, newHabit);
    updateHabitView();
  }

  async function resetHabits() {
    await localforage.removeItem("habits");
    habits = new Map();
    updateHabitView();
  }

  function deleteHabit(habitId) {
    console.log(JSON.stringify(habits.get(habitId)));
    habits.delete(habitId);
    updateHabitView();
  }

  function updateHabitView() {
    habitView = Array.from(habits.values());
    saveHabits();
  }
</script>

<style>
  .neumorphButton {
    border: none;
    padding: 5px;
    margin: 5px;
    border-radius: 12px;
    background: linear-gradient(145deg, #d6d6d6, #ffffff);
    box-shadow: 5px 5px 5px #d9d9d9, -5px -5px 5px #ffffff;
  }
  .neumorphButton:hover {
    background: linear-gradient(145deg, #c2c2c2, #ffffff);
  }
</style>

<!-- class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded m-2" -->

<main charset="UTF-8">
  {#each habitView as habit}
    <HabitView {habit} handleDelete={deleteHabit} />
  {/each}
  <div class="flex justify-center">
    <button class="neumorphButton" on:click={addHabit}> New habit </button>
    <button class="neumorphButton" on:click={resetHabits}>
      Reset habits
    </button>
    <button class="neumorphButton" on:click={saveHabits}> Save habits </button>
  </div>
</main>
