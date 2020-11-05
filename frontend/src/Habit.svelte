<script>
  let curr_interval;
  let intervalActive = false;

  document.onkeydown = function (event) {
    console.log(event);
    if (event.key == "Enter") {
      startPauseHabit();
    } else if (event.key == "Backspace") {
      handleDelete(habit.id);
    }
  };

  export let habit;
  export let handleDelete;

  let incompleteStyle =
    "flex justify-center flex-wrap m-2 bg-green-200 rounded relative border";
  let almostCompleteStyle =
    "flex justify-center flex-wrap m-2 bg-yellow-200 rounded relative border";

  let completeStyle =
    "flex justify-center flex-wrap m-2 bg-red-100 border border-red-400 text-red-700 px-2 rounded relative";
  // let completeStyle =
  //   "flex justify-center flex-wrap m-2 bg-red-200 rounded relative border";

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
      var notification = new Notification(`Finished ${habit.name}!`);
    }
  }

  function handleClick() {
    console.log("handleClick");

    habit.duration -= 1;

    if (habit.duration <= 0) {
      clearInterval(curr_interval);
      habit.habitState = habitState.COMPLETE;
      triggerNotification();
      // console.log("habitState = complete");
    } else if (habit.duration <= habit.prevDuration / 3 && habit.duration > 0) {
      habit.habitState = habitState.ALMOSTCOMPLETE;
      // console.log("habitState = almostcomplete");
    } else {
      // console.log("habitState = incomplete");
      habit.habitState = habitState.INCOMPLETE;
    }

    console.log(habit);
    // habit = habit;
    // console.log(currHabitStateCss);
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
    // habit = habit;
  }

  function resetHabit() {
    console.log("resetHabit function");
    clearInterval(curr_interval);
    intervalActive = false;
    habit.duration = habit.prevDuration;
    habit.habitState = habitState.INCOMPLETE;
    // habit = habit;
  }

  let buttonCss =
    "bg-transparent hover:bg-yellow-100 text-grey font-semibold py-2 px-3 border-grey rounded m-2";
</script>

<style>
  .center {
    text-align: center;
    margin: 1em;
    /* border: 3px solid green; */
  }

  .neumorph {
    border-radius: 50px;
    background: #55b9f3;
    box-shadow: 20px 20px 60px #489dcf, -20px -20px 60px #62d5ff;
  }
</style>

<div class={habitStateCss.get(habit.habitState)}>
  <input class="center" bind:value={habit.name} />
  <span class="center">duration (secs):</span>
  <input
    class="center"
    size="2"
    type="text"
    bind:value={habit.duration}
    min="1"
    max="86400"
    pattern="[0-9]*"
    title="Please use a number between 1 and 86,400" />
  <button
    class={buttonCss}
    on:click={startPauseHabit}
    onkeypress={(x) => {
      console.log(x);
    }}>
    {intervalActive == false ? 'Start' : 'Pause'}
  </button>

  <button class={buttonCss} on:click={resetHabit}> Reset </button>
  <button class={buttonCss} on:click={handleDelete(habit.id)}>Delete </button>
</div>
