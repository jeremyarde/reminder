<script>
  import Tailwindcss from "./Tailwindcss.svelte";
  import { onDestroy } from "svelte";

  let duration = 5 * 60;
  let complete = false;
  let prevDuration = duration;
  let habit;
  let elapsed = 0;
  let count = 0;
  let curr_interval;
  let intervalActive = false;
  let incompleteStyle =
    "flex flex-wrap px-2 bg-green-100 rounded relative border";
  let completeStyle =
    "flex flex-wrap bg-red-100 border border-red-400 text-red-700 px-2 rounded relative";

  function handleClick() {
    duration -= 1;
    if (duration <= 0) {
      clearInterval(curr_interval);
      complete = true;
    } else {
      complete = false;
    }
  }
</script>

<style>
  .center {
    text-align: center;
    margin: 1em;
    /* border: 3px solid green; */
  }
</style>

<div class={!complete ? incompleteStyle : completeStyle}>
  <input class="center" bind:value={habit} />
  <span class="center">duration (seconds):</span>
  <input
    class="center"
    size="2"
    type="text"
    bind:value={duration}
    min="1"
    max="20000" />
  <div class="center">{elapsed.toFixed(1)}s</div>
  <button
    class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded m-2"
    on:click={() => {
      if (intervalActive == true) {
        // pausing
        clearInterval(curr_interval);
        intervalActive = false;
      } else {
        //starting
        prevDuration = duration;
        curr_interval = setInterval(handleClick, 1000);
        intervalActive = true;
      }
    }}>
    {intervalActive == false ? 'Start' : 'Pause'}
  </button>

  <button
    class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded m-2"
    on:click={() => {
      clearInterval(curr_interval);
      intervalActive = false;
      duration = prevDuration;
      complete = false;
    }}>
    Reset
  </button>
</div>
