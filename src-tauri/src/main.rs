#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::path::PathBuf;
use tauri::{command, AppHandle, Manager, Runtime};
use tauri::api::dialog::blocking::FileDialogBuilder;

fn get_exe_dir() -> PathBuf {
    std::env::current_exe()
        .ok()
        .and_then(|p| p.parent().map(|d| d.to_path_buf()))
        .unwrap_or_else(|| PathBuf::from("."))
}

#[command]
fn get_exe_dir_cmd() -> String {
    get_exe_dir().to_string_lossy().to_string()
}

#[command]
fn open_ui_dir() -> Result<(), String> {
    let ui_dir = get_exe_dir();
    let path = ui_dir.to_string_lossy().to_string();
    std::process::Command::new("explorer")
        .arg(&path)
        .spawn()
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
fn read_scripts_dir() -> Vec<serde_json::Value> {
    let scripts_dir = get_exe_dir().join("scripts");
    let _ = fs::create_dir_all(&scripts_dir);
    let mut result = Vec::new();
    
    if let Ok(entries) = fs::read_dir(&scripts_dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.extension().map_or(false, |e| e == "lua" || e == "luau" || e == "txt") {
                let name = path
                    .file_name()
                    .unwrap_or_default()
                    .to_string_lossy()
                    .to_string();
                let content = fs::read_to_string(&path).unwrap_or_default();
                result.push(serde_json::json!({
                    "name": name,
                    "content": content,
                    "path": path.to_string_lossy()
                }));
            }
        }
    }
    result
}

#[command]
fn read_script_file(path: String) -> Result<String, String> {
    fs::read_to_string(&path).map_err(|e| e.to_string())
}

#[command]
fn write_script_file(path: String, content: String) -> Result<(), String> {
    fs::write(&path, content).map_err(|e| e.to_string())
}

#[command]
async fn save_script(app: tauri::AppHandle, name: String, content: String) -> Result<String, String> {
    let default_dir = get_exe_dir().join("scripts");
    let _ = fs::create_dir_all(&default_dir);

    // In Tauri v1, we use the api::dialog module
    // In Tauri v1, we use the api::dialog module
    let file_path = FileDialogBuilder::new()
        .set_directory(&default_dir)
        .set_file_name(&name)
        // Add the filters here
        .add_filter("Script Files", &["lua", "luau", "txt"])
        //.add_filter("All Files", &["*"]) 
        .save_file();

  
    match file_path {
        Some(path) => {
            fs::write(&path, content).map_err(|e| e.to_string())?;
            Ok(path.to_string_lossy().to_string())
        }
        None => Err("Save cancelled".into()),
    }
}

fn default_settings() -> serde_json::Value {
    serde_json::json!({
        "outputRedirection": true,
        "topmost": false,
        "antiAFK": true,
        "internalUIDisabled": false,
        "fontSize": 14,
        "wordWrap": "off"
    })
}

#[command]
fn load_settings() -> serde_json::Value {
    let settings_dir = get_exe_dir().join("settings");
    let file = settings_dir.join("settings.json");
    if let Ok(content) = fs::read_to_string(&file) {
        serde_json::from_str(&content).unwrap_or_else(|_| default_settings())
    } else {
        default_settings()
    }
}

#[command]
fn save_settings(settings: serde_json::Value) -> Result<(), String> {
    let settings_dir = get_exe_dir().join("settings");
    let _ = fs::create_dir_all(&settings_dir);
    let file = settings_dir.join("settings.json");
    let content = serde_json::to_string_pretty(&settings).map_err(|e| e.to_string())?;
    fs::write(file, content).map_err(|e| e.to_string())
}

#[command]
async fn minimize_window(window: tauri::Window) {
    let _ = window.minimize();
}

#[command]
async fn maximize_window(window: tauri::Window) {
    if window.is_maximized().unwrap_or(false) {
        let _ = window.unmaximize();
    } else {
        let _ = window.maximize();
    }
}

#[command]
async fn close_window(window: tauri::Window) {
    let _ = window.close();
}

#[command]
async fn set_always_on_top(window: tauri::Window, on_top: bool) {
    let _ = window.set_always_on_top(on_top);
}

#[command]
fn open_scripts_folder() -> Result<(), String> {
    let scripts_dir = get_exe_dir().join("scripts");
    let _ = fs::create_dir_all(&scripts_dir);
    let path = scripts_dir.to_string_lossy().to_string();

    #[cfg(target_os = "windows")]
    {
        std::process::Command::new("explorer")
            .arg(&path)
            .spawn()
            .map_err(|e| e.to_string())?;
    }
    #[cfg(target_os = "macos")]
    {
        std::process::Command::new("open")
            .arg(&path)
            .spawn()
            .map_err(|e| e.to_string())?;
    }
    #[cfg(target_os = "linux")]
    {
        std::process::Command::new("xdg-open")
            .arg(&path)
            .spawn()
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[command]
fn launch_rbxproc() {
    open::that("roblox-player://").expect("Failed to open URI");
}

fn main() {
    tauri::Builder::default()
       
        .invoke_handler(tauri::generate_handler![
            launch_rbxproc,
            open_ui_dir,
            get_exe_dir_cmd,
            read_scripts_dir,
            read_script_file,
            write_script_file,
            save_script,
            load_settings,
            save_settings,
            minimize_window,
            maximize_window,
            close_window,
            set_always_on_top,
            open_scripts_folder,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}