<script>
  let curr_interval;
  let intervalActive = false;

  import { tweened } from "svelte/motion";
  import { cubicOut, linear } from "svelte/easing";
  import { writable } from "svelte/store";

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

  // const progress = writable(0);
  const progress = tweened(0, {
    duration: 1000,
    easing: linear,
  });
  var progress_val = 0.0;

  let incompleteStyle =
    // "flex justify-center flex-wrap m-0 bg-green-200 rounded relative border";
    "neumorph flex flex-wrap justify-around";
  let almostCompleteStyle =
    // "flex justify-center flex-wrap m-2 bg-yellow-200 rounded relative border";
    "neumorphAlmost flex flex-wrap justify-around";
  let completeStyle =
    // "flex justify-center flex-wrap m-2 bg-red-100 border border-red-400 text-red-700 px-2 rounded relative";
    "neumorphComplete flex flex-wrap justify-around";
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
      triggerNotification();
    } else if (habit.duration <= habit.prevDuration / 3 && habit.duration > 0) {
      habit.habitState = habitState.ALMOSTCOMPLETE;
    } else {
      habit.habitState = habitState.INCOMPLETE;
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
    progress_val = 0;
    progress.set(progress_val);
  }

  let buttonCss =
    "bg-transparent hover:bg-yellow-100 text-grey font-semibold py-2 px-3 border-grey rounded m-2";
</script>

<style>
  .center {
    text-align: center;
    /* margin: 0.5em; */
    margin: auto;
    /* border: 3px solid green; */
  }

  .neumorph {
    /* align-content: center; */
    /* content: inherit; */
    /* justify-content: stretch; */
    /* flex: auto; */
    /* justify-content: space-between; */
    /* display: flex; */
    /* align-content: center; */
    /* flex: auto; */
    /* border: none;
    padding: 10px;
    margin: 5px;
    border-radius: 12px;
    background: #e6e6e6;
    box-shadow: inset 2px 2px 5px #757575, inset -2px -2px 5px #c0c0c0; */

    border: none;
    padding: 5px;
    margin: 5px;
    border-radius: 12px;
    /* background: linear-gradient(145deg, #d6d6d6, #ffffff); */
    /* box-shadow: 5px 5px 5px #d9d9d9, -5px -5px 5px #ffffff; */
    box-shadow: 3px 3px 10px #d9d9d9, -3px -3px 10px #ffffff;
  }

  .neumorphAlmost {
    /* align-content: center; */
    /* content: inherit; */
    /* justify-content: stretch; */
    border: none;
    padding: 10px;
    margin: 5px;
    border-radius: 12px;
    background: #fdfdd6;
    box-shadow: inset 5px 5px 5px #f3e415,
      inset -5px -5px 5px rgb(251, 253, 150);
  }

  .neumorphComplete {
    /* align-content: center; */
    /* content: inherit; */
    /* justify-content: stretch; */
    border: none;
    padding: 10px;
    margin: 5px;
    border-radius: 12px;
    /* background: linear-gradient(145deg, #ff6666, #ff6d6d); */
    background: #ffcdcd;
    box-shadow: inset 5px 5px 5px #ff5a5a, inset -5px -5px 5px #ff8a8a;
  }
  /* .neumorph:hover {
    background: linear-gradient(145deg, #c2c2c2, #ffffff);
  } */

  .neumorphButton {
    border: none;
    padding: 5px;
    margin: 5px;
    border-radius: 12px;
    /* background: linear-gradient(145deg, #d6d6d6, #ffffff); */
    /* box-shadow: 5px 5px 5px #d9d9d9, -5px -5px 5px #ffffff; */
    box-shadow: 3px 3px 10px #d9d9d9, -3px -3px 10px #ffffff;
  }

  .neumorphButton:hover {
    /* background: linear-gradient(145deg, #d4d4d4, #ffffff); */
    background: #d9d9d9;
  }

  .neumorphInputField {
    justify-content: stretch;
    /* flex: inherit; */
    max-width: 200px;
    min-width: 40px;
    flex: auto;
    margin-right: 10px;

    border: none;
    padding: 5px;
    margin: 5px;
    border-radius: 12px;
    /* background: linear-gradient(145deg, #d6d6d6, #ffffff); */
    /* box-shadow: 5px 5px 5px #d9d9d9, -5px -5px 5px #ffffff; */
    box-shadow: 3px 3px 10px #d9d9d9, -3px -3px 10px #ffffff;
  }
  .neumorphInputField:hover {
    background: #d9d9d9;
  }
  .textCenter {
    /* text-align: center;
    justify-content: inherit; */
    /* margin: 0.5em; */
    /* padding: 5px; */
    /* margin: auto; */
    margin-right: 20px;
    /* border: 3px solid green; */
  }

  progress {
    -webkit-transition: width 0.5s linear;
    -moz-transition: width 0.5s linear;
    -o-transition: width 0.5s linear;
    transition: width 0.5s linear;
    /* padding: 5px; */
    margin: 5px;
    border-radius: 12px;
    box-shadow: inset 2px 2px 2px #d9d9d9, inset -2px -2px 2px #ffffff;
  }

  progress::-webkit-progress-bar {
    background-color: rgb(83, 83, 75);
    border-radius: 7px;
  }
  progress::-webkit-progress-value {
    background-color: rgb(255, 251, 0);
    border-radius: 7px;
    box-shadow: 1px 1px 5px 3px rgba(255, 0, 0, 0.8);
  }
  progress::-moz-progress-bar {
    /* style rules */
  }

  /* progress[value] {
    background-color: #eee;
    border-radius: 2px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25) inset;
  } */
</style>

<!-- class={buttonCss} -->

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
  <progress value={$progress} />
  <!-- <meter value={$progress_val} min={0} max={habit.duration} /> -->
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
