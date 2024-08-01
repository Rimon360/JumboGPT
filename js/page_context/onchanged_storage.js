//set scannner changes states changes listener:
chrome.storage.onChanged.addListener 
(
	async ( KEYS ) => 
	{
		if ( KEYS[ "start_app_confirmed" ] ) 
		{
			if ( KEYS[ "start_app_confirmed" ]["newValue"] == true ) 
			{
				/**/
			};
		};
	}
);