async function set_app_options_props ( OPTIONS_DATA ) 
{
	console.log( OPTIONS_DATA );

	const STORAGE_INFO = await get_storage( GLOBALS.storage_keys );

	for ( let [option_name, option_value] of Object.entries( OPTIONS_DATA ) ) 
	{
		if ( STORAGE_INFO[ "OPTIONS" ][ option_name ] ) 
		{
			STORAGE_INFO[ "OPTIONS" ][ option_name ] = option_value;
		};		
	};

	await set_storage( STORAGE_INFO );
};
