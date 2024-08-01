function create_state_info_item_component ( STATE ) 
{
	const COMPONENT = components.create 
	( 
		GLOBALS.popup_context.ui.components.state_info_item["html"], 
		[ "fade-in" ], 
		{} 
	);	

	COMPONENT.getElementsByTagName ( "text" )[ 0 ].innerText = STATE["value"];

	set_listeners ( COMPONENT );

	return COMPONENT;
};

async function create_settings_item_component ( STATE ) 
{
	if ( STATE["type"] ) 
	{
		const COMPONENT = components.create 
		( 
			GLOBALS.popup_context.ui.components.OPTIONS_SETTINGS[ STATE["type"] ]["html"], 
			[ "fade-in" ], 
			{
				"option_id" : STATE["option_id"]
			} 
		);	

		COMPONENT.querySelectorAll ( '[id="option_title"]' )[0].innerText = STATE["title"];
		COMPONENT.querySelectorAll ( '[id="option_value"]' )[0].setAttribute ( "option_data", JSON.stringify ( STATE ) );

		if ( STATE["type"] == "input" ) 
		{
			COMPONENT.querySelectorAll ( '[id="option_value"]' )[0].setAttribute ( "listener_id", GLOBALS.popup_context.ui.components.OPTIONS_SETTINGS[ STATE["type"] ]["id"] );	
			COMPONENT.querySelectorAll ( '[id="option_value"]' )[0].setAttribute ( "option_id", STATE["option_id"] );
			COMPONENT.querySelectorAll ( '[id="option_value"]' )[0].value = STATE["value"];
	
			if ( STATE["option_id"] == "delay_max" || STATE["option_id"] == "delay_min" ) 
			{
				COMPONENT.querySelectorAll ( '[id="option_value"]' )[0].value = STATE["value"] / 1000;
			};
		}
		else if ( STATE["type"] == "toggle" )
		{
			COMPONENT.querySelectorAll ( '[id="option_value"]' )[0].setAttribute ( "listener_id", GLOBALS.popup_context.ui.components.OPTIONS_SETTINGS[ STATE["type"] ]["id"] );	
			COMPONENT.querySelectorAll ( '[id="option_value"]' )[0].checked = STATE["value"]["active"];
		}
		else if ( STATE["type"] == "button" )
		{
			COMPONENT.querySelectorAll ( '[id="option_value"]' )[0].setAttribute ( "listener_id", GLOBALS.popup_context.ui.components.OPTIONS_SETTINGS[ STATE["type"] ]["id"] );	
			COMPONENT.querySelectorAll ( '[id="option_value"]' )[0].innerHTML = STATE["value"];
		}
		else if ( STATE["type"] == "dropdown" )
		{
			let OPTIONS_HTML = "";

			for ( let option of STATE["dropdown_options"] ) 
			{
				OPTIONS_HTML += `\n<option style="color: black;" value="${ option.value }" >${ option.name }</option>`;
			};

			COMPONENT.querySelector("select").innerHTML = OPTIONS_HTML;

			COMPONENT.querySelectorAll ( '[id="option_value"]' )[0].setAttribute ( "listener_id", GLOBALS.popup_context.ui.components.OPTIONS_SETTINGS[ STATE["type"] ]["id"] );	
			COMPONENT.querySelectorAll ( '[id="option_value"]' )[0].value = STATE["value"];
		};

		set_listeners ( COMPONENT, STATE );

		return COMPONENT;
	};
};

function create_welcome_screen_action_component ( ACTION ) 
{
	const COMPONENT = components.create 
	( 
		GLOBALS.popup_context.ui.components.welcome_screen_action[ ACTION["type"] ]["html"], 
		[ "fade-in" ], 
		{ 
			"id" : `${ ACTION["id"] }`
		} 
	);	

	if ( ACTION["type"] == "button" ) 
	{
		COMPONENT.getElementsByTagName ( "button" )[ 0 ].setAttribute ( "listener_id", ACTION["id"] );
		COMPONENT.getElementsByTagName ( "button" )[ 0 ].innerHTML = ACTION["value"];
	};
	if ( ACTION["type"] == "input" ) 
	{
		COMPONENT.getElementsByTagName ( "input" )[ 0 ].setAttribute ( "listener_id", ACTION["id"] );
		COMPONENT.getElementsByTagName ( "input" )[ 0 ].setAttribute ( "placeholder", ACTION["value"] );
	};

	set_listeners ( COMPONENT );

	return COMPONENT;
};

function create_main_action_button_component ( ACTION ) 
{
	const COMPONENT = components.create 
	( 
		GLOBALS.popup_context.ui.components.main_actions["html"], 
		[ "fade-in" ], 
		{ 
			"id" : `${ ACTION["id"] }`,
			"listener_id" : `${ ACTION["id"] }`
		} 
	);	

	COMPONENT.getElementsByTagName ( "button" )[ 0 ].innerHTML = ACTION[ "value" ];

	set_listeners ( COMPONENT );

	return COMPONENT;
};

async function show_logged_tasks () 
{
	const STORAGE_INFO 		= await get_storage ( GLOBALS.storage_keys );
	const TASKS_LOG_BUCKET 	= document.querySelectorAll ( '[id="tasks_logs"]' )[0].getElementsByTagName("textarea")[0];

	TASKS_LOG_BUCKET.value = STORAGE_INFO["TASKS_LOG"];
	TASKS_LOG_BUCKET.scroll ( 0,TASKS_LOG_BUCKET.scrollHeight );
};

function update_main_action_component () 
{
	const inction_trgt = document.querySelectorAll('[id="main_actions"]')[0];

	inction_trgt.innerHTML = `<div
								style="
								    display: flex;
								    width: 100%;
								    height: 10%;
								    align-items: center;
								    justify-content: center;
								    box-shadow: 0px 0px 18px -17px black;
								">
							</div>`;

	//add main actions buttons components:
	for ( let [item, item_val] of Object.entries ( GLOBALS.popup_context.ui.options_page.main_actions ) ) 
	{
		const cmpnt = create_main_action_button_component ( item_val );

		inject_component ( cmpnt, inction_trgt.children[0] );
	};
};

function update__welcome_screen_actions_component () 
{
	const inction_trgt = document.querySelectorAll('[id="welcome_screen_actions"]')[0];

	inction_trgt.innerHTML = `<div style="
								display: flex;
								flex-direction: column;
								align-items: center;
								justify-content: space-evenly;
								align-self: center;
								background-color: #380a2100;
								width: 178px;
								">
							</div>`;

	//add welcome screen actions buttons components:
	for ( let [item, item_val] of Object.entries ( GLOBALS.popup_context.ui.options_page.welcome_screen_actions ) ) 
	{
		const cmpnt = create_welcome_screen_action_component ( item_val );

		inject_component ( cmpnt, inction_trgt.children[0] );
	};
};

async function update_states_info_component () 
{
	const STORAGE_INFO 		= await get_storage ();
	const app_states 		= GLOBALS.popup_context.ui.options_page.states_info;
	const inction_trgt 		= document.getElementsByTagName ( "a-states-info" )[0];

	inction_trgt.innerHTML = `<div style="
	                            display: flex;
	                            flex-direction: row;
	                            justify-content: space-between;
	                            align-items: center;
	                            width: 110%;
	                            height: 100%;
	                            ">
	                           </div>`;

	await delay ( 300 );

	//add states info components:
	for ( let [item,item_val] of Object.entries ( app_states ) ) 
	{
		const cmpont = create_state_info_item_component ( item_val );	
		const inction_trgt = document.getElementsByTagName ( "a-states-info" )[0];

		if ( STORAGE_INFO[ item ]["active"] == true ) 
		{
			set_state_info_dot_color ( cmpont, GLOBALS.status_colors["on"] );
		}
		else 
		{
			set_state_info_dot_color ( cmpont, GLOBALS.status_colors["off"] );	
		};

		inject_component ( cmpont, inction_trgt.children[0] );
	};
};

async function update_settings_item_component () 
{
	const STORAGE_INFO 		= await get_storage ();
	const inction_trgt 		= document.getElementsByTagName ( "settings-popup" )[0];
	const OPTIONS 			= STORAGE_INFO["OPTIONS"];

	inction_trgt.getElementsByTagName ( "content" )[ 0 ].outerHTML = `<content style="
															            display: flex;
															            width: 100%;
															            height: 100%;
															            flex-direction: column;
															            overflow-y : scroll;
															            padding: 6px;
												                        ">
												                       	</content>`

	for ( let option_value of Object.values ( OPTIONS ).filter (a=>a["type"] == "toggle").sort ((x,y)=>x["index"]-y["index"]) ) 
	{
		if ( option_value[ "option_id" ] == "extension_state" ) 
		{
			option_value["value"] = STORAGE_INFO["extension_state"];
			
			const cmpont = await create_settings_item_component ( option_value );

			inject_component ( cmpont, inction_trgt.getElementsByTagName ( "content" )[ 0 ] );
		}
		else 
		{
			const cmpont = await create_settings_item_component ( option_value );

			inject_component ( cmpont, inction_trgt.getElementsByTagName ( "content" )[ 0 ] );
		};
	};

	for ( let option_value of Object.values ( OPTIONS ).filter (a=>a["type"] == "input").sort ((x,y)=>x["index"]-y["index"]) ) 
	{
		const cmpont = await create_settings_item_component ( option_value );

		inject_component ( cmpont, inction_trgt.getElementsByTagName ( "content" )[ 0 ] );
	};

	for ( let option_value of Object.values ( OPTIONS ).filter (a=>a["type"] == "button").sort ((x,y)=>x["index"]-y["index"]) ) 
	{
		const cmpont = await create_settings_item_component ( option_value );

		inject_component ( cmpont, inction_trgt.getElementsByTagName ( "content" )[ 0 ] );
	};

	for ( let option_value of Object.values ( OPTIONS ).filter (a=>a["type"] == "dropdown").sort ((x,y)=>x["index"]-y["index"]) ) 
	{
		const cmpont = await create_settings_item_component ( option_value );

		inject_component ( cmpont, inction_trgt.getElementsByTagName ( "content" )[ 0 ] );
	};
};

function set_state_info_dot_color ( STATE_INFO_COMPONENT, COLOR ) 
{
	const status_dot = STATE_INFO_COMPONENT.getElementsByTagName ( "status-dot" )[ 0 ];

	change_element_background ( status_dot, COLOR );
};
/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

function set_app_logo_icons ( CLASSES_DATA ) 
{
	const app_logo_icons = document.getElementsByClassName ( "app_logo_icon" );

	for ( let icon of Object.values ( app_logo_icons ) ) 
	{
		icon.style.backgroundImage = `url("${GLOBALS.extension_icon}")`;

		if ( CLASSES_DATA ) 
		{
			for ( let [CLASS_ITEM, CLASS_ITEM_VALUE] of Object.entries ( CLASSES_DATA ) ) 
			{
				if ( CLASS_ITEM_VALUE == true ) 
				{
					icon.classList.add ( CLASS_ITEM );
				}
				else if ( CLASS_ITEM_VALUE == false ) 
				{
					icon.classList.remove ( CLASS_ITEM );
				};
			};
		};
	};
};

function set_appnames ( TEXT )
{
	const appnames = document.getElementsByClassName ( "app_name_brand" );

	for ( let appname of Object.values ( appnames ) ) 
	{
		appname.innerText = TEXT ? TEXT : GLOBALS.extension_name.split(" ")[0];
	};
};

function show_splash_screen () 
{
	const SPLASH_SCREEN 	= document.querySelectorAll('[id="welcome-screen"]')[0];
	const MENU 				= document.getElementsByTagName ( "app-menu" )[0];

	show_element ( SPLASH_SCREEN );
	hide_element ( MENU );
};

function hide_splash_screen () 
{
	const SPLASH_SCREEN 	= document.querySelectorAll('[id="welcome-screen"]')[0];
	const MENU 				= document.getElementsByTagName ( "app-menu" )[0];

	show_element ( MENU );
	hide_element ( SPLASH_SCREEN );
};

async function set_listeners ( TARGET_COMPONENT, DATA_TO_INJECT={} ) 
{
	const TARGETS = TARGET_COMPONENT.querySelectorAll ( '[listener_id]' );
	const STORAGE_INFO = await get_storage ();
	const extension_state_toggle = document.querySelectorAll ( '[listener_id="extension_state"]' )[0];

	if ( extension_state_toggle ) 
	{
		extension_state_toggle.checked = STORAGE_INFO["extension_state"]["active"];	
	};

	if ( TARGET_COMPONENT && TARGET_COMPONENT.getAttribute ( "listener_id" ) ) 
	{
		const LISTENER_ID = TARGET_COMPONENT.getAttribute ( "listener_id" );
		
		if ( GLOBALS.listeners[ LISTENER_ID ] ) 
		{
			for ( let listener in GLOBALS.listeners[ LISTENER_ID ] ) 
			{
				const already_has_listeners = TARGET_COMPONENT.getAttribute ( "has_listeners" ) == "true";

				if ( already_has_listeners == false ) 
				{
					TARGET_COMPONENT.addEventListener ( 
						listener, 
						( EVENT ) => 
						{ 
							GLOBALS.listeners[ LISTENER_ID ][ listener ]( EVENT, TARGET_COMPONENT, DATA_TO_INJECT ); 
						} 
					);
				}
				else 
				{
					continue;
				};
			};

			TARGET_COMPONENT.setAttribute ( "has_listeners", "true" );
		};
	};

	for ( let target_element of Object.values ( TARGETS ) ) 
	{
		const LISTENER_ID = target_element.getAttribute ( "listener_id" );

		//add JSON data stringified to the target element:
		if ( !target_element.getAttribute ( "data" ) ) 
		{
			target_element.setAttribute ( "data", JSON.stringify( DATA_TO_INJECT ) );
		};

		//settings page context components listeners:
		if ( GLOBALS.listeners[ LISTENER_ID ] ) 
		{
			for ( let listener in GLOBALS.listeners[ LISTENER_ID ] ) 
			{
				const already_has_listeners = target_element.getAttribute ( "has_listeners" ) == "true";

				if ( already_has_listeners == false ) 
				{
					target_element.addEventListener ( 
						listener, 
						( EVENT ) => 
						{ 
							GLOBALS.listeners[ LISTENER_ID ][ listener ]( EVENT, target_element, DATA_TO_INJECT ); 
						} 
					);
				}
				else 
				{
					continue;
				};

				if ( Object.keys( GLOBALS.listeners[ LISTENER_ID ] ).indexOf( listener ) == Object.keys( GLOBALS.listeners[ LISTENER_ID ] ).length - 1 ) 
				{
					target_element.setAttribute ( "has_listeners", "true" );
				};
			};
		};

		//console.log ( `\n\n LISTENERS ADDED FOR: ${ LISTENER_ID }` )
	};

	//add JSON data stringified to the target element:
	if ( !TARGET_COMPONENT.getAttribute ( "data" ) ) 
	{
		TARGET_COMPONENT.setAttribute ( "data", JSON.stringify( DATA_TO_INJECT ) );
	};
};

/* --- TABLE --- */
function create_table ( ROWS, TABLE_HEADER_BACKGROUNDCOLOR="white", TABLE_ROWS_ITERATION_BACKGROUNDCOLOR="#f0f0f0", TABLE_CELLS_BORDER_COLOR="#cacaca" ) 
{
    const COMPONENT = components.create 
    ( 
        GLOBALS.popup_context.ui.components.table["html"], 
        [ "fade-in" ], 
        { 
            "data" : JSON.stringify( ROWS )
        } 
    );  
    const HEADER_ROW = ROWS.shift();

    // table header:
    const header_row_component = components.create 
    ( 
        GLOBALS.popup_context.ui.components.table_list_row["html"], 
        [ "fade-in" ], 
        {} 
    ); 

    header_row_component.style.backgroundColor = TABLE_HEADER_BACKGROUNDCOLOR;

    for ( let header_row_item of HEADER_ROW ) 
    {
        const cell_component = components.create( GLOBALS.popup_context.ui.components.table_list_cell["html"], [], {} ); 

        cell_component.querySelector("div").innerHTML = header_row_item;

        header_row_component.querySelector("div").append( cell_component );
    };

    COMPONENT.querySelector('[id="table_list"] > div').append( header_row_component );    

    // table rows:
    for ( let i = 0; i < ROWS.length; i++ )
    {
        const row_item = ROWS[i];
        const row_component = components.create 
        ( 
            GLOBALS.popup_context.ui.components.table_list_row["html"], 
            [ "fade-in" ], 
            {} 
        ); 

        if ( i % 2 === 0 ) 
        {
            row_component.style.backgroundColor = TABLE_ROWS_ITERATION_BACKGROUNDCOLOR;
        };

        // table cells:
        for ( let row_cell_item of row_item ) 
        {
            const cell_component = components.create( GLOBALS.popup_context.ui.components.table_list_cell["html"], [], {} ); 

            // check if row cell item is HTML, if it is it will append it.
            if ( row_cell_item instanceof Element == true ) 
            {
                cell_component.querySelector("div").append( row_cell_item );
            }
            else 
            {
                cell_component.querySelector("div").innerHTML = row_cell_item;
            };

            cell_component.style.borderColor = TABLE_CELLS_BORDER_COLOR;

            row_component.querySelector("div").append( cell_component );
        };

        COMPONENT.querySelector('[id="table_list"] > div').append( row_component );
    };

    set_listeners ( COMPONENT );

    return COMPONENT;
};
/* --- */

async function set_locales () 
{
	const STORAGE_INFO = await get_storage( "OPTIONS" );
	const SELECTED_LANGUAGE = STORAGE_INFO["OPTIONS"].app_language.value;

	document.querySelector('[listener_id="input_tab"] button').innerText = GLOBALS.locales[ SELECTED_LANGUAGE ].input_tab;
	document.querySelector('[listener_id="output_tab"] button').innerText = GLOBALS.locales[ SELECTED_LANGUAGE ].output_tab;
	document.querySelector('[listener_id="help_tab"] button').innerText = GLOBALS.locales[ SELECTED_LANGUAGE ].help_tab;
	document.querySelector('[listener_id="prompt_input_field"]').placeholder = GLOBALS.locales[ SELECTED_LANGUAGE ].prompt_textarea_placeholder;
	document.querySelector('[listener_id="execute_prompts_btn"] button').innerText = GLOBALS.locales[ SELECTED_LANGUAGE ].action_execute_prompts_btn;
	document.querySelector('[id="prompts_results_actions_section_name"] text').innerText = GLOBALS.locales[ SELECTED_LANGUAGE ].actions_name;
	document.querySelector('[listener_id="copy_to_clipboard"]').innerText = GLOBALS.locales[ SELECTED_LANGUAGE ].copy_to_clipboard_action_btn;
	document.querySelector('[listener_id="export_as_csv"]').innerText = GLOBALS.locales[ SELECTED_LANGUAGE ].export_as_csv_action_btn;
	document.querySelector('[listener_id="export_as_excel"]').innerText = GLOBALS.locales[ SELECTED_LANGUAGE ].export_as_excel_action_btn;
	document.querySelector('[id="prompt_table_header"]').innerText = GLOBALS.locales[ SELECTED_LANGUAGE ].prompt_table_header;
	document.querySelector('[id="result_table_header"]').innerText = GLOBALS.locales[ SELECTED_LANGUAGE ].result_table_header;
	document.querySelector('[id="how_to_use_name"]').innerText = GLOBALS.locales[ SELECTED_LANGUAGE ].how_to_use_section_name;
	document.querySelector('[id="how_to_use_value"]').innerText = GLOBALS.locales[ SELECTED_LANGUAGE ].how_to_use_section_value;
	document.querySelector('[id="bugs_or_feature_requests_section_name"]').innerText = GLOBALS.locales[ SELECTED_LANGUAGE ].bugs_or_feature_requests_section_name;
	document.querySelector('[id="bugs_or_feature_requests_section_value"]').innerText = GLOBALS.locales[ SELECTED_LANGUAGE ].bugs_or_feature_requests_section_value;
	document.querySelector('[option_id="delay_per_prompt"] [id="option_title"]').innerText = GLOBALS.locales[ SELECTED_LANGUAGE ].setting_delay_per_prompt;
	document.querySelector('[option_id="app_language"] [id="option_title"]').innerText = GLOBALS.locales[ SELECTED_LANGUAGE ].setting_app_language;
	document.querySelector('settings-popup e-title').innerText = GLOBALS.locales[ SELECTED_LANGUAGE ].settings_modal_name;
	document.querySelector('[id="confirm"] button').innerText = GLOBALS.locales[ SELECTED_LANGUAGE ].confirm_btn;
	document.querySelector('[id="cancel"] button').innerText = GLOBALS.locales[ SELECTED_LANGUAGE ].cancel_btn;
	document.querySelector('[listener_id="import_prompts"] button').innerText = GLOBALS.locales[ SELECTED_LANGUAGE ].prompt_btn;
};

async function update_last_prompts_table () 
{
	const STORAGE_INFO = await get_storage( "last_prompts" );
	const TABLE_HEADERS = [ `<text id="prompt_table_header" style="color:white;"> PROMPT </text>`, `<text id="result_table_header" style="color:white;"> RESULT </text>` ];
	const TABLE_ROWS = [];
	const INJECTION_TARGET = document.querySelector('[id="prompts_results_table"]');

	//clears injection target component:
	INJECTION_TARGET.innerHTML = "<div></div>";

	//add headers rows:
	TABLE_ROWS.push( TABLE_HEADERS );

	//add prompts to rows:
	for ( let prompt of Object.values(STORAGE_INFO["last_prompts"]) ) 
	{
		const ROW = [ prompt.prompt_text, prompt.prompt_result ];

		TABLE_ROWS.push( ROW );
	};

	//create prompts table:
	const PROMPTS_TABLE = create_table ( TABLE_ROWS, "#62646a" );

	//onkects prompts table:
	inject_component ( PROMPTS_TABLE, INJECTION_TARGET.children[0] ); 

	return true;
};

function show_input_tab () 
{
	show_element(document.querySelector('[id="app"] [id="input_tab"]'));
	hide_element(document.querySelector('[id="app"] [id="output_tab"]'));
	hide_help_tab();
};
function hide_input_tab () 
{
	hide_element(document.querySelector('[id="app"] [id="input_tab"]'));
};
function show_output_tab () 
{
	hide_element(document.querySelector('[id="app"] [id="input_tab"]'));
	show_element(document.querySelector('[id="app"] [id="output_tab"]'));
	hide_help_tab();
};
function hide_output_tab () 
{
	hide_element(document.querySelector('[id="app"] [id="output_tab"]'));
};
function show_help_tab () 
{
	hide_element(document.querySelector('[id="app"] [id="input_tab"]'));
	hide_element(document.querySelector('[id="app"] [id="output_tab"]'));
	show_element(document.querySelector('[id="app"] [id="help_tab"]'));
	show_element(document.getElementsByTagName ( "settings-popup" )[0]);
};
function hide_help_tab () 
{
	hide_element(document.querySelector('[id="app"] [id="help_tab"]'));
	hide_element(document.getElementsByTagName ( "settings-popup" )[0]);
};

async function set_popup() 
{
	const STORAGE_INFO = await get_storage( "prompts" );

	document.querySelector('list-item[id="input_tab"]').style.color = "#22B14C";
	document.querySelector('[listener_id="prompt_input_field"]').value = STORAGE_INFO["prompts"];

	await update_last_prompts_table();
	set_locales();
};

function ask_confirmation ( CONFIRMATION_TEXT, JUST_AN_ADVISE=false ) 
{
	return new Promise
	(
		( RESOLVE ) => 
		{
			if ( JUST_AN_ADVISE == true ) 
			{
				const CONFIRMATION_MODAL = document.querySelector('[id="confirmation_modal"]');
				const DO_CONFIRM = () => 
				{
					CONFIRMATION_MODAL.querySelector('[id="confirm"] button').innerText = "Confirm";
					show_element(CONFIRMATION_MODAL.querySelector('[id="cancel"]'));
					CONFIRMATION_MODAL.querySelector('[id="confirm"]').removeEventListener( "click", DO_CONFIRM );
					hide_element( CONFIRMATION_MODAL );
					RESOLVE( true );
				};

				CONFIRMATION_MODAL.querySelector('[id="confirm"]').addEventListener( "click", DO_CONFIRM );
				CONFIRMATION_MODAL.querySelector('[id="confirm"] button').innerText = "Okay";
				hide_element(CONFIRMATION_MODAL.querySelector('[id="cancel"]'));

				CONFIRMATION_MODAL.querySelector('[id="modal_text"] text').innerText = CONFIRMATION_TEXT;

				show_element( CONFIRMATION_MODAL );
			}
			else 
			{
				const CONFIRMATION_MODAL = document.querySelector('[id="confirmation_modal"]');
				const DO_CONFIRM = () => 
				{
					CONFIRMATION_MODAL.querySelector('[id="confirm"]').removeEventListener( "click", DO_CONFIRM );
					hide_element( CONFIRMATION_MODAL );
					RESOLVE( true );
				};
				const DO_CANCEL = () => 
				{
					CONFIRMATION_MODAL.querySelector('[id="cancel"]').removeEventListener( "click", DO_CANCEL );
					hide_element( CONFIRMATION_MODAL );
					RESOLVE( false );
				};

				CONFIRMATION_MODAL.querySelector('[id="confirm"]').addEventListener( "click", DO_CONFIRM );
				CONFIRMATION_MODAL.querySelector('[id="cancel"]').addEventListener( "click", DO_CANCEL );

				CONFIRMATION_MODAL.querySelector('[id="modal_text"] text').innerText = CONFIRMATION_TEXT;

				show_element( CONFIRMATION_MODAL );
			};
		}
	);
};