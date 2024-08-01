const local_storage 	= chrome.storage.local;
const storage_onchange 	= chrome.storage.onChanged;
const extension_info 	= chrome.runtime.getManifest ();
const GLOBALS 			= 
{
	context_menus 			: chrome.contextMenus,
	identity 				: chrome.identity,
	tabs 					: chrome.tabs,
	extension_icon 			: chrome.runtime.getURL( "/assets/logo/logo.svg" ),
	extension_name 			: extension_info.name,
	extension_description 	: extension_info.description,
	extension_version		: extension_info.version,
    locales: 
    {
        "English": 
        {
            "input_tab": "Prompts",
            "output_tab": "Result",
            "help_tab": "Help",
            "start_asking_action_btn": "Start asking",
            "prompt_textarea_placeholder": `Add your prompts and click 'GO'. One prompt per line. 

Tip: If you utilize 'Import Prompts via CSV', you can use multiple lines in a single prompt. One prompt per row.`,
            "actions_name": "Actions you can take",
            "copy_to_clipboard_action_btn": "Copy to clipboard",
            "export_as_csv_action_btn": "Export as CSV",
            "export_as_excel_action_btn": "Export as Excel",
            "prompt_table_header": "Prompt",
            "result_table_header": "Result",
            "how_to_use_section_name": "How to use?",
            "bugs_or_feature_requests_section_name": "Bugs or feature requests?",
            "settings_modal_name": "Settings",
            "setting_delay_per_prompt": "Delay (ms):",
            "setting_app_language": "Language:",
            "action_execute_prompts_btn": "GO",
            "how_to_use_section_value": "Visit https://chat.openai.com/chat, open this extension, and follow the instructions in the 'Prompts' tab.",

            "bugs_or_feature_requests_section_value": "Having trouble or simply enjoying your time?  We'd love to hear from you! Please drop us a review with your thoughts to help us keep making your experience even better!",
            "import_prompts_csv": "Import your prompts from a CSV file",
            "prompt_btn": "Import Prompts via CSV",
            "cancel_btn": "Cancel",
            "confirm_btn": "Confirm"
        }
    },
	status_colors : 
	{
		off : "#ff1515",
		on 	: "#00ff00",
		warning : "#ffb400"
	},
	icons : 
	{
		quit_icon 	: `data:image/png;base64,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`,
		add_icon 	: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAgAElEQVR4Xu3Ywa212VGFYfcQiRQQmSAycRwYLCYYR+GRE0HkgkiD24w8W1ur9LW2aj+/1LOqc89+6kh+5V9+5x8BAgQIECDwnMAvz73YgwkQIECAAIHfCQA/AgIECBAg8KCAAHjw6J5MgAABAgQEgN8AAQIECBB4UEAAPHh0TyZAgAABAgLAb4AAAQIECDwoIAAePLonEyBAgAABAeA3QIAAAQIEHhQQAA8e3ZMJECBAgIAA8BsgQIAAAQIPCgiAB4/uyQQIECBAQAD4DRAgQIAAgQcFBMCDR/dkAgQIECAgAPwGCBAgQIDAgwIC4MGjezIBAgQIEBAAfgMECBAgQOBBAQHw4NE9mQABAgQICAC/AQIECBAg8KCAAHjw6J5MgAABAgQEgN8AAQIECBB4UEAAPHh0TyZAgAABAgLAb4AAAQIECDwoIAAePLonEyBAgAABAeA3QIAAAQIEHhQQAA8e3ZMJECBAgIAA8BsgQIAAAQIPCgiAB4/uyQQIECBAQAD4DRAgQIAAgQcFBMCDR/dkAgQIECAgAPwGCBAgQIDAgwIC4MGjezIBAgQIEBAAfgMECBAgQOBBAQHw4NE9mQABAgQICAC/AQIECBAg8KCAAHjw6J5MgAABAgQEgN8AAQIECBB4UEAAPHh0TyZAgAABAgLAb4AAAQIECDwoIAAePLonEyBAgAABAeA3QIAAAQIEHhQQAA8e3ZMJECBAgIAA8BsgQIAAAQIPCgiAB4/uyQQIECBAQAD4DRAgQIAAgQcFBMCDR/dkAgQIECAgAPwGCBAgQIDAgwIC4MGjezIBAgQIEBAAfgMECBAgQOBBAQHw4NE9mQABAgQICAC/AQIECBAg8KCAAHjw6J5MgAABAgQEgN8AAQIECBB4UEAAPHh0TyZAgAABAgLAb4AAAQIECDwoIAAePLonEyBAgAABAeA3QIAAAQIEHhQQAA8e3ZMJECBAgIAA8BsgQIAAAQIPCgiAB4/uyQQIECBAQAD4DRAgQIAAgQcFBMCDR/dkAgQIECAgAPwGCHwr8Iefj//7b//E6k//1c8/AgQ+EBAAH6D6SAJ/I/Dr/4D9iUgl8OefLQFQ0VkikAUEQDYyQWAiIAB6PQHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAUEQCQyQGAkIAB6PgHQ29kkEAVe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k0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyACBkYAA6PkEQG9nk0AUEACRyOsv2esAAAN6SURBVACBkYAA6PkEQG9nk0AUEACRyACBkcCvAfB3o094e/mPbz/f6wl8JyAAvrP1yQQIECBA4FoBAXDtaXwxAgQIECDwnYAA+M7WJxMgQIAAgWsFBMC1p/HFCBAgQIDAdwIC4Dtbn0yAAAECBK4VEADXnsYXI0CAAAEC3wkIgO9sfTIBAgQIELhWQABcexpfjAABAgQIfCcgAL6z9ckECBAgQOBaAQFw7Wl8MQIECBAg8J2AAPjO1icTIECAAIFrBQTAtafxxQgQIECAwHcCAuA7W59MgAABAgSuFRAA157GFyNAgAABAt8JCIDvbH0yAQIECBC4VkAAXHsaX4wAAQIECHwnIAC+s/XJBAgQIEDgWgEBcO1pfDECBAgQIPCdgAD4ztYnEyBAgACBawUEwLWn8cUIECBAgMB3AgLgO1ufTIAAAQIErhUQANeexhcjQIAAAQLfCQiA72x9MgECBAgQuFZAAFx7Gl+MAAECBAh8JyAAvrP1yQQIECBA4FoBAXDtaXwxAgQIECDwnYAA+M7WJxMgQIAAgWsFBMC1p/HFCBAgQIDAdwIC4Dtbn0yAAAECBK4VEADXnsYXI0CAAAEC3wkIgO9sfTIBAgQIELhWQABcexpfjAABAgQIfCcgAL6z9ckECBAgQOBaAQFw7Wl8MQIECBAg8J2AAPjO1icTIECAAIFrBQTAtafxxQgQIECAwHcCAuA7W59MgAABAgSuFRAA157GFyNAgAABAt8JCIDvbH0yAQIECBC4VkAAXHsaX4wAAQIECHwnIAC+s/XJBAgQIEDgWgEBcO1pfDECBAgQIPCdgAD4ztYnEyBAgACBawUEwLWn8cUIECBAgMB3AgLgO1ufTIAAAQIErhUQANeexhcjQIAAAQLfCQiA72x9MgECBAgQuFZAAFx7Gl+MAAECBAh8JyAAvrP1yQQIECBA4FoBAXDtaXwxAgQIECDwnYAA+M7WJxMgQIAAgWsFBMC1p/HFCBAgQIDAdwIC4Dtbn0yAAAECBK4VEADXnsYXI0CAAAEC3wkIgO9sfTIBAgQIELhWQABcexpfjAABAgQIfCcgAL6z9ckECBAgQOBaAQFw7Wl8MQIECBAg8J2AAPjO1icTIECAAIFrBQTAtafxxQgQIECAwHcCAuA7W59MgAABAgSuFRAA157GFyNAgAABAt8J/B9M/6YubDJ3WgAAAABJRU5ErkJggg==`
	},
	storage_keys : 
	{
		"extension_state" 		: { "active" : true },
		"start_app_confirmed" 	: true,
		"OPTIONS" 				: {},
		"heroku_credentials" 	: null,
		"TASKS_LOG" 			: "",
		"last_prompts" 			: {},
		"prompts" 				: ""
	},
	background_context : 
	{
		ui : 
		{
			components : 
			{
				state_info_item : 
				{
					"id" : "state_info_item",
					"html" : 
					`
					<state-item style="
					   display: flex;
					   background-color: black;
					   padding: 7px;
					   border-radius: 6px;
					   margin: 0px 12px 0px 0px;
					   " id="">
					   <div style="
					      display: flex;
					      flex-direction: row;
					      align-items: center;
					      justify-content: space-between;
					      ">
					      <text style="
					         font-family: helvetica, arial, roboto;
					         font-size: 9px;
					         font-weight: 700;
					         color: white;
					         margin-right: 8px;
					         "></text>
					      <status-dot style="
					         width: 7px;
					         height: 7px;
					         display: flex;
					         background-color: #ff1515;
					         border-radius: 3px;
					         "></status-dot>
					   </div>
					</state-item>
					`
				},
				selected_tasks : 
				{
					"id" : "selected_tasks",
					"html" : 
					`
					<list-item style="
					    display: flex;
					    ">
					    <div style="
					        display: flex;
					        flex-direction: row;
					        align-items: center;
					        justify-content: space-between;
					        background-color: #581134;
					        height: 34px;
					        ">
					        <input type="checkbox" id="checkbox_Comment_task">
					        <text id="task_name" 
					        	style="
					            font-family: helvetica, arial, robotop;
					            font-size: 10px;
					            color: white;
					            font-weight: 700;
					            padding: 15px;
					            "></text>
					    </div>
					</list-item>
					`
				},
				main_actions :
				{
					"id" : "main_action_btn",
					"html" : 
					`
					<list-item id="" class="fade-in" style="margin:13px;">
					    <div style="
					        background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%);
					        padding: 1px;
					        border-radius: 6px;
					        " class="">
					        <button style="
					            display: flex;
							    width: 154px;
							    height: 41px;
					            align-items: center;
					            justify-content: center;
					            color: white;
					            background-color: #120b0e;
					            border: none;
					            border-radius: 5px;
					            font-family: helvetica, arial, roboto;
					            font-weight: 500;
					            cursor: pointer;
					            font-size: 11px;
					            padding: 0px 32px 0px 32px;
					            " class=""></button>
					    </div>
					</list-item>
					`
				},
				welcome_screen_action :
				{
					"button" : 
					{
						"id" : "welcome_screen_action",
						"html" : 
						`
						<div style="
						    background: linear-gradient(90deg, rgba(49,255,132,1) 0%, rgba(29,247,253,1) 35%, rgba(252,69,243,1) 80%);
						    padding: 2px;
						    border-radius: 9px;
						    display: flex;
						    width: 100%;
						    " id="">
						    <button style="
						        display: flex;
						        width: 100%;
						        height: 29px;
						        align-items: center;
						        justify-content: center;
						        color: white;
						        background-color: #000000;
						        border: none;
						        border-radius: 5px;
						        font-family: helvetica, arial, roboto;
						        font-weight: 600;
						        cursor: pointer;
						        font-size: 10px;
						        "></button>
						</div>
						`
					},
					"input" : 
					{
						"id" : "welcome_screen_action",
						"html" : 
						`
						<div style="
						    background: linear-gradient(90deg, rgb(1 227 255) 0%, rgba(29,247,253,1) 35%, rgb(128 33 235) 80%);
						    padding: 1px;
						    border-radius: 3px;
						    display: flex;
						    width: 100%;
						    " class="">
						    <input type="text" placeholder="user" id="" style="
						        border: 1px solid #000000;
						        background-color: #000000;
						        padding: 9px;
						        color: #8edbe6;
						        border-radius: 5px;
						        display: flex;
						        width: 100%;
						        ">
						</div>
						`
					}
				},
				OPTIONS_SETTINGS : 
				{
					"input" : 
					{
						"type" : "input",
						"id" : "OPTIONS_SETTINGS_input",
						"html" : 
						`
			            <div style="
			                display: flex;
			                flex-direction: column;
			                align-items: center;
			                justify-content: space-between;
			                width: 100%;
			                height: fit-content;
			                max-height: 440px;
			                margin-bottom: 14px;
			                " class="fade-in" option_id="">
			                <s-item style="
			                    border: 1px solid black;
			                    display: flex;
			                    width: 93%;
			                    background-color: #000000;
			                    box-shadow: 0px 0px 11px -5px #ffffff;
			                    " id="" class="">
			                    <div style="
			                        display: flex;
			                        flex-direction: row;
			                        align-items: center;
			                        justify-content: space-between;
			                        width: 100%;
			                        padding: 18px;
			                        " class="">
			                        <text style="
			                            display: flex;
			                            font-size: 13px;
			                            font-weight: 500;
			                            font-family: helvetica, arial, roboto;
			                            color: white;
			                            " id="option_title" class=""></text>
			                        <div style="
			                            display: flex;
			                            background: linear-gradient(
			                            90deg
			                            , rgba(49,255,132,1) 0%, rgba(29,247,253,1) 35%, #b44dff 80%);
			                            padding: 1px;
			                            border-radius: 4px;
			                            ">
			                            <input type="text
			                                " style="
			                                display: flex;
			                                border-radius: 4px;
			                                border: none;
			                                background-color: black;
			                                color: #ffffff;
			                                padding: 4px;
			                                font-family: helvetica, arial, roboto;
			                                font-weight: 500;
			                                font-size: 13px;
			                                width: 19vw;
			                                " id="option_value" option_data="" option_id="" class="">
			                        </div>
			                    </div>
			                </s-item>
			            </div>
						`
					},
					"toggle" : 
					{
						"type" : "toggle",
						"id" : "OPTIONS_SETTINGS_toggle",
						"html" : 
						`
			            <div style="
			                display: flex;
			                flex-direction: column;
			                align-items: center;
			                justify-content: space-between;
			                width: 100%;
			                height: fit-content;
			                max-height: 440px;
			                margin-bottom: 14px;
			                ">
			                <s-item style="
			                    border: 1px solid black;
			                    border-radius: 8px;
			                    display: flex;
			                    width: 93%;
			                    background-color: #000000;
			                    box-shadow: 0px 0px 11px -5px #ffffff;
			                    " id="">
			                    <div style="
			                        display: flex;
			                        flex-direction: row;
			                        align-items: center;
			                        justify-content: space-between;
			                        width: 100%;
			                        padding: 18px;
			                        ">
			                        <text style="
			                            display: flex;
			                            font-size: 13px;
			                            font-weight: 500;
			                            font-family: helvetica, arial, roboto;
			                            color: white;
			                            " id="option_title"></text>
			                        <div style="
			                            display: flex;
			                            background: linear-gradient(
			                            90deg
			                            , rgba(49,255,132,1) 0%, rgba(29,247,253,1) 35%, #b44dff 80%);
			                            padding: 1px;
			                            border-radius: 23px;
			                            ">
			                            <label class="switch" style="
			                                "> <input  id="option_value" type="checkbox"><span class="slider round"></span> </label>
			                        </div>
			                    </div>
			                </s-item>
			            </div>
						` 
					}
				}
			},
			options_page : 
			{
				states_info : 
				{
					"extension_state" :
					{ 
						"value" : "Turned On" 
					}
				},		
				main_actions : 
				{
					/*
					"action_name_id" :
					{ 
						"id" : "action_name_id",
						"value" : "Your action name here" 
					}
					*/
				},
				welcome_screen_actions : 
				{
					"start_app" :
					{ 
						"type" : "button",
						"id" : "START_APP",
						"value" : "START APP" 
					}
				},
				actions : 
				{

				}
			}
		}
	},
	popup_context : 
	{
		ui : 
		{
			components : 
			{
				state_info_item : 
				{
					"id" : "state_info_item",
					"html" : 
					`
					<state-item style="
					   display: flex;
					   background-color: black;
					   padding: 7px;
					   border-radius: 6px;
					   margin: 0px 12px 0px 0px;
					   " id="">
					   <div style="
					      display: flex;
					      flex-direction: row;
					      align-items: center;
					      justify-content: space-between;
					      ">
					      <text style="
					         font-family: helvetica, arial, roboto;
					         font-size: 9px;
					         font-weight: 700;
					         color: white;
					         margin-right: 8px;
					         "></text>
					      <status-dot style="
					         width: 7px;
					         height: 7px;
					         display: flex;
					         background-color: #ff1515;
					         border-radius: 3px;
					         "></status-dot>
					   </div>
					</state-item>
					`
				},
				selected_tasks : 
				{
					"id" : "selected_tasks",
					"html" : 
					`
					<list-item style="
					    display: flex;
					    ">
					    <div style="
					        display: flex;
					        flex-direction: row;
					        align-items: center;
					        justify-content: space-between;
					        background-color: #581134;
					        height: 34px;
					        ">
					        <input type="checkbox" id="checkbox_Comment_task">
					        <text id="task_name" 
					        	style="
					            font-family: helvetica, arial, robotop;
					            font-size: 10px;
					            color: white;
					            font-weight: 700;
					            padding: 15px;
					            "></text>
					    </div>
					</list-item>
					`
				},
				main_actions :
				{
					"id" : "main_action_btn",
					"html" : 
					`
					<list-item id="" class="fade-in" style="margin:13px; color: #62646a">
					    <div style="
								background: #ffffff00;
								padding: 1px;
								border-radius: 6px;
								color: inherit;
					        " class="">
					        <button style="
								    display: flex;
								    width: 154px;
								    align-items: center;
								    justify-content: center;
								    color: inherit;
								    background-color: #00000000;
								    border: none;
								    border-radius: 5px;
								    font-family: roboto bold;
								    cursor: pointer;
								    font-size: 16px;
								    padding: 0px 32px 0px 32px;
					            " class=""></button>
					    </div>
					</list-item>
					`
				},
				welcome_screen_action :
				{
					"button" : 
					{
						"id" : "welcome_screen_action",
						"html" : 
						`
						<div style="
						    background: linear-gradient(90deg, rgba(49,255,132,1) 0%, rgba(29,247,253,1) 35%, rgba(252,69,243,1) 80%);
						    padding: 2px;
						    border-radius: 9px;
						    display: flex;
						    width: 100%;
						    " id="">
						    <button style="
						        display: flex;
						        width: 100%;
						        height: 29px;
						        align-items: center;
						        justify-content: center;
						        color: white;
						        background-color: #000000;
						        border: none;
						        border-radius: 5px;
						        font-family: helvetica, arial, roboto;
						        font-weight: 600;
						        cursor: pointer;
						        font-size: 10px;
						        "></button>
						</div>
						`
					},
					"input" : 
					{
						"id" : "welcome_screen_action",
						"html" : 
						`
						<div style="
						    background: linear-gradient(90deg, rgb(1 227 255) 0%, rgba(29,247,253,1) 35%, rgb(128 33 235) 80%);
						    padding: 1px;
						    border-radius: 3px;
						    display: flex;
						    width: 100%;
						    " class="">
						    <input type="text" placeholder="user" id="" style="
						        border: 1px solid #000000;
						        background-color: #000000;
						        padding: 9px;
						        color: #8edbe6;
						        border-radius: 5px;
						        display: flex;
						        width: 100%;
						        ">
						</div>
						`
					}
				},
				OPTIONS_SETTINGS : 
				{
					"input" : 
					{
						"type" : "input",
						"id" : "OPTIONS_SETTINGS_input",
						"html" : 
						`
			            <div style="
			                display: flex;
			                flex-direction: column;
			                align-items: center;
			                justify-content: space-between;
			                width: 100%;
			                height: fit-content;
			                max-height: 440px;
			                margin-bottom: 14px;
			                " class="fade-in" option_id="">
			                <s-item style="
                                display: flex;
                                width: 100%;
                                background-color: #f6f6f6;
                                border: 1px dashed #e5e5e5;
			                    " id="" class="">
			                    <div style="
			                        display: flex;
			                        flex-direction: row;
			                        align-items: center;
			                        justify-content: space-between;
			                        width: 100%;
			                        padding: 18px;
			                        " class="">
			                        <text style="
                                            display: flex;
                                            font-size: 17px;
                                            font-family: roboto bold;
                                            color: #62646a;
			                            " id="option_title" class=""></text>
			                        <div style="
								    		display: flex;
										    background: #c1c1c1;
										    padding: 1px;
										    border-radius: 23px;
			                            ">
			                            <input type="text
			                                " style="
											    background-color: #ff000000;
											    border: none;
											    color: white;
											    font-family: roboto regular;
											    font-size: 13px;
											    outline: none;
											    padding: 6px;
											    text-align: center;
			                                " id="option_value" option_data="" option_id="" class="">
			                        </div>
			                    </div>
			                </s-item>
			            </div>
						`
					},
					"toggle" : 
					{
						"type" : "toggle",
						"id" : "OPTIONS_SETTINGS_toggle",
						"html" : 
						`
			            <div style="
			                display: flex;
			                flex-direction: column;
			                align-items: center;
			                justify-content: space-between;
			                width: 100%;
			                height: fit-content;
			                max-height: 440px;
			                margin-bottom: 14px;
			                ">
			                <s-item style="
                                display: flex;
                                width: 100%;
                                background-color: #f6f6f6;
                                border: 1px dashed #e5e5e5;
			                    " id="">
			                    <div style="
			                        display: flex;
			                        flex-direction: row;
			                        align-items: center;
			                        justify-content: space-between;
			                        width: 100%;
			                        padding: 18px;
			                        ">
			                        <text style="
			                            display: flex;
			                            font-size: 13px;
			                            font-weight: 500;
			                            font-family: helvetica, arial, roboto;
			                            color: white;
			                            " id="option_title"></text>
			                        <div style="
			                            display: flex;
			                            background: linear-gradient(
			                            90deg
			                            , rgba(49,255,132,1) 0%, rgba(29,247,253,1) 35%, #b44dff 80%);
			                            padding: 1px;
			                            border-radius: 23px;
			                            ">
			                            <label class="switch" style="
			                                "> <input  id="option_value" type="checkbox"><span class="slider round"></span> </label>
			                        </div>
			                    </div>
			                </s-item>
			            </div>
						` 
					},
					"button" : 
					{
						"type" : "button",
						"id" : "OPTIONS_SETTINGS_button",
						"html" : 
						`
			            <div style="
			                display: flex;
			                flex-direction: column;
			                align-items: center;
			                justify-content: space-between;
			                width: 100%;
			                height: fit-content;
			                max-height: 440px;
			                margin-bottom: 14px;
			                ">
			                <s-item style="
                                display: flex;
                                width: 100%;
                                background-color: #f6f6f6;
                                border: 1px dashed #e5e5e5;
			                    " id="">
			                    <div style="
			                        display: flex;
			                        flex-direction: row;
			                        align-items: center;
			                        justify-content: space-between;
			                        width: 100%;
			                        padding: 18px;
			                        ">
			                        <text style="
			                            display: flex;
			                            font-size: 13px;
			                            font-weight: 500;
			                            font-family: helvetica, arial, roboto;
			                            color: white;
			                            " id="option_title"></text>
			                        <div style="
			                            display: flex;
			                            background: linear-gradient(
			                            90deg
			                            , rgba(49,255,132,1) 0%, rgba(29,247,253,1) 35%, #b44dff 80%);
			                            padding: 1px;
			                            border-radius: 23px;
			                            ">
			                            <button id="option_value" style=
			                            "
										    font-size: 11px;
										    width: max-content;
										    height: 31px;
										    background-color: #ffffff00;
										    color: black;
										    border: none;
										    font-family: helvetica, arial, roboto;
										    font-weight: 600;
										    cursor: pointer;
			                            "></button
			                        </div>
			                    </div>
			                </s-item>
			            </div>
						` 
					},
					"dropdown" : 
					{
						"type" : "dropdown",
						"id" : "OPTIONS_SETTINGS_dropdown",
						"html" : 
						`
			            <div style="
			                display: flex;
			                flex-direction: column;
			                align-items: center;
			                justify-content: space-between;
			                width: 100%;
			                height: fit-content;
			                max-height: 440px;
			                margin-bottom: 14px;
			                ">
			                <s-item style="
                                display: flex;
                                width: 100%;
                                background-color: #f6f6f6;
                                border: 1px dashed #e5e5e5;
			                    " id="">
			                    <div style="
			                        display: flex;
			                        flex-direction: row;
			                        align-items: center;
			                        justify-content: space-between;
			                        width: 100%;
			                        padding: 18px;
			                        ">
			                        <text style="
										    display: flex;
										    font-size: 17px;
										    font-family: roboto bold;
										    color: #62646a;
			                            " id="option_title"></text>
			                        <div style="
										    display: flex;
										    background: #c1c1c1;
										    padding: 1px;
										    border-radius: 23px;
			                            ">
			                            <select id="option_value" style="
										    background-color: #ff000000;
										    border: none;
										    color: white;
										    font-family: roboto regular;
										    font-size: 13px;
										    outline: none;
										    padding: 6px;
										    text-align: center;
			                            "></select>
			                        </div>
			                    </div>
			                </s-item>
			            </div>
						` 
					}
				},
                table : 
                {
                    "id" : "table",
                    "html" : 
                    `
                        <div id="table" class="fade-in">
                            <div>
                                <!--<img src="${ chrome.runtime.getURL( "/assets/icons/quit_icon.png") }" listener_id="close_incidents_table" id="close">-->
                                <div role="table">
                                    <div>
                                        <div id="table_list">
                                            <div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `
                },
                table_list_row : 
                {
                    "id" : "table_list_row",
                    "html" : 
                    `
                        <div id="table_list_row">
                            <div></div>
                        </div>
                    `
                },
                table_list_cell :
                {
                    "id" : "table_list_cell",
                    "html" : 
                    `
                        <div id="table_list_cell">
                            <div>
                            </div>
                        </div>
                    `
                }
			},
			options_page : 
			{
				states_info : 
				{
					"extension_state" :
					{ 
						"value" : "Turned On" 
					}
				},		
				main_actions : 
				{			
					/*
					"action_name_id" :
					{ 
						"id" : "action_name_id",
						"value" : "Your action name here" 
					}
					*/
					"input_tab" :
					{ 
						"id" : "input_tab",
						"value" : "input" 
					},
					"output_tab" :
					{ 
						"id" : "output_tab",
						"value" : "Output" 
					},
					"help_tab" :
					{ 
						"id" : "help_tab",
						"value" : "Help" 
					}
				},
				welcome_screen_actions : 
				{
					/*
					"auth_user_input" : 
					{
						"type" : "input",
						"id" : "auth_user_input",
						"value" : "User" 
					},
					"auth_key_input" : 
					{
						"type" : "input",
						"id" : "auth_key_input",
						"value" : "Key" 
					},
					*/
					"start_app" :
					{ 
						"type" : "button",
						"id" : "START_APP",
						"value" : "START APP" 
					}
				}
			}
		}
	},
	page_context : 
	{
		ui :
		{
			components : 
			{
				/*
				your_component_name_id : 
				{
					"id" : "your_component_name_id",
					"html" : 
					`
					//your component html
					`
				}
				*/
			}
		}
	}
};

GLOBALS[ "app_options" ] = 
{
	/*
	"your_option_name_id" : 
    {
        "option_id"         : "your_option_name_id", //option key to be setted in the storage.
        "alarm_id"          : "your_option_name_id",
        "time_in_minutes"   : 2,
        "title"             : "Your Option Name:",
        "type"              : "input", // || "input" || "button" || "dropdown"
        "RECOMENDED_VALUE"  : null,
        "value"             : 30 / 60, // || "string" if input, button, dropdown.
        "time_type"         : "seconds",
        "index"             : 2, //position of the option to be placed in the order index
        "dropdown_options"  : 
        [
            {
                "name" : "OPTION 1 NAME",
                "value" : "OPTION 1 VALUE"
            },
            {
                "name" : "OPTION 2 NAME",
                "value" : "OPTION 2 VALUE"
            }
        ]
    },
	*/
	"app_language" : 
    {
        "option_id"         : "app_language", //option key to be setted in the storage.
        "alarm_id"          : null,
        "time_in_minutes"   : null,
        "title"             : "Language:",
        "type"              : "dropdown", // || "input" || "button" || "dropdown"
        "RECOMENDED_VALUE"  : null,
        "value"             : "English", // || "string" if input, button, dropdown.
        "time_type"         : null,
        "index"             : 0, //position of the option to be placed in the order index
        "dropdown_options"  : 
		[
		    {
		        "name": "English",
		        "value": "English"
		    },
            /*
		    {
		        "name": "Español (España)",
		        "value": "Español (España)"
		    },
		    {
		        "name": "Malay (Malaysia)",
		        "value": "Malay (Malaysia)"
		    },
		    {
		        "name": "French (France)",
		        "value": "French (France)"
		    },
		    {
		        "name": "German (Germany)",
		        "value": "German (Germany)"
		    },
		    {
		        "name": "Chinese (Simplified)",
		        "value": "Chinese (Simplified)"
		    },
		    {
		        "name": "Japanese (Japan)",
		        "value": "Japanese (Japan)"
		    },
		    {
		        "name": "Arabic (Egypt)",
		        "value": "Arabic (Egypt)"
		    },
		    {
		        "name": "Russian (Russia)",
		        "value": "Russian (Russia)"
		    },
		    {
		        "name": "Italian (Italy)",
		        "value": "Italian (Italy)"
		    },
		    {
		        "name": "Portuguese (Brazil)",
		        "value": "Portuguese (Brazil)"
		    },
		    {
		        "name": "Dutch (Netherlands)",
		        "value": "Dutch (Netherlands)"
		    },
		    {
		        "name": "Korean (South Korea)",
		        "value": "Korean (South Korea)"
		    }
            */
		]
    },
	"delay_per_prompt" : 
    {
        "option_id"         : "delay_per_prompt", //option key to be setted in the storage.
        "alarm_id"          : null,
        "time_in_minutes"   : null,
        "title"             : "Delay:",
        "type"              : "input", // || "input" || "button" || "dropdown"
        "RECOMENDED_VALUE"  : 1500,
        "value"             : 1500, // || "string" if input, button, dropdown.
        "time_type"         : null,
        "index"             : 1, //position of the option to be placed in the order index
        "dropdown_options"  : 
        [

        ]
    }
};

GLOBALS[ "alarms" ] = 
{
	/*
	Check_license_system : 
	{
		"id" 				: "test_alarm_1",
		"storage_id" 		: "",
		"time_in_minutes" 	: 17
	}
	*/
};

GLOBALS[ "listeners" ] = //must match with the listeners key. 
{
	"START_APP" : 
	{
		click : async ( EVENT, TARGET_EL, DATA ) =>
		{
			/*
			disable_element ( EVENT.target.parentNode );

			status_header.set_text ( "Checking" );
			show_element ( status_header.element );
			change_element_background ( status_header.element, GLOBALS["status_colors"]["warning"] );
			
			const USER 			= document.querySelectorAll ( '[id="auth_user_input"]' )[0].getElementsByTagName("input")[0].value;
			const KEY 			= document.querySelectorAll ( '[id="auth_key_input"]' )[0].getElementsByTagName("input")[0].value;

			await delay ( 1000 );

			try 
			{
				await login ( USER, KEY );

				enable_element ( EVENT.target.parentNode );
			} 
			catch ( error ) 
			{
				// statements
				status_header.set_text ( error.message || "Failed to verify license" );
				show_element ( status_header.element );
				change_element_background ( status_header.element, GLOBALS["status_colors"]["off"] );
				console.log( error );

				enable_element ( EVENT.target.parentNode );
			};
			*/

			await set_storage ( { "start_app_confirmed" : true } );

			EVENT.stopPropagation();
		},
		mouseover : async ( EVENT, TARGET_EL, DATA ) => 
		{
			EVENT.target.classList.add ( "color-change-2x" );

			await delay (250);
			EVENT.target.classList.remove ( "color-change-2x" );

			EVENT.stopPropagation();
		}
	},
	"open_app" : 
	{
		click : ( EVENT, TARGET_EL, DATA ) =>
		{
			chrome.runtime.openOptionsPage ();

			EVENT.stopPropagation();
		},	
		mouseover : async ( EVENT, TARGET_EL, DATA ) => 
		{
			EVENT.target.classList.add ( "color-change-2x" );

			await delay (250);
			EVENT.target.classList.remove ( "color-change-2x" );

			EVENT.stopPropagation();
		}
	},
	"open_settings_popup" : 
	{
		click : ( EVENT, TARGET_EL, DATA ) =>
		{ 
			const SETTINGS_POPUP = document.getElementsByTagName ( "settings-popup" )[0];

			show_element ( SETTINGS_POPUP );
			EVENT.stopPropagation();
		}
	},
	"close_settings_popup" : //close ettings popup and saves settings.
	{
		click : async ( EVENT, TARGET_EL, DATA ) =>
		{ 
			hide_element ( EVENT.target.parentNode.offsetParent );
			EVENT.stopPropagation();
		},
		mouseover : async ( EVENT, TARGET_EL, DATA ) => 
		{
			EVENT.target.classList.add ( "color-change-2x" );

			await delay (250);
			EVENT.target.classList.remove ( "color-change-2x" );

			EVENT.stopPropagation();
		}
	},
	"show_tasks_logs_container" : 
	{
		click : ( EVENT, TARGET_EL, DATA ) => 
		{
			show_logs_container ();

			EVENT.stopPropagation();
		},
		mouseover : async ( EVENT, TARGET_EL, DATA ) => 
		{
			EVENT.target.classList.add ( "color-change-2x" );

			await delay (250);
			EVENT.target.classList.remove ( "color-change-2x" );

			EVENT.stopPropagation();
		}
	},
	"clear_all_tasks_logs" : 
	{
		click : ( EVENT, TARGET_EL, DATA ) => 
		{
			clear_saved_log ();

			EVENT.stopPropagation();
		},
		mouseover : async ( EVENT, TARGET_EL, DATA ) => 
		{
			EVENT.target.classList.add ( "color-change-2x" );

			await delay (250);
			EVENT.target.classList.remove ( "color-change-2x" );

			EVENT.stopPropagation();
		}	
	},
	"show_more_items_rows" : 
	{
		click : ( EVENT, TARGET_EL, DATA ) => 
		{
			show_ten_items_more ();

			disable_element_by_time ( EVENT.target, 1800 );

			EVENT.stopPropagation();
		},
		mouseover : async ( EVENT, TARGET_EL, DATA ) => 
		{
			EVENT.target.classList.add ( "color-change-2x" );

			await delay (250);
			EVENT.target.classList.remove ( "color-change-2x" );

			EVENT.stopPropagation();
		}	
	},
	"extension_state" : 
	{
		change : async ( EVENT, TARGET_EL, DATA ) => 
		{
			if ( EVENT.target.checked == true ) 
			{
				await set_storage ( { "extension_state" : {"active" : true} } );
			} 
			else 
			{
				await set_storage ( { "extension_state" : {"active" : false} } );
			};
			
			EVENT.stopPropagation();
		},
		mouseover : async ( EVENT, TARGET_EL, DATA ) => 
		{
			EVENT.target.classList.add ( "color-change-2x" );

			await delay (250);
			EVENT.target.classList.remove ( "color-change-2x" );

			EVENT.stopPropagation();
		}
	},
    "OPTIONS_SETTINGS_input" : //must match with the listener_id properties in the dom elements 
    {
        input : async ( EVENT, TARGET_EL, DATA ) => 
        {
            if ( DATA.alarm_id != null ) 
            {
                if ( isNaN( TARGET_EL.value ) == false && TARGET_EL.value > 0 ) 
                {
                    const STORAGE_INFO = await get_storage( "OPTIONS" );

                    Object.values( STORAGE_INFO["OPTIONS"] ).filter((a)=>{ return a.option_id == DATA.option_id })[0].value = DATA.time_type == "seconds" ? TARGET_EL.value / 60 : TARGET_EL.value;
                    await set_storage( { "OPTIONS" : STORAGE_INFO["OPTIONS"] } );
                    message_to_background( "EDIT_ALARM_INTERVAL", { "ALARM_NAME" : DATA.alarm_id, "PERIOD_IN_MINUTES" : DATA.time_type == "seconds" ? TARGET_EL.value / 60 : TARGET_EL.value } );
                }
                else 
                {
                    status_header.set_text ( "Value must be a number > 0" );
                    show_element ( status_header.element );
                    change_element_background ( status_header.element, "red" );
                };
            }
            else 
            {
                const STORAGE_INFO = await get_storage( "OPTIONS" );

                Object.values( STORAGE_INFO["OPTIONS"] ).filter((a)=>{ return a.option_id == DATA.option_id })[0].value = DATA.time_type == "seconds" ? TARGET_EL.value / 60 : TARGET_EL.value;
                await set_storage( { "OPTIONS" : STORAGE_INFO["OPTIONS"] } );
            };
            EVENT.stopPropagation();
        },
        mouseover : ( EVENT, TARGET_EL, DATA ) => 
        {

            EVENT.stopPropagation();
        }
    },
	"OPTIONS_SETTINGS_toggle" : //must match with the listener_id properties in the dom elements 
	{
		click : async ( EVENT, TARGET_EL, DATA ) => 
		{
			const STORAGE_INFO = await get_storage( "OPTIONS" );

			Object.values( STORAGE_INFO["OPTIONS"] ).filter((a)=>{ return a.option_id == DATA.option_id })[0].value.active = EVENT.target.checked;

			await set_storage( { "OPTIONS" : STORAGE_INFO["OPTIONS"] } );
			EVENT.stopPropagation();
		},
		mouseover : ( EVENT, TARGET_EL, DATA ) => 
		{

			EVENT.stopPropagation();
		}
	},
	"OPTIONS_SETTINGS_button" : //must match with the listener_id properties in the dom elements 
	{
		change : async ( EVENT, TARGET_EL, DATA ) => 
		{
			console.log(EVENT.target)
			const STORAGE_INFO = await get_storage( "OPTIONS" );

			Object.values( STORAGE_INFO["OPTIONS"] ).filter((a)=>{ return a.option_id == DATA.option_id })[0].value = EVENT.target.value;
			
			await set_storage( { "OPTIONS" : STORAGE_INFO["OPTIONS"] } );
			EVENT.stopPropagation();
		},
		mouseover : ( EVENT, TARGET_EL, DATA ) => 
		{

			EVENT.stopPropagation();
		}
	},
	"OPTIONS_SETTINGS_dropdown" : //must match with the listener_id properties in the dom elements 
	{
		change : async ( EVENT, TARGET_EL, DATA ) => 
		{
			const STORAGE_INFO = await get_storage( "OPTIONS" );

			Object.values( STORAGE_INFO["OPTIONS"] ).filter((a)=>{ return a.option_id == DATA.option_id })[0].value = EVENT.target.value;
			
			await set_storage( { "OPTIONS" : STORAGE_INFO["OPTIONS"] } );

			if ( DATA.option_id == "app_language" ) 
			{
				set_locales();
			};

			EVENT.stopPropagation();
		},
		mouseover : ( EVENT, TARGET_EL, DATA ) => 
		{

			EVENT.stopPropagation();
		}
	},
	"input_tab" : //must match with the listener_id properties in the dom elements 
	{
		click : ( EVENT, TARGET_EL, DATA ) => 
		{
			Object.values(document.querySelectorAll('[id="main_actions"] list-item')).filter(a => a.style.color = "#8c8c8c");
			TARGET_EL.style.color = "#22B14C";
			show_input_tab();
			EVENT.stopPropagation();
		},
		mouseover : ( EVENT, TARGET_EL, DATA ) => 
		{
			TARGET_EL.style.filter = "drop-shadow(2px 4px 6px gray)";
			EVENT.stopPropagation();
		},
		mouseleave : ( EVENT, TARGET_EL, DATA ) => 
		{
			TARGET_EL.style.filter = "none";
			EVENT.stopPropagation();
		}
	},
	"output_tab" : //must match with the listener_id properties in the dom elements 
	{
		click : ( EVENT, TARGET_EL, DATA ) => 
		{
			Object.values(document.querySelectorAll('[id="main_actions"] list-item')).filter(a => a.style.color = "#8c8c8c");
			TARGET_EL.style.color = "#22B14C";
			show_output_tab();
			EVENT.stopPropagation();
		},
		mouseover : ( EVENT, TARGET_EL, DATA ) => 
		{
			TARGET_EL.style.filter = "drop-shadow(2px 4px 6px gray)";
			EVENT.stopPropagation();
		},
		mouseleave : ( EVENT, TARGET_EL, DATA ) => 
		{
			TARGET_EL.style.filter = "none";
			EVENT.stopPropagation();
		}
	},
	"help_tab" : //must match with the listener_id properties in the dom elements 
	{
		click : ( EVENT, TARGET_EL, DATA ) => 
		{
			Object.values(document.querySelectorAll('[id="main_actions"] list-item')).filter(a => a.style.color = "#8c8c8c");
			TARGET_EL.style.color = "#22B14C";
			show_help_tab();
			EVENT.stopPropagation();
		},
		mouseover : ( EVENT, TARGET_EL, DATA ) => 
		{
			TARGET_EL.style.filter = "drop-shadow(2px 4px 6px gray)";
			EVENT.stopPropagation();
		},
		mouseleave : ( EVENT, TARGET_EL, DATA ) => 
		{
			TARGET_EL.style.filter = "none";
			EVENT.stopPropagation();
		}
	},
	"execute_prompts_btn" : //must match with the listener_id properties in the dom elements 
	{
		click : ( EVENT, TARGET_EL, DATA ) => 
		{
			const PROMPTS = get_prompts( document.querySelector('[listener_id="prompt_input_field"]').value );

			execute_prompts( PROMPTS );

			window.close();
			EVENT.stopPropagation();
		},
		mouseover : ( EVENT, TARGET_EL, DATA ) => 
		{
			TARGET_EL.style.filter = "drop-shadow(2px 4px 6px gray)";
			EVENT.stopPropagation();
		},
		mouseleave : ( EVENT, TARGET_EL, DATA ) => 
		{
			TARGET_EL.style.filter = "none";
			EVENT.stopPropagation();
		}
	},
	"copy_to_clipboard" : //must match with the listener_id properties in the dom elements 
	{
		click : ( EVENT, TARGET_EL, DATA ) => 
		{
			
			EVENT.stopPropagation();
		},
		mouseover : ( EVENT, TARGET_EL, DATA ) => 
		{
			TARGET_EL.style.filter = "drop-shadow(2px 4px 6px gray)";
			EVENT.stopPropagation();
		},
		mouseleave : ( EVENT, TARGET_EL, DATA ) => 
		{
			TARGET_EL.style.filter = "none";
			EVENT.stopPropagation();
		}
	},
	"export_as_csv" : //must match with the listener_id properties in the dom elements 
	{
		click : async ( EVENT, TARGET_EL, DATA ) => 
		{
			const STORAGE_INFO = await get_storage( "last_prompts" );
			const COLUMNS_HEADERS = [ "Prompt", "Result" ];
			const CSV = new Csv();
			const FILENAME = GLOBALS.extension_name + "_CSV_" + Date.now();

			CSV.create( COLUMNS_HEADERS );

			for ( let item of Object.values( STORAGE_INFO["last_prompts"] ) ) 
			{
				const ROW = [ item.prompt_text, item.prompt_result ];

				CSV.push_( ROW );
			};

			CSV.download( FILENAME );

			EVENT.stopPropagation();
		},
		mouseover : ( EVENT, TARGET_EL, DATA ) => 
		{
			TARGET_EL.style.filter = "drop-shadow(2px 4px 6px gray)";
			EVENT.stopPropagation();
		},
		mouseleave : ( EVENT, TARGET_EL, DATA ) => 
		{
			TARGET_EL.style.filter = "none";
			EVENT.stopPropagation();
		}
	},
	"export_as_excel" : //must match with the listener_id properties in the dom elements 
	{
		click : async ( EVENT, TARGET_EL, DATA ) => 
		{
			const STORAGE_INFO = await get_storage( "last_prompts" );
			const COLUMNS_HEADERS = [ "Prompt", "Result" ];
			const TARGET_DATA = [];
			const FILENAME = GLOBALS.extension_name + "_XLSX_" + Date.now();

			TARGET_DATA.push( COLUMNS_HEADERS );

			for ( let item of Object.values( STORAGE_INFO["last_prompts"] ) ) 
			{
				const ROW = [ item.prompt_text, item.prompt_result ];

				TARGET_DATA.push( ROW );
			};

			DATA_TO_XLSX( TARGET_DATA, FILENAME );

			EVENT.stopPropagation();
		},
		mouseover : ( EVENT, TARGET_EL, DATA ) => 
		{
			TARGET_EL.style.filter = "drop-shadow(2px 4px 6px gray)";
			EVENT.stopPropagation();
		},
		mouseleave : ( EVENT, TARGET_EL, DATA ) => 
		{
			TARGET_EL.style.filter = "none";
			EVENT.stopPropagation();
		}
	},
	"import_prompts" : //must match with the listener_id properties in the dom elements 
	{
		click : async ( EVENT, TARGET_EL, DATA ) => 
		{
            const STORAGE_INFO = await get_storage("OPTIONS");
            const CONFIRMATION = await ask_confirmation(GLOBALS.locales[STORAGE_INFO["OPTIONS"].app_language.value].import_prompts_csv, false);

            if (CONFIRMATION === true) 
            {
                try 
                {
                    const FILE_HANDLE = await window.showOpenFilePicker({
                        types: [
                            {
                                description: 'CSV Files',
                                accept: { 'text/csv': ['.csv'] },
                            },
                        ],
                    });

                    const FILE = FILE_HANDLE[0];
                    const FILE_DATA = await FILE.getFile();
                    const FILE_TEXT = await FILE_DATA.text();

                    //set_storage( { "prompts" : FILE_TEXT } );
                    document.querySelector('[listener_id="prompt_input_field"]').value = FILE_TEXT;

                    console.log(FILE_TEXT);
                } 
                catch (error) 
                {
                    // Handle errors or user cancellation here
                    console.error(error);
                };
            };
			EVENT.stopPropagation();
		},
		mouseover : ( EVENT, TARGET_EL, DATA ) => 
		{
			TARGET_EL.style.filter = "drop-shadow(2px 4px 6px gray)";
			EVENT.stopPropagation();
		},
		mouseleave : ( EVENT, TARGET_EL, DATA ) => 
		{
			TARGET_EL.style.filter = "none";
			EVENT.stopPropagation();
		}
	},
	"prompt_input_field" : //must match with the listener_id properties in the dom elements 
	{
		input : ( EVENT, TARGET_EL, DATA ) => 
		{
			//set_storage( { "prompts" : EVENT.target.value } );
			EVENT.stopPropagation();
		},
		mouseover : ( EVENT, TARGET_EL, DATA ) => 
		{
			TARGET_EL.style.filter = "drop-shadow(2px 4px 6px gray)";
			EVENT.stopPropagation();
		},
		mouseleave : ( EVENT, TARGET_EL, DATA ) => 
		{
			TARGET_EL.style.filter = "none";
			EVENT.stopPropagation();
		}
	}
	/*
	"copy_to_clipboard" : //must match with the listener_id properties in the dom elements 
	{
		click : ( EVENT, TARGET_EL, DATA ) => 
		{
			
			EVENT.stopPropagation();
		},
		mouseover : ( EVENT, TARGET_EL, DATA ) => 
		{
			TARGET_EL.style.filter = "drop-shadow(2px 4px 6px gray)";
			EVENT.stopPropagation();
		},
		mouseleave : ( EVENT, TARGET_EL, DATA ) => 
		{
			TARGET_EL.style.filter = "none";
			EVENT.stopPropagation();
		}
	}
	*/
};	

self["generate_id"] = () => 
{
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';

    for (let i = 0; i < 10; i++) 
    {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
    };

    return id;
};
self["set_native_value"] = ( ELEMENT, value, IS_SELECT_ELEMENT=false ) =>
{
    if ( IS_SELECT_ELEMENT == true ) 
    {
        let lastValue = ELEMENT.value;

        ELEMENT.value = value;
        ELEMENT.querySelector("option[value='" + value + "']").selected = true;

        let event = new Event("change", { target: ELEMENT, bubbles: true });

        // React 15
        event.simulated = true;

        // React 16
        let tracker = ELEMENT._valueTracker;

        if ( tracker ) 
        {
            tracker.setValue( lastValue );
        };

        ELEMENT.dispatchEvent( event );
    }
    else if ( ELEMENT.type == "checkbox" || ELEMENT.type == "radio" ) 
    {
        let lastValue = ELEMENT.checked;

        ELEMENT.checked = value;

        let event = new Event("change", { target: ELEMENT, bubbles: true });

        // React 15
        event.simulated = true;

        // React 16
        let tracker = ELEMENT._valueTracker;

        if ( tracker ) 
        {
            tracker.setValue( lastValue );
        };

        ELEMENT.dispatchEvent( event );
    }
    else 
    {
        let lastValue = ELEMENT.value;

        ELEMENT.value = value;

        let event = new Event("input", { target: ELEMENT, bubbles: true });

        // React 15
        event.simulated = true;

        // React 16
        let tracker = ELEMENT._valueTracker;

        if ( tracker ) 
        {
            tracker.setValue( lastValue );
        };

        ELEMENT.dispatchEvent( event );
    };
};