<script>
  let curr_interval;
  let intervalActive = false;

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

  let incompleteStyle =
    // "flex justify-center flex-wrap m-0 bg-green-200 rounded relative border";
    "neumorph";
  let almostCompleteStyle =
    // "flex justify-center flex-wrap m-2 bg-yellow-200 rounded relative border";
    "neumorphAlmost";
  let completeStyle =
    // "flex justify-center flex-wrap m-2 bg-red-100 border border-red-400 text-red-700 px-2 rounded relative";
    "neumorphComplete";
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
    display: flex;
    /* align-content: center; */
    border: none;
    padding: 10px;
    margin: 5px;
    border-radius: 12px;
    background: #ffffff;
    box-shadow: inset 5px 5px 20px #d9d9d9, inset -5px -5px 20px #ffffff;
  }

  .neumorphAlmost {
    /* align-content: center; */
    /* content: inherit; */
    /* justify-content: stretch; */
    border: none;
    padding: 10px;
    margin: 5px;
    border-radius: 12px;
    background: #ffff00;
    box-shadow: inset 5px 5px 20px #d9d900, inset -5px -5px 20px #ffff00;
  }

  .neumorphComplete {
    /* align-content: center; */
    /* content: inherit; */
    justify-content: stretch;
    border: none;
    padding: 10px;
    margin: 5px;
    border-radius: 12px;
    background: #ff8080;
    box-shadow: inset 5px 5px 20px #d96d6d, inset -5px -5px 20px #ff9393;
  }
  /* .neumorph:hover {
    background: linear-gradient(145deg, #c2c2c2, #ffffff);
  } */

  .neumorphButton {
    justify-content: stretch;
    /* flex: inherit; */
    flex: auto;
    border: none;
    padding: 6px;
    margin: 2px;
    border-radius: 12px;
    background: #ffffff;
    box-shadow: 5px 5px 20px #d9d9d9, -5px -5px 20px #ffffff;
  }
  .neumorphButton:hover {
    background: linear-gradient(145deg, #d3d3d3, #e6e6e6);
  }

  .neumorphInputField {
    justify-content: stretch;
    /* flex: inherit; */
    flex: auto;
    border: none;
    padding: 6px;
    margin: 0px;
    margin-right: 10px;
    border-radius: 12px;
    background: #ffffff;
    box-shadow: 5px 5px 20px #d9d9d9, -5px -5px 20px #ffffff;
  }
  .neumorphInputField:hover {
    background: linear-gradient(145deg, #e4e4e4, #e6e6e6);
  }
  .textCenter {
    text-align: center;
    /* margin: 0.5em; */
    /* padding: 5px; */
    margin: auto;
    margin-right: 20px;
    /* border: 3px solid green; */
  }
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
    placeholder="900"
    bind:value={habit.duration}
    min="1"
    max="86400"
    pattern="[0-9]*"
    title="Please use a number between 1 and 86,400" />
  <span class="textCenter">seconds</span>
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
