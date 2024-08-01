function make_auth ( USERNAME, KEY ) 
{
	return new Promise 
	(
		async ( RESOLVE, REJECT ) => 
		{
			let response_data = "";
			const REQUEST = 
			{
				method 	: "GET",
				url 	: `https://cryptolens.herokuapp.com/?product=${ GLOBALS.heroku_auth.product_id }&key=${ KEY }&machine=${ USERNAME }`
			};
			const XHR = await make_xhr ( REQUEST );

			if ( XHR.status >= 200 && XHR.status < 399 ) 
			{
				if ( XHR.response ) 
				{
					response_data = JSON.parse ( XHR.response );
				};
			};

			RESOLVE ( response_data );
		}
	);
};

async function auth_failed_handler () 
{
	const STORAGE_INFO = await get_storage ();

	revoke_auth_credentials ();
	change_element_background ( status_header.element, GLOBALS.status_colors.off );
	status_header.set_text ( "AUTH FAILED" );
	show_element ( status_header.element );

	await delay ( 2000 );

	//set started app state:
	STORAGE_INFO[ "start_app_confirmed" ] = false;
	await set_storage ( { "start_app_confirmed" : STORAGE_INFO[ "start_app_confirmed" ] } );
};

async function auth_success_handler ( CREDENTIALS_DATA ) 
{
	const STORAGE_INFO = await get_storage ();

	change_element_background ( status_header.element, GLOBALS.status_colors.on );
	status_header.set_text ( "SUCCESS"/*"HEROKU AUTH SUCCESS"*/ );
	show_element ( status_header.element );

	await delay ( 2000 );

	//set started app state:
	STORAGE_INFO[ "start_app_confirmed" ] = true;
	await set_storage ( { "start_app_confirmed" : STORAGE_INFO[ "start_app_confirmed" ] } );
};

async function save_auth_credentials ( CREDENTIALS_DATA ) 
{
	await set_storage ( { "heroku_credentials" : CREDENTIALS_DATA } );
};

function revoke_auth_credentials () 
{
	return set_storage ( { "heroku_credentials" : {} } )	
};

async function check_license () //UPDATED
{
	const STORAGE_INFO 	= await get_storage ();
	const lic_key 		= STORAGE_INFO[ "heroku_credentials" ].key;
	const username 		= STORAGE_INFO[ "heroku_credentials" ].user;
	const is_licenced 	= await make_auth ( username, lic_key );

	if ( lic_key && username ) 
	{
		if ( is_licenced.success == false ) 
		{
			STORAGE_INFO[ "heroku_credentials" ]["is_licenced"] = false;
			STORAGE_INFO[ "start_app_confirmed" ] = false;
		}
		else if ( is_licenced.success == true ) 
		{
			STORAGE_INFO[ "heroku_credentials" ]["is_licenced"] = true;	
			STORAGE_INFO[ "start_app_confirmed" ] = true;
		};
	}

	await set_storage ( 
		{ 
			"heroku_credentials" 	: STORAGE_INFO[ "heroku_credentials" ],
			"start_app_confirmed" 	: STORAGE_INFO[ "start_app_confirmed" ]  
		} 
	);

	return is_licenced.success;
};