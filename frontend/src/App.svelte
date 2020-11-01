<script>
  import Tailwindcss from "./Tailwindcss.svelte";
  import HabitView from "./Habit.svelte";
  // import Habit from "./Habit.svelte";

  let habits = new Map();
  let habitView = [];

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
    // habits = [...habits, new Habit()];
    let newHabit = new Habit();
    habits.set(newHabit.id, newHabit);
    // habit = habit.set();
    console.log(habits);
    // console.log([...habits]);
    console.log(Array.from(habits.values()));
    updateHabitView();
  }

  function resetHabits() {
    habits = new Map();
    console.log(habits);
    updateHabitView();
  }

  function deleteHabit(habitId) {
    // console.log();
    // habits = habits.splice(index);
    habits.delete(habitId);
    console.log(habitId);
    console.log("deleteHabit");
    console.log(habits);
    updateHabitView();
  }

  function updateHabitView() {
    habitView = Array.from(habits.values());
  }
</script>

<main>
  {#each habitView as habit}
    <HabitView {habit} handleDelete={deleteHabit} />
  {/each}

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
</main>
