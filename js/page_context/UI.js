const SHADOW_ELEMENT = document.createElement(`shadow-element-${ chrome.runtime.id }`); inject_component( SHADOW_ELEMENT, document.body, true );
const SHADOW_DOM = SHADOW_ELEMENT.attachShadow( { "mode" : "open" } );
const LINK = document.createElement("link"); LINK.rel = "stylesheet"; LINK.type = "text/css"; LINK.href = chrome.runtime.getURL("/css/page_context/page.css"); inject_component( LINK, SHADOW_DOM, true );
const LINK_3 = document.createElement("link"); LINK_3.rel = "stylesheet"; LINK_3.type = "text/css"; LINK_3.href = chrome.runtime.getURL("/css/status_header.css"); inject_component( LINK_3, SHADOW_DOM );
const LINK_2 = document.createElement("link"); LINK_2.rel = "stylesheet"; LINK_2.type = "text/css"; LINK_2.href = chrome.runtime.getURL("/css/animations.css"); inject_component( LINK_2, SHADOW_DOM );

const components = 
{
	create : ( HTML, CLASSLIST=[], ATTRIBUTES={}, INNERTEXTS_DATA={} ) => 
	{
		const TAG_NAME 				= HTML.match ( /<([^\s>]+)(\s|>)+/ )[1];
		const COMPONENT_CONTAINER 	= document.createElement ( "CMPNT-CONTAINER" ); COMPONENT_CONTAINER.innerHTML = HTML;
		const COMPONENT 			= COMPONENT_CONTAINER.querySelectorAll ( TAG_NAME )[ 0 ];

		for ( let class_item of CLASSLIST ) 
		{
			COMPONENT.classList.add ( class_item );	
		};
		for ( let [attr_key, attr_val] of Object.entries ( ATTRIBUTES ) ) 
		{
			COMPONENT.setAttribute ( attr_key, attr_val );
		};
		for ( let [target_selector, innertext_val] of Object.entries ( INNERTEXTS_DATA ) ) 
		{
			COMPONENT.querySelectorAll ( `[${ target_selector }]` )[0].innerText = innertext_val;
		};

		return COMPONENT;
	}	
};

function inject_component ( COMPONENT, INJECTION_TARGET, PREPEND=false ) 
{
  	if ( PREPEND == true ) 
  	{
  		INJECTION_TARGET.prepend ( COMPONENT );
  	}
  	else 
  	{
  		INJECTION_TARGET.append ( COMPONENT );
  	};
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

async function create_settings_item_component ( STATE ) 
{
	if ( STATE["type"] ) 
	{
		const COMPONENT = components.create 
		( 
			GLOBALS.page_context.ui.components.OPTIONS_SETTINGS[ STATE["type"] ]["html"], 
			[ "fade-in" ], 
			{
				"option_id" : STATE["option_id"]
			} 
		);	

		COMPONENT.querySelectorAll ( '[id="option_title"]' )[0].innerText = STATE["title"];
		COMPONENT.querySelectorAll ( '[id="option_value"]' )[0].setAttribute ( "option_data", JSON.stringify ( STATE ) );

		for ( let item of Object.values( COMPONENT.querySelectorAll("*") ) ) 
		{
			item.setAttribute ( "option_data", JSON.stringify ( STATE ) );
		};

		if ( STATE["type"] == "input" ) 
		{
			COMPONENT.querySelectorAll ( '[id="option_value"]' )[0].setAttribute ( "listener_id", GLOBALS.page_context.ui.components.OPTIONS_SETTINGS[ STATE["type"] ]["id"] );	
			COMPONENT.querySelectorAll ( '[id="option_value"]' )[0].setAttribute ( "option_id", STATE["option_id"] );
			COMPONENT.querySelectorAll ( '[id="option_value"]' )[0].value = STATE["value"];
	
			if ( STATE["option_id"] == "delay_max" || STATE["option_id"] == "delay_min" ) 
			{
				COMPONENT.querySelectorAll ( '[id="option_value"]' )[0].value = STATE["value"] / 1000;
			};
		}
		else if ( STATE["type"] == "toggle" )
		{
			COMPONENT.querySelectorAll ( '[id="option_value"]' )[0].setAttribute ( "listener_id", GLOBALS.page_context.ui.components.OPTIONS_SETTINGS[ STATE["type"] ]["id"] );	
			COMPONENT.querySelectorAll ( '[id="option_value"]' )[0].checked = STATE["value"]["active"];
		}
		else if ( STATE["type"] == "button" )
		{
			COMPONENT.querySelectorAll ( '[id="option_value"]' )[0].setAttribute ( "listener_id", GLOBALS.page_context.ui.components.OPTIONS_SETTINGS[ STATE["type"] ]["id"] );	
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

			COMPONENT.querySelectorAll ( '[id="option_value"]' )[0].setAttribute ( "listener_id", GLOBALS.page_context.ui.components.OPTIONS_SETTINGS[ STATE["type"] ]["id"] );	
			COMPONENT.querySelectorAll ( '[id="option_value"]' )[0].value = STATE["value"];
		};

		set_listeners ( COMPONENT, STATE );

		return COMPONENT;
	};
};

async function update_settings_item_component () 
{
	const STORAGE_INFO 		= await get_storage ();
	const inction_trgt 		= SHADOW_DOM.querySelectorAll ( "settings-popup" )[0];
	const OPTIONS 			= STORAGE_INFO["OPTIONS"];

	inction_trgt.querySelectorAll ( "content" )[ 0 ].outerHTML = 
	`
	<content style="
	    display: flex;
	    width: 100%;
	    height: 100%;
	    flex-direction: column;
	    overflow-y : scroll;
	    padding: 6px;
    ">
   	</content>
	`

	for ( let option_value of Object.values ( OPTIONS ).filter (a=>a["type"] == "toggle").sort ((x,y)=>x["index"]-y["index"]) ) 
	{
		if ( option_value[ "option_id" ] == "extension_state" ) 
		{
			option_value["value"] = STORAGE_INFO["extension_state"];
			
			const cmpont = await create_settings_item_component ( option_value );

			inject_component ( cmpont, inction_trgt.querySelectorAll ( "content" )[ 0 ] );
		}
		else 
		{
			const cmpont = await create_settings_item_component ( option_value );

			inject_component ( cmpont, inction_trgt.querySelectorAll ( "content" )[ 0 ] );
		};
	};

	for ( let option_value of Object.values ( OPTIONS ).filter (a=>a["type"] == "dropdown").sort ((x,y)=>x["index"]-y["index"]) ) 
	{
		const cmpont = await create_settings_item_component ( option_value );

		inject_component ( cmpont, inction_trgt.querySelectorAll ( "content" )[ 0 ] );
	};
	
	for ( let option_value of Object.values ( OPTIONS ).filter (a=>a["type"] == "input").sort ((x,y)=>x["index"]-y["index"]) ) 
	{
		const cmpont = await create_settings_item_component ( option_value );

		inject_component ( cmpont, inction_trgt.querySelectorAll ( "content" )[ 0 ] );
	};

	for ( let option_value of Object.values ( OPTIONS ).filter (a=>a["type"] == "button").sort ((x,y)=>x["index"]-y["index"]) ) 
	{
		const cmpont = await create_settings_item_component ( option_value );

		inject_component ( cmpont, inction_trgt.querySelectorAll ( "content" )[ 0 ] );
	};
};
