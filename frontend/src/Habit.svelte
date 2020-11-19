<script>
  let curr_interval;
  let intervalActive = false;

  import { tweened } from "svelte/motion";
  import { cubicOut, linear } from "svelte/easing";
  import { writable } from "svelte/store";

  // TODO: when two tasks are made, and editting the first one, pressing enter starts the second one
  document.onkeydown = function (event) {
    console.log(event);
    if (event.key == "Enter") {
      startPauseHabit();
    }
    // else if (event.key == "Backspace") {
    //   handleDelete(habit.id);
    // }
  };

  export let habit;
  export let handleDelete;

  const progress = tweened(0, {
    duration: 1000,
    easing: linear,
  });
  var progress_val = 0;
  var progress_color;

  let incompleteStyle =
    // "flex justify-center flex-wrap m-0 bg-green-200 rounded relative border";
    "neumorph flex flex-wrap justify-around";
  let almostCompleteStyle =
    // "flex justify-center flex-wrap m-2 bg-yellow-200 rounded relative border";
    "neumorph flex flex-wrap justify-around";
  let completeStyle =
    // "flex justify-center flex-wrap m-2 bg-red-100 border border-red-400 text-red-700 px-2 rounded relative";
    "neumorph flex flex-wrap justify-around";
  const habitState = {
    COMPLETE: "complete",
    ALMOSTCOMPLETE: "almostComplete",
    INCOMPLETE: "incomplete",
  };

  let habitStateCss = new Map();
  habitStateCss.set(habitState.COMPLETE, completeStyle);
  habitStateCss.set(habitState.INCOMPLETE, incompleteStyle);
  habitStateCss.set(habitState.ALMOSTCOMPLETE, almostCompleteStyle);

  function triggerNotification() {
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
      var notification = new Notification(`${habit.name} timer is up!`);
    }
  }

  function handleClick() {
    console.log("handleClick");

    habit.duration -= 1;
    // progress.set(habit.duration);
    // progress_val += 1;
    // await progress.update(progress_val);
    // console.log(progress_val);
    // progress_val += 1;

    progress_val += 1;

    console.log(progress_val / habit.duration);
    progress.set(progress_val / habit.prevDuration);

    if (habit.duration <= 0) {
      clearInterval(curr_interval);
      habit.habitState = habitState.COMPLETE;
      progress_color = "progressComplete";
      triggerNotification();
    } else if (habit.duration <= habit.prevDuration / 3 && habit.duration > 0) {
      habit.habitState = habitState.ALMOSTCOMPLETE;
      progress_color = "progressAlmost";
    } else {
      habit.habitState = habitState.INCOMPLETE;
      progress_color = "progressIncomplete";
    }
  }

  function startPauseHabit() {
    console.log("startPauseHabit");
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
    console.log("resetHabit function");
    clearInterval(curr_interval);
    intervalActive = false;
    habit.duration = habit.prevDuration;
    habit.habitState = habitState.INCOMPLETE;
    progress_color = "progressIncomplete";

    progress_val = 0;
    progress.set(progress_val);
  }

  let buttonCss =
    "bg-transparent hover:bg-yellow-100 text-grey font-semibold py-2 px-3 border-grey rounded m-2";
</script>

<style>
  .center {
    text-align: center;
    margin: auto;
  }

  .neumorph {
    border: none;
    padding: 5px;
    margin: 8px;
    border-radius: 8px;
    box-shadow: 3px 3px 10px #d9d9d9, -3px -3px 10px #ffffff;
  }

  .neumorphAlmost {
    border: none;
    padding: 10px;
    margin: 5px;
    border-radius: 8px;
  }

  .neumorphComplete {
    border: none;
    padding: 10px;
    margin: 5px;
    border-radius: 8px;
  }

  .neumorphButton {
    border: none;
    padding: 5px;
    margin: 2px;
    border-radius: 8px;
    box-shadow: 3px 3px 10px #d9d9d9, -3px -3px 10px #ffffff;
  }

  .neumorphButton:hover {
    background: #d9d9d9;
  }

  .neumorphInputField {
    justify-content: stretch;
    max-width: 200px;
    min-width: 40px;
    flex: auto;
    margin-right: 10px;

    border: none;
    padding: 5px;
    margin: 5px;
    border-radius: 8px;
    background: #ebebeb;
    box-shadow: inset 2px 2px 2px #d9d9d9, inset -2px -2px 2px #ffffff;
  }
  .neumorphInputField:hover {
    background: #d9d9d9;
  }
  .textCenter {
    margin-right: 20px;
  }

  progress {
    -webkit-transition: width 0.5s linear;
    -moz-transition: width 0.5s linear;
    -o-transition: width 0.5s linear;
    transition: width 0.5s linear;
    /* min-width: 40px; */
    width: 20%;
    padding: 2px;
    margin: 5px;
    /* border-radius: 8px; */
    box-shadow: inset 2px 2px 2px #d9d9d9, inset -2px -2px 2px #ffffff;
  }

  /* progress::-webkit-progress-bar {
    background-color: #50dd33;
    border-radius: 8px;
    box-shadow: 1px 1px 5px 3px rgba(255, 0, 0, 0.8);
  }
  progress::-webkit-progress-value {
    background-color: #50dd33;
    border-radius: 8px;
    /* box-shadow: 1px 1px 5px 3px rgba(255, 0, 0, 0.8); */

  progress.progressIncomplete::-moz-progress-bar,
  progress.progressIncomplete::-webkit-progress-bar {
    background-color: #50dd33;
    /* border-radius: 8px; */
    /* padding: 5px; */
    /* margin: 5px; */
  }

  progress.progressAlmost::-moz-progress-bar,
  progress.progressAlmost::-webkit-progress-bar {
    background-color: #ddda33;
    /* border-radius: 8px; */
  }

  progress.progressComplete::-moz-progress-bar,
  progress.progressComplete::-webkit-progress-bar {
    background-color: #ca2727;
    /* border-radius: 8px; */
  }

  .float {
    position: fixed;
    width: 60px;
    height: 60px;
    bottom: 40px;
    right: 40px;
    background-color: #0c9;
    color: #fff;
    border-radius: 50px;
    text-align: center;
    box-shadow: 2px 2px 3px #999;
  }
</style>

<div class={habitStateCss.get(habit.habitState)}>
  <!-- <div class="neumorph center"> -->
  <input
    class="center neumorphInputField"
    placeholder="Habit Name"
    bind:value={habit.name} />
  <!-- <span class="center">seconds:</span> -->
  <input
    class="center neumorphInputField"
    size="2"
    type="text"
    placeholder="900 (s)"
    bind:value={habit.duration}
    min="1"
    max="86400"
    pattern="[0-9]*"
    title="Please use a number between 1 and 86,400" />
  <progress class={progress_color} value={$progress} />
  <!-- <meter value={$progress_val} min={0} max={habit.duration} /> -->
  <div class="flex">
    <button
      class="neumorphButton"
      on:click={startPauseHabit}
      onkeypress={(x) => {
        console.log(x);
        startPauseHabit();
      }}>
      {intervalActive == false ? 'Start' : 'Pause'}
    </button>
    <button class="neumorphButton" on:click={resetHabit}>Reset</button>
    <button class="neumorphButton" on:click={handleDelete(habit.id)}>Delete
    </button>
  </div>
</div>
