<script>
  // import Tailwindcss from "./Tailwindcss.svelte";

  import * as tauri from "tauri/api/tauri";
  // var invoke = window.__TAURI__.tauri.invoke;

  let curr_interval;
  let intervalActive = false;
  let incompleteStyle =
    "flex flex-wrap px-2 bg-green-100 rounded relative border";
  let completeStyle =
    "flex flex-wrap bg-red-100 border border-red-400 text-red-700 px-2 rounded relative";

  export let habit;
  export let handleDelete;

  function triggerNotification() {
    // tauri.invoke({
    //       cmd: "myCustomCommand",
    //       arg: "My messages from JS",
    //     });
    let permission;

    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
      permission = Notification.requestPermission();
    }

    console.log(Notification.permission);
    console.log(permission);

    if (permission === "granted" || Notification.permission === "granted") {
      var notification = new Notification(`Finished ${habit.name}!`);
    }
  }

  function handleClick() {
    habit.duration -= 1;
    if (habit.duration <= 0) {
      clearInterval(curr_interval);
      habit.complete = true;

      triggerNotification();
    } else {
      habit.complete = false;
    }
  }

  function startPauseHabit() {
    if (intervalActive == true) {
      // pausing
      clearInterval(curr_interval);
      intervalActive = false;
    } else {
      //starting
      habit.prevDuration = habit.duration;
      curr_interval = setInterval(handleClick, 1000);
      intervalActive = true;
    }
  }

  function resetHabit() {
    clearInterval(curr_interval);
    intervalActive = false;
    habit.duration = habit.prevDuration;
    habit.complete = false;
  }
</script>

<style>
  .center {
    text-align: center;
    margin: 1em;
    /* border: 3px solid green; */
  }
</style>

<div class={!habit.complete ? incompleteStyle : completeStyle}>
  <input class="center" bind:value={habit.name} />
  <span class="center">duration (secs):</span>
  <input
    class="center"
    size="2"
    type="text"
    bind:value={habit.duration}
    min="1"
    max="20000" />
  <button
    class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded m-2"
    on:click={startPauseHabit}>
    {intervalActive == false ? 'Start' : 'Pause'}
  </button>

  <button
    class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded m-2"
    on:click={resetHabit}>
    Reset
  </button>
  <button
    class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4
    border-b-4 border-blue-700 hover:border-blue-500 rounded m-2"
    on:click={handleDelete(habit.id)}>Delete
  </button>
</div>
