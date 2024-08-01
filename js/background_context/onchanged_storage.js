//set scannner changes states changes listener:
chrome.storage.onChanged.addListener 
(
	async ( KEYS ) => 
	{
		if ( KEYS[ "start_app_confirmed" ] ) 
		{
			if ( KEYS[ "start_app_confirmed" ]["newValue"] == true ) 
			{

			};
		};
		if ( KEYS[ "extension_state" ] ) 
		{
			const ACTIVE_TAB = await query_tabs ( { "active" : true } );

			reload_tab ( ACTIVE_TAB["id"], {} );
		};
		if ( KEYS[ "OPTIONS" ] ) 
		{
			for ( let [option_name, option_value] of Object.entries ( KEYS[ "OPTIONS" ]["newValue"] ) ) 
			{
				/*
				if ( option_value["alarm_id"] != null ) 
				{	
					await create_alarm_interval ( option_value["alarm_id"], option_value["value"] );
				};
				*/
			};
		};
	}
);