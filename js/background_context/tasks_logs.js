async function save_tasks_log ( LOG_TEXT ) 
{
	const STORAGE_INFO 	= await get_storage ();
	const DAY_MONTH 	= new Date().toString().match ( /([a-zA-Z]+ +[a-zA-Z]+)/gi )[0];
	const TIME 			= new Date().toString().match ( /([0-9]+:[0-9]+:[0-9]+)/gi )[0];

	STORAGE_INFO[ "TASKS_LOG" ] += `----\n\n${DAY_MONTH} - ${TIME} | ` + LOG_TEXT + "\n\n";

	return await set_storage ( {"TASKS_LOG":STORAGE_INFO[ "TASKS_LOG" ]} );
};

async function clear_saved_log () 
{
	const STORAGE_INFO = await get_storage ( GLOBALS.storage_keys );	

	STORAGE_INFO[ "TASKS_LOG" ] = "";

	return await set_storage ( { "TASKS_LOG" : STORAGE_INFO[ "TASKS_LOG" ] } );
};