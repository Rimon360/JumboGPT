/* IMPORT SWERVICE WORKER MODULES TO SERVICE WORKER CONTEXT */
const EXTENSION_MANIFEST 	= chrome.runtime.getManifest ();
const SW_scripts 			= EXTENSION_MANIFEST.background["SW_scripts"];

self.importScripts.apply( null, SW_scripts );

//set storage keys:
new Promise 
(
	async ( RESOLVE, REJECT ) => 
	{
		const STORAGE_INFO = await get_storage ( GLOBALS.storage_keys );

		for ( let [storage_name, storage_value] of Object.entries ( GLOBALS.storage_keys ) ) 
		{
			if ( STORAGE_INFO[ storage_name ] == null || STORAGE_INFO[ storage_name ] == undefined ) 
			{
				STORAGE_INFO[ storage_name ] = storage_value;
			};
		};

		// extension app options :
		for ( let option_item in GLOBALS.app_options ) 
		{
			if ( STORAGE_INFO["OPTIONS"][ option_item ] == null || STORAGE_INFO["OPTIONS"][ option_item ] == undefined ) 
			{
				STORAGE_INFO["OPTIONS"][ option_item ] = GLOBALS.app_options[ option_item ];
			};
		};

		await set_storage ( STORAGE_INFO );

		//await set_alarms ();
	}
);

function set_badge ( text_, color, tab_id, callback ) 
{
	chrome.action.setBadgeText 
	(
		{ text : text_, tabId : tab_id }, 
		() => 
		{
			if ( color ) 
			{
				set_badge_color ( color, tab_id, callback );
			}
			else if ( callback && callback != null ) 
			{
				callback ();
			};
		}
	);
};

function set_badge_color ( color, tab_id, callback ) 
{
	chrome.action.setBadgeBackgroundColor
	(
		{ color : color, tabId : tab_id }, 
		callback
	);
};

let prompted_texts_qty = " ";
let blinking_stopped = true;
async function start_blinking () 
{
	blinking_stopped = false;

	const ACTIVE_TAB = await query_tabs( { "active" : true, "currentWindow" : true } );

	do 
	{
		await delay(200);
		set_badge(``, "#00ff11", ACTIVE_TAB[0].id); 
		await delay(200); 
		set_badge(`${ prompted_texts_qty }`, "#00ff11", ACTIVE_TAB[0].id)

		if ( blinking_stopped == true ) 
		{
			set_badge(`done`, "#00ff11", ACTIVE_TAB[0].id);
			prompted_texts_qty = " ";
			return true;
		};
	}
	while ( blinking_stopped == false );
};