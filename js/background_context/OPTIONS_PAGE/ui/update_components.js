function create_state_info_item_component ( STATE ) 
{
	const COMPONENT = components.create 
	( 
		GLOBALS.background_context.ui.components.state_info_item["html"], 
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
			GLOBALS.background_context.ui.components.OPTIONS_SETTINGS[ STATE["type"] ]["html"], 
			[ "fade-in" ], 
			{
				"option_id" : STATE["option_id"]
			} 
		);	

		COMPONENT.querySelectorAll ( '[id="option_title"]' )[0].innerText = STATE["title"];
		COMPONENT.querySelectorAll ( '[id="option_value"]' )[0].setAttribute ( "option_data", JSON.stringify ( STATE ) );

		if ( STATE["option_id"] == "FOLLOWING_USERS_TO_CHECK_LIMIT" ) 
		{
			const STORAGE_INFO 				= await get_storage ();
			const CHECK_ALL_FOLLOWING_LIST 	= STORAGE_INFO["OPTIONS"]["CHECK_ALL_FOLLOWING_LIST"]["value"]["active"];

			if ( CHECK_ALL_FOLLOWING_LIST == true ) 
			{
				hide_element( COMPONENT );
			}
			else
			{
				show_element( COMPONENT );
			};
		};

		if ( STATE["type"] == "input" ) 
		{
			COMPONENT.querySelectorAll ( '[id="option_value"]' )[0].setAttribute ( "listener_id", STATE["option_id"] );	
			COMPONENT.querySelectorAll ( '[id="option_value"]' )[0].setAttribute ( "option_id", STATE["option_id"] );
			COMPONENT.querySelectorAll ( '[id="option_value"]' )[0].value = STATE["value"];
	
			if ( STATE["option_id"] == "delay_max" || STATE["option_id"] == "delay_min" ) 
			{
				COMPONENT.querySelectorAll ( '[id="option_value"]' )[0].value = STATE["value"] / 1000;
			};
		}
		else if ( STATE["type"] == "toggle" )
		{
			COMPONENT.querySelectorAll ( '[id="option_value"]' )[0].setAttribute ( "listener_id", STATE["option_id"] );	
			COMPONENT.querySelectorAll ( '[id="option_value"]' )[0].checked = STATE["value"]["active"];
		};

		set_listeners ( COMPONENT );

		return COMPONENT;
	};
};

function create_welcome_screen_action_component ( ACTION ) 
{
	const COMPONENT = components.create 
	( 
		GLOBALS.background_context.ui.components.welcome_screen_action[ ACTION["type"] ]["html"], 
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
		GLOBALS.background_context.ui.components.main_actions["html"], 
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
	const STORAGE_INFO 		= await get_storage ();
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
								flex-direction: row;
								align-items: center;
								justify-content: space-between;
								width: 96%;
								">
							</div>`;

	//add main actions buttons components:
	for ( let [item, item_val] of Object.entries ( GLOBALS.background_context.ui.options_page.main_actions ) ) 
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
	for ( let [item, item_val] of Object.entries ( GLOBALS.background_context.ui.options_page.welcome_screen_actions ) ) 
	{
		const cmpnt = create_welcome_screen_action_component ( item_val );

		inject_component ( cmpnt, inction_trgt.children[0] );
	};
};

async function update_states_info_component () 
{
	const STORAGE_INFO 		= await get_storage ();
	const app_states 		= GLOBALS.background_context.ui.options_page.states_info;
	const inction_trgt 		= document.getElementsByTagName ( "a-states-info" )[0];

	inction_trgt.innerHTML = `<div style="
	                            display: flex;
	                            flex-direction: row;
	                            align-items: center;
	                            justify-content: space-between;
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
		appname.innerText = TEXT ? TEXT : GLOBALS.extension_name;
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