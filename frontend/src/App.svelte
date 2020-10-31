<script>
  import Tailwindcss from "./Tailwindcss.svelte";
  import Habit from "./Habit.svelte";

  let habits = [];

  function addHabit() {
    habits = [...habits, 1];
    console.log(habits);
  }

  function resetHabits() {
    habits = [];
    console.log(habits);
  }
</script>

<main>
  {#each habits as habit}
    <Habit />
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
