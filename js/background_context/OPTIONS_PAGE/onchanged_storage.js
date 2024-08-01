//set scannner changes states changes listener:
chrome.storage.onChanged.addListener 
(
	async ( KEYS ) => 
	{
		if ( KEYS[ "start_app_confirmed" ] ) 
		{
			location.reload ();
		};
		if ( KEYS[ "TASKS_LOG" ] ) 
		{
			show_logged_tasks ();
		};
		if ( KEYS[ "extension_state" ] ) 
		{
			update_states_info_component ();
		};
		if ( KEYS[ "OPTIONS" ] ) 
		{
			if ( KEYS[ "OPTIONS" ]["newValue"] ) 
			{

			};
		};
	}
);