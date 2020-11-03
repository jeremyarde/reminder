<script lang="ts">
  import Tailwindcss from "./Tailwindcss.svelte";
  import HabitView from "./Habit.svelte";
  import { onMount, onDestroy } from "svelte";
  import * as forage from "localforage";

  // interface IHabit {
  //   id: string;
  //   name: string;
  //   duration: number;
  //   hitCount: number;
  //   complete: boolean;
  // }

  class Habit {
    id: string;
    name: string;
    duration: number;
    hitCount: number;
    complete: boolean;

    public constructor() {
      this.id = create_UUID();
      this.name = "";
      this.duration = 5 * 60;
      this.hitCount = 0;
      this.complete = false;
    }
  }

  forage.config({ name: "HabitReminder" });

  let habits: Map<string, Habit>;
  let habitView: Array<Habit> = [];

  onMount(async () => {
    console.log("onMount triggered");
    habits = await loadHabits();
    await updateHabitView();
  });

  async function saveHabits() {
    console.log("Saving habits");
    await forage.setItem("habits", JSON.stringify([...habits.values()]));
  }

  async function loadHabits(): Promise<Map<string, Habit>> {
    let habitMap: Map<string, Habit> = new Map();

    console.log("Loading habits");

    let loadedHabits: Array<Habit>;

    await forage
      .getItem<string>("habits")
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
    await forage.removeItem("habits");
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
