#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use tauri::api::notification::Notification;

mod cmd;

fn notifyHabitEnd(arg: String) {
    print!("Running rust command, with arg: {}", arg);
    Notification::new()
        .title("Finished {X}")
        .body("Get to it!")
        .show();
}

fn main() {
    tauri::AppBuilder::new()
        .invoke_handler(|_webview, arg| {
            use cmd::Cmd::*;
            match serde_json::from_str(arg) {
                Err(e) => Err(e.to_string()),
                Ok(command) => {
                    match command {
                        // definitions for your custom commands from Cmd here
                        MyCustomCommand { argument } => {
                            //  your command code
                            println!("{}", argument);
                            notifyHabitEnd(argument);
                        }
                    }
                    Ok(())
                }
            }
        })
        .build()
        .run();
}
