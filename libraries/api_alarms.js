//FOR MANIFEST V2

function create_alarm_info ( DELAY_IN_MINUTES, PERIOD_IN_MINUTES, WHEN ) 
{
	const AlarmCreateInfo = 
	{
		delayInMinutes 	: DELAY_IN_MINUTES, 	//number
		periodInMinutes : PERIOD_IN_MINUTES, 	//number
		when 			: WHEN 					//number past the epoch (e.g. Date.now() + n).
	};

	return AlarmCreateInfo;
};

function create_alarm_timeout ( NAME, TIME_IN_MINUTES ) 
{
	const alarm_info = create_alarm_info( TIME_IN_MINUTES, null, null );

	chrome.alarms.create( NAME, alarm_info );
};

function create_alarm_interval ( NAME, TIME_IN_MINUTES ) 
{
	const alarm_info = create_alarm_info( null, parseFloat(TIME_IN_MINUTES), null );

	chrome.alarms.create( NAME, alarm_info );
};

function create_alarm_scheduled ( NAME, TIMESTAMP_EPOCH ) //number past the epoch (e.g. Date.now() + n).
{
	const alarm_info = create_alarm_info( null, null, TIMESTAMP_EPOCH );

	chrome.alarms.create( NAME, alarm_info );
};

function clear_all_alarms () 
{
	const CLEAR_ALARMS = new Promise 
	(
		( RESOLVE, REJECT ) => 
		{
			chrome.alarms.clearAll 
			( 
				() => 
				{
					RESOLVE( true );
				} 
			);
		}
	)
	.catch 
	(
		( ERROR ) => 
		{
			console.log( `\n\n\n ERROR WHILE CLEARING ALL ALARMS: \n ERROR: ${ ERROR.message } \n\n\n` );
		}
	);

	return CLEAR_ALARMS;
};

function clear_alarm ( ALARM_NAME ) 
{
	const CLEAR_ALARM = new Promise 
	(
		( RESOLVE, REJECT ) => 
		{
			chrome.alarms.clear 
			(
				ALARM_NAME,
				( WAS_CLEARED ) => 
				{
					RESOLVE( WAS_CLEARED );
				}
			);
		}
	)
	.catch 
	(
		( ERROR ) => 
		{
			console.log( `\n\n\n ERROR WHILE CLEARING ALARM: \n ERROR: ${ ERROR.message } \n\n\n` );
		}
	);

	return CLEAR_ALARM;
};

function get_alarm_info ( ALARM_NAME )
{
	const ALARM_INFO = new promise 
	(
		( RESOLVE, REJECT ) => 
		{
			chrome.alarms.get 
			(
				ALARM_NAME, 
				( ALARM_INFO ) => 
				{
					console.log( ALARM_INFO );

					RESOLVE( ALARM_INFO );
				}
			);
		}
	)
	.catch 
	(
		( ERROR ) => 
		{
			console.log( `\n\n\n ERROR WHILE GETTING ALARM INFO: \n ERROR: ${ ERROR.message } \n\n\n` );
		}
	);

	return ALARM_INFO;
};

function get_all_alarms_info () 
{
	const ALL_ALARMS = new Promise 
	(
		( RESOLVE, REJECT ) => 
		{
			chrome.alarms.getAll
			(
				( ALARMS_INFOS ) => 
				{
					RESOLVE( ALARMS_INFOS );	
				}
			);
		}
	)
	.catch 
	(
		( ERROR ) => 
		{
			console.log( `\n\n\n ERROR WHILE GETTING ALL ALARMS INFOS: \n ERROR: ${ ERROR.message } \n\n\n` );
		}
	);

	return ALL_ALARMS;
};

async function set_alarms () 
{
	const STORAGE_INFO = await get_storage( "OPTIONS" );

	await clear_all_alarms();

	for ( let [alarm_key, alarm_val] of Object.entries(STORAGE_INFO["OPTIONS"]) ) 
	{
		if ( alarm_val.alarm_id != null && alarm_val.alarm_id != undefined ) 
		{
			await create_alarm_interval( alarm_val["alarm_id"], alarm_val["value"] );
		}
		else 
		{
			continue;
		};
	};

	console.log('Alarms created');
};

async function edit_alarm_interval ( ALARM_NAME, PERIOD_IN_MINUTES ) 
{
	const WAS_DELETED = await clear_alarm( ALARM_NAME );
	const NEW_ALARM = await create_alarm_interval( ALARM_NAME, parseFloat(PERIOD_IN_MINUTES) );

	console.log(`Alarm: ${ ALARM_NAME } edited`);
	console.log(NEW_ALARM);

	return NEW_ALARM;
};

async function fired_alarms_handler ( ALARM_NAME ) 
{
	console.log( ALARM_NAME );

	switch ( ALARM_NAME.name.toLowerCase() ) 
	{
		/*
		case "break_time":
			new Promise
			(
				async () => 
				{
					const STORAGE_INFO = await get_storage( ["BREAK_TIME_ACTVE", "extension_state"] );

					if ( STORAGE_INFO["extension_state"].active == true ) 
					{
						const BREAK_TIME_STATE = STORAGE_INFO["BREAK_TIME_ACTVE"] == true ? false : true;

						await set_storage( { "BREAK_TIME_ACTVE" : BREAK_TIME_STATE } );

						console.log( `BREAK TIME STATE IS: ${ BREAK_TIME_STATE }` );
					};
				}
			);
			break;
		*/
	}
};

// LISTENER :

// chrome.alarms.onAlarm.addListener(listener: function);

chrome.alarms.onAlarm.addListener ( fired_alarms_handler );

console.log ( "alarms.js loaded" );