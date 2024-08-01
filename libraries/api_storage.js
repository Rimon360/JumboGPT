//FOR MANIFEST V2

function get_storage ( KEYS ) 
{
	const STORAGE = new Promise 
	(
		( RESOLVE, REJECT ) => 
		{
			local_storage.get 
			(
				KEYS,
				( INFO ) => 
				{
					RESOLVE( INFO );
				}
			);
		}
	);

	return STORAGE;
};

function set_storage ( DATA ) 
{
	const STORAGE = new Promise 
	(
		( RESOLVE, REJECT ) => 
		{
			local_storage.set 
			(
				DATA,
				() => 
				{
					RESOLVE( DATA );
				}
			);
		}
	);

	return STORAGE;
};
