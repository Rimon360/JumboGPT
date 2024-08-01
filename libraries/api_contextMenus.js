//FOR MANIFEST V2

const context_menus = typeof( GLOBALS["context_menus"] ) != "undefined" 
						? GLOBALS["context_menus"] 
						: chrome.contextMenus;

function create_context_menu ( CONTEXT_MENU_PROPERTIES ) 
{
	return new Promise 
	(
		( RESOLVE, REJECT ) => 
		{
			context_menus.create 
			(
				CONTEXT_MENU_PROPERTIES, 
				() => 
				{
					RESOLVE( true );

				    if ( chrome.runtime.lastError ) 
				    {
				    	console.log( chrome.runtime.lastError.message );
				    };
				}
			);
		}	
	);
};

function remove_context_menu ( MENU_ITEM_ID ) 
{
	return new Promise 
	(
		( RESOLVE, REJECT ) => 
		{
			context_menus.remove 
			(
				MENU_ITEM_ID, 
				() => 
				{
					RESOLVE( true );

				    if ( chrome.runtime.lastError ) 
				    {
				    	console.log( chrome.runtime.lastError.message );
				    };
				}
			);
		}	
	);
};

function remove_all_context_menu () 
{
	return new Promise 
	(
		( RESOLVE, REJECT ) => 
		{
			context_menus.removeAll 
			(
				() => 
				{
					RESOLVE( true );

				    if ( chrome.runtime.lastError ) 
				    {
				    	console.log( chrome.runtime.lastError.message );
				    };
				}
			);
		}	
	);
};

function update_context_menu ( ID, CONTEXT_MENU_UPDATE_PROPERTIES ) 
{
	return new Promise 
	(
		( RESOLVE, REJECT ) => 
		{
			context_menus.update 
			(
				ID,
				CONTEXT_MENU_UPDATE_PROPERTIES, 
				() => 
				{
					RESOLVE( true );

				    if ( chrome.runtime.lastError ) 
				    {
				    	console.log( chrome.runtime.lastError.message );
				    };
				}
			);
		}	
	);
};