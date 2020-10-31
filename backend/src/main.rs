#![feature(drain_filter)]

use eyre::Result;

use std::sync::mpsc::Receiver;
use std::thread::sleep;
use std::time::{Duration, Instant};

use std::io::{self};

struct Habit {
    name: String,
    frequency: Duration,
    times_hit: u64,
    last_hit: Instant,
    iterations: u64,
    active: bool,
}


impl Default for Habit {
    fn default() -> Self {
        Habit {
            name: String::from("None"),
            frequency: Duration::new(0, 0),
            times_hit: 0,
            last_hit: Instant::now(),
            iterations: 0,
            active: false,
        }
    }
}

// fn build_habits() -> Vec<Habit>{
//     let habit: Habit = Habit{
//         name: String::from("Pushups"),
//         frequency: Duration::new(5,0),
//         times_hit: 0,
//         last_hit: Instant::now(),
//         iterations: 6,
//         active: true
//     };
//     let mut habits: Vec<Habit> = vec![];
//     habits.push(habit);

//     return habits
// }

fn main_loop(receiver: Receiver<Habit>) {
    let is_running = true;
    // sleep period should be equal to the smallest habit period
    let sleep_period = 0;

    // let mut habits = build_habits();
    let mut habits: Vec<Habit> = vec![];

    // let mut wait_duration = Duration::new(sleep_period, 0);

    while is_running {
        // println!("Done sleeping");
        let curr_time = Instant::now();
        let mut min_wait_duration: Option<Duration> = None;
        // println!("number of habits: {}", habits.len());

        for habit in habits.iter_mut() {
            // if let Some(m) = None {
            //     min_wait_duration = habit.frequency;
            // }
            match min_wait_duration {
                Some(dur) => {
                    if habit.frequency < min_wait_duration.unwrap() {
                        min_wait_duration = Some(habit.frequency);
                        println!("New frequency is faster! Changing sleep time to {}", habit.frequency.as_secs());
                    }
                }
                None => {
                    min_wait_duration = Some(habit.frequency);
                }
            }


            if curr_time.duration_since(habit.last_hit) >= habit.frequency {
                let previous_hit = habit.last_hit;
                habit.last_hit = Instant::now();
                habit.times_hit += 1;

                println!(
                    "{} time! ({}/{})",
                    habit.name, habit.times_hit, habit.iterations
                );
                println!(
                    "{} since last hit",
                    Instant::now().duration_since(previous_hit).as_micros()
                );

                if habit.times_hit >= habit.iterations {
                    habit.active = false;
                }

                if wait_duration < habit.frequency {
                    println!("New wait time: {}", wait_duration.as_secs());
                    wait_duration = habit.frequency;
                }
            }
        }

        habits = habits.drain_filter(|x| x.active).collect();
        // ::<Vec<Habit>>();

        let new_habit = receiver.try_recv().unwrap_or(Habit::default());

        if new_habit.active == true {
            habits.push(new_habit);
            println!("Pushed a new habit")
        }

        sleep(wait_duration);
    }
}

fn get_habit_name() -> Result<String> {
    let mut finished = false;
    let mut name = String::new();
    let mut failed = false;

    while !finished {
        println!("What is the name of the habit?");

        match io::stdin().read_line(&mut name) {
            Ok(_) => {}
            Err(_e) => {
                println!("Error reading from stdin");
                failed = true;
            }
        };

        if !failed {
            name = name.trim().to_string();
            finished = true;
        }
    }

    return Ok(name);
}

fn get_habit_frequency() -> Result<Duration> {
    let mut finished = false;
    let mut frequency: u64;
    let mut duration = Duration::from_secs(0 as u64);
    let mut valid = false;

    while !finished {
        let mut minutes = String::new();
        println!("How often do you want to be reminded (in seconds)?");
        match io::stdin().read_line(&mut minutes) {
            Ok(_) => valid = true,
            Err(_e) => {
                println!("Failed to get frequency");
            }
        }

        if valid == true {
            frequency = match minutes.to_string().trim().parse::<u64>() {
                Ok(f) => f,
                Err(_e) => {
                    println!("Failed to parse frequency, try again");
                    valid = false;
                    0 as u64
                }
            };

            if frequency == 0 {
                finished = false;
            } else {
                duration = Duration::from_secs(frequency);
                finished = true;
            }
        }
    }

    return Ok(duration);
}

fn get_habit_iterations() -> Result<u64> {
    let mut num_iterations = String::new();
    println!("How many times total do you want to be reminded?");
    io::stdin().read_line(&mut num_iterations)?;
    let iterations = num_iterations.trim().parse::<u64>()?;
    return Ok(iterations as u64);
}

fn create_new_habit() -> Result<Habit> {
    let h = Habit {
        name: get_habit_name()?,
        frequency: get_habit_frequency()?,
        last_hit: Instant::now(),
        times_hit: 0,
        iterations: get_habit_iterations()?,
        active: true,
    };

    println!("Created a new habit!");
    return Ok(h);
}

use std::sync::mpsc;
use std::thread;

fn main() {
    //https://doc.rust-lang.org/book/ch16-02-message-passing.html
    let (tx, rx) = mpsc::channel();
    let running: bool = true;

    thread::spawn(move || {
        while running {
            let new_habit = create_new_habit();
            match new_habit {
                Ok(habit) => match tx.send(habit) {
                    Ok(_) => {
                        println!("Sent a new habit to the channel!");
                    }
                    Err(e) => println!("Failed to send the habit with error: {}", e),
                },
                Err(_e) => println!("No new habits"),
            };
        }
    });

    main_loop(rx);
}
