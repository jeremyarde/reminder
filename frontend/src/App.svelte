<script>
  import Tailwindcss from "./Tailwindcss.svelte";
  import HabitView from "./Habit.svelte";
  import { onMount, onDestroy } from "svelte";

  let habits = loadHabits();
  let habitView = [];
  updateHabitView();

  // import Habit from "./Habit.svelte";

  // if (typeof Storage !== "undefined") {
  //   // Code for localStorage/sessionStorage.
  //   console.log("we have localstorage");
  // } else {
  //   console.log("we have no storage support");
  // }

  onMount(async () => {
    console.log("onMount triggered");
    loadHabits();
  });

  // onDestroy(async () => {
  //   console.log("onDestroy triggered");
  //   saveHabits();
  // });

  function saveHabits() {
    // if (typeof Storage !== "undefined") {
    //   // Code for localStorage/sessionStorage.
    //   console.log("we have localstorage");
    // } else {
    //   console.log("we have no storage support");
    // }

    console.log("Saving habits");
    // console.log([...habits.values()]);
    // console.log(JSON.stringify(habits.entries()));
    localStorage.setItem("habits", JSON.stringify([...habits.values()]));
  }

  function loadHabits() {
    let habitMap;

    console.log("Loading habits");
    let loadedHabits = localStorage.getItem("habits");

    // loadedHabits.forEach((element) => {});
    // (element) => {
    //   JSON.parse(element);
    // };
    console.log(loadedHabits);
    console.log(JSON.parse(loadedHabits));
    loadedHabits = JSON.parse(loadedHabits);
    console.log("is habits a map?");

    console.log(loadedHabits !== typeof Map);
    if (loadedHabits === null) {
      habitMap = new Map();
    } else if (typeof loadHabits === typeof Array) {
      console.log("is list");
      habitMap = new Map();
      loadedHabits.forEach((element) => {
        habitMap.set(element.id, element);
      });
    }

    console.log(habitMap);
    return habitMap;
  }

  class Habit {
    constructor() {
      this.id = create_UUID();
      this.name = "";
      this.duration = 5 * 60;
      this.hitCount = 0;
      this.complete = false;
    }
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
    habits.set(newHabit.id, newHabit);
    updateHabitView();
  }

  function resetHabits() {
    localStorage.removeItem("habits");
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

<main>
  {#each habitView as habit}
    <HabitView {habit} handleDelete={deleteHabit} />
  {/each}
  <div class="flex justify-center">
    <button
      class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded m-2"
      on:click={addHabit}>
      Create new habit
    </button>
    <button
      class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded m-2"
      on:click={resetHabits}>
      Reset habits
    </button>
    <button
      class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded m-2"
      on:click={saveHabits}>
      Save habits
    </button>
  </div>
</main>
