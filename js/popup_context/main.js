var  SCRIPT_INDEX = 0;

function load_scripts_in_popup ( SCRIPT_INDEX, RESOLVE_ ) 
{
	return new Promise 
	(
		( RESOLVE, REJECT ) =>
		{
			RESOLVE_ ? RESOLVE = RESOLVE_ : RESOLVE;

			const EXTENSION_MANIFEST = chrome.runtime.getManifest ();
			const SCRIPTS_FOR_POPUP_PAGE = EXTENSION_MANIFEST.background["scripts_for_popup_page"].filter( a => a.split( "main.js" ).length <= 1 );
			const inction_trgt = document.body;
			const script = SCRIPTS_FOR_POPUP_PAGE[ SCRIPT_INDEX ];
			const SCRIPT_ELEMENT = document.createElement ( "script" );

			if ( script ) 
			{
				SCRIPT_ELEMENT.type = "text/javascript";
				SCRIPT_ELEMENT.src = script;
				SCRIPT_ELEMENT.addEventListener
				(
					"load",
					() => 
					{
						console.log ( script );

						if ( SCRIPT_INDEX >= SCRIPTS_FOR_POPUP_PAGE.length -1 ) 
						{
							RESOLVE (true);
						}
						else
						{
							SCRIPT_INDEX += 1;
							load_scripts_in_popup ( SCRIPT_INDEX, RESOLVE );
						};
					}
				);
				
				inction_trgt.append ( SCRIPT_ELEMENT );
			};
		}
	);
};


document.addEventListener 
(
	"readystatechange",
	async ( EVENT ) => 
	{
		if ( document.readyState == "complete" ) 
		{
			await load_scripts_in_popup ( SCRIPT_INDEX );

			new Promise 
			(
				async () => 
				{
					const STORAGE_INFO = await get_storage ();

					if ( STORAGE_INFO[ "start_app_confirmed" ] == false ) 
					{
						status_header.inject ( document.querySelector("body") );
						set_app_logo_icons ( { "heartbeat" : false } );
						set_appnames ();
						show_splash_screen ();
						update__welcome_screen_actions_component ();
						update_main_action_component ();
						await update_settings_item_component ();
						await set_listeners ( document.body );
					}
					else 
					{
						status_header.inject ( document.querySelector("body") );
						set_app_logo_icons ( { "heartbeat" : false } );
						set_appnames ();
						hide_splash_screen ();
						update_main_action_component ();
						await update_settings_item_component ();
						await set_listeners ( document.body );

						set_popup();
					};
				}
			);
		};
	}
);

async function execute_prompts ( PROMPTS=[] ) 
{
	const ACTIVE_TAB = await query_tabs( { "active" : true, "currentWindow" : true } );

	message_to_contentscript( "EXECUTE_PROMPTS", { "PROMPTS" : JSON.stringify(PROMPTS) }, ACTIVE_TAB[0].id );
};

function get_prompts ( TEXT ) 
{
	TEXT = TEXT.trim();

	const TEXTS = TEXT.split("\n");
	let FRAGMENT = [];

	for ( let i = 0; i < TEXTS.length; i++ )
	{
		if ( TEXTS[i].split(" ").join("").length == 0 ) 
		{
			if ( TEXTS[i-1] && TEXTS[i-1].split(" ").join("").length > 0 && TEXTS[i-2] && TEXTS[i-2].split(" ").join("").length > 0 ) 
			{
				FRAGMENT.push( TEXTS[i-1] );
			}
			else if ( i == 1 && TEXTS[i-1] && TEXTS[i-1].split(" ").join("").length > 0 ) 
			{
				FRAGMENT.push( TEXTS[i-1] );
			};

			FRAGMENT[ FRAGMENT.length-1 ] += "\n\n" + TEXTS[i+1].trim();
		};

		if ( TEXTS[i].split(" ").join("").length > 0 ) 
		{
			if ( TEXTS[i-1] && TEXTS[i+1] && (TEXTS[i-1].split(" ").join("").length > 0 && TEXTS[i+1].split(" ").join("").length > 0) ) 
			{
				FRAGMENT.push(TEXTS[i]);
			}
			else if ( (i == 0 && TEXTS[i+1]) && (TEXTS[i+1].split(" ").join("").length > 0) )
			{
				FRAGMENT.push(TEXTS[i]);
			}
			else if ( (i == TEXTS.length-1 && TEXTS[i-1]) && (TEXTS[i-1].split(" ").join("").length > 0) )
			{
				FRAGMENT.push(TEXTS[i]);
			}
			else if ( TEXTS.length == 1 ) 
			{
				FRAGMENT.push( TEXTS[i] );
			}
		};
	};

	return FRAGMENT;
};