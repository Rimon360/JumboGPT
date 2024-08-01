//FOR MANIFEST V2

/*
	CHROME TABS
*/
const tabs = typeof( GLOBALS[ "tabs" ] ) != "undefined" ? GLOBALS[ "tabs" ] : chrome.tabs;

function connect_tab ( TAB_ID, CONNECT_INFO ) //returns A port that can be used to communicate with the content scripts running in the specified tab. The port's runtime.Port event is fired if the tab closes or does not exist.
{
	tabs.connect( TAB_ID, CONNECT_INFO );
};

function create_tab ( TAB_PROPERTIES ) 
{
	const TAB = new Promise 
	(
		( RESOLVE, REJECT ) => 
		{
			tabs.create 
			( 
				TAB_PROPERTIES,
				( CREATED_TAB ) => 
				{
					RESOLVE( CREATED_TAB );
				}
			)
		}
	).catch 
	(
		( ERROR ) => 
		{
			console.log( `\n\n\n ERROR WHILE CREATING TAB : \n\n ${ ERROR.message } \n\n\n` );
		}
	);

	return TAB;
};

function detectLanguage_tab ( TAB_ID ) 
{
	const TAB_LANGUAGE = new Promise 
	(
		( RESOLVE, REJECT ) => 
		{
			tabs.detectLanguage 
			(
				TAB_ID, 
				( LANGUAGE ) => 
				{
					RESOLVE( LANGUAGE );
				}
			);
		}
	)
	.catch 
	(
		( ERROR ) => 
		{
			console.log( `\n\n\n ERROR WHILE TAB LANGUAGE : \n\n ${ ERROR.message } \n\n\n` );
		}
	);

	return TAB_LANGUAGE;
};

function discard_tab ( TAB_ID ) 
{
	const DISCARDED = new Promise 
	(
		( RESOLVE, REJECT ) => 
		{	
			tabs.discard 
			(
				TAB_ID,
				( DISCARDED_TAB ) => 
				{
					RESOLVE( DISCARDED_TAB );
				} 
			);
		}
	).catch 
	(
		( ERROR ) => 
		{
			console.log( `\n\n\n ERROR WHILE DISCARDING TAB  : \n\n ${ ERROR.message } \n\n\n` );
		}
	);

	return DISCARDED;
};

function duplicate_tab ( TAB_ID ) 
{
	const DUPLICATED = new Promise 
	(
		( RESOLVE, REJECT ) => 
		{
			tabs.duplicate 
			(
				TAB_ID, 
				( DUPLICATED_TAB ) => 
				{
					RESOLVE( DUPLICATED_TAB );
				}
			);
		}
	)
	.catch 
	(
		( ERROR ) => 
		{
			console.log( `\n\n\n ERROR WHILE DUPLOCATING TAB : \n\n ${ ERROR.message } \n\n\n` );
		}
	);

	return DUPLICATED;
};

function get_tab ( TAB_ID ) 
{
	const TAB = new Promise 
	(
		( RESOLVE, REJECT ) => 
		{
			tabs.get
			(
				TAB_ID, 
				( TAB_INFO ) => 
				{
					RESOLVE( TAB_INFO );
				}
			);
		}
	)
	.catch 
	(
		( ERROR ) => 
		{
			console.log( `\n\n\n ERROR WHILE GETTING TAB INFO : \n\n ${ ERROR.message } \n\n\n` );
		}
	);

	return TAB;
};

function getCurrent_tab () 
{
	const TAB = new Promise 
	(
		( RESOLVE, REJECT ) => 
		{
			tabs.getCurrent 
			(
				( TAB_INFO ) => 
				{
					RESOLVE( TAB_INFO );
				}
			)
		}
	)
	.catch 
	(
		( ERROR ) => 
		{
			console.log( `\n\n\n ERROR WHILE GETTING TAB : \n\n ${ ERROR.message } \n\n\n` );
		}
	);

	return TAB;
};

function query_tabs ( QUERY_INFO ) 
{
	const QUERIED_TABS = new Promise 
	(
		( RESOLVE, REJECT ) => 
		{
			tabs.query
			(
				QUERY_INFO,
				( TABS ) => 
				{
					RESOLVE( TABS );
				}
			);
		}
	)
	.catch 
	(
		( ERROR ) => 
		{
			console.log( `\n\n\n ERROR WHILE QUERING TABS : \n\n ${ ERROR.message } \n\n\n` );
		}
	);

	return QUERIED_TABS;
};

function captureVisible_tab ( WINDOW_ID, IMAGE_OPTIONS ) //REQUIRES activeTab or <all_urls> permission.
{
	const IMAGE_CAPTURED = new Promise 
	(
		( RESOLVE, REJECT ) => 
		{
			tabs.captureVisibleTab
			(
				WINDOW_ID, 
				IMAGE_OPTIONS, 
				( IMAGE_DATA_URL ) => 
				{	
					RESOLVE( IMAGE_DATA_URL );
				}
			);
		}
	)
	.catch 
	(
		( ERROR ) => 
		{
			console.log( `\n\n\n ERROR WHILE CAPTURING VISIBLE TAB : \n\n ${ ERROR.message } \n\n\n` );
		}
	);

	return IMAGE_CAPTURED;
};

function getZoom_tab ( TAB_ID ) //Gets the current zoom factor of a specified tab. 
{
	const TAB_ZOOM = new Promise 
	(
		( RESOLVE, REJECT ) => 
		{
			tabs.getZoom
			(
				TAB_ID, 
				( ZOOM_FACTOR ) => // : int
				{	
					RESOLVE( ZOOM_FACTOR );
				}
			);
		}
	)
	.catch 
	(
		( ERROR ) => 
		{
			console.log( `\n\n\n ERROR WHILE GETTING TAB ZOOM : \n\n ${ ERROR.message } \n\n\n` );
		}
	);

	return TAB_ZOOM;
};

function getZoomSettings_tab ( TAB_ID ) 
{
	const ZOOM_SETTINGS = new Promise 
	(
		( RESOLVE, REJECT ) => 
		{
			tabs.getZoomSettings 
			(
				TAB_ID,
				( SETTINGS_INFO ) => 
				{
					RESOLVE( SETTINGS_INFO );
				} 
			);
		}
	)
	.catch 
	(
		( ERROR ) => 
		{
			console.log( `\n\n\n ERROR WHILE GETTING ZOOM SETTINGS FROM TAB : \n\n ${ ERROR.message } \n\n\n` );
		}
	);

	return ZOOM_SETTINGS;
};

function goBack_tab ( TAB_ID ) //Go back to the previous page, if one is available.
{
	const TARGET_TAB = new Promise 
	(
		( RESOLVE, REJECT ) => 
		{
			tabs.goBack 
			(
				TAB_ID,
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
			console.log( `\n\n\n ERROR WHILE GOING BACK TO TAB : \n\n ${ ERROR.message } \n\n\n` );
		}
	);

	return TARGET_TAB;
};

function goForward_tab ( TAB_ID ) 
{
	const TARGET_TAB = new Promise 
	(
		( RESOLVE, REJECT ) => 
		{
			tabs.goForward 
			(
				TAB_ID,
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
			console.log( `\n\n\n ERROR WHILE ... : \n\n ${ ERROR.message } \n\n\n` );
		}
	);

	return TARGET_TAB;
};

function group_tabs ( GROUP_OPTIONS ) 
{
	const GROUP_ID = new Promise 
	(
		( RESOLVE, REJECT ) => 
		{
			tabs.group 
			(
				GROUP_OPTIONS,
				( GROUP_ID_ ) => 
				{
					RESOLVE( GROUP_ID_ );
				}
			);
		}
	)
	.catch 
	(
		( ERROR ) => 
		{
			console.log( `\n\n\n ERROR WHILE GROUPING TABS : \n\n ${ ERROR.message } \n\n\n` );
		}
	);

	return GROUP_ID;
};

function highlight_tab ( HIGHLIGHT_OPTIONS ) 
{	
	const WINDOW_ = new Promise 
	(
		( RESOLVE, REJECT ) => 
		{
			tabs.highlight
			(
				HIGHLIGHT_OPTIONS,
				( WINDOW_DETAILS ) =>  //Contains details about the window whose tabs were highlighted.
				{
					RESOLVE( WINDOW_DETAILS );
				}
			);
		}
	)
	.catch 
	(
		( ERROR ) => 
		{
			console.log( `\n\n\n ERROR WHILE HIGHLIGHTING TABS : \n\n ${ ERROR.message } \n\n\n` );
		}
	);

	return WINDOW_;
};

function insertCSS_tab ( TAB_ID, INJECT_OPTIONS ) 
{
	const TARGET_TAB = new Promise 
	(
		( RESOLVE, REJECT ) => 
		{
			tabs.insertCSS 
			(
				TAB_ID,
				INJECT_OPTIONS,
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
			console.log( `\n\n\n ERROR WHILE INSERTING CSS IN TAB : \n\n ${ ERROR.message } \n\n\n` );
		}
	);

	return TARGET_TAB;
};

function move_tab ( TAB_IDs, MOVE_OPTIONS ) 
{
	const TARGET_TABs = new Promise 
	(
		( RESOLVE, REJECT ) => 
		{
			tabs.move 
			(
				TAB_IDs,
				MOVE_OPTIONS,
				( TABs ) => 
				{
					RESOLVE( TABs );
				}
			);
		}
	)
	.catch 
	(
		( ERROR ) => 
		{
			console.log( `\n\n\n ERROR WHILE MOVING TAB or TABS : \n\n ${ ERROR.message } \n\n\n` );
		}
	);

	return TARGET_TABs;
};

function reload_tab ( TAB_ID, RELOAD_OPTIONS ) 
{	
	const TARGET_TAB = new Promise 
	(
		( RESOLVE, REJECT ) => 
		{
			tabs.reload 
			(
				TAB_ID,
				RELOAD_OPTIONS,
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
			console.log( `\n\n\n ERROR WHILE RELOADING TAB : \n\n ${ ERROR.message } \n\n\n` );
		}
	);

	return TARGET_TAB;
};

function remove_tab ( TAB_IDs ) 
{
	const TARGET_TABs = new Promise 
	(
		( RESOLVE, REJECT ) => 
		{
			tabs.remove 
			(
				TAB_IDs,
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
			console.log( `\n\n\n ERROR WHILE REMOVING TAB : \n\n ${ ERROR.message } \n\n\n` );
		}
	);

	return TARGET_TABs;
};

function removeCSS_tab ( TAB_ID, DELETE_INJECTION_OPTIONS ) 
{
	const TARGET_TAB = new Promise 
	(
		( RESOLVE, REJECT ) => 
		{
			tabs.removeCSS 
			(
				TAB_ID,
				DELETE_INJECTION_OPTIONS,
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
			console.log( `\n\n\n ERROR WHILE REMOVING CSS IN TAB : \n\n ${ ERROR.message } \n\n\n` );
		}
	);

	return TARGET_TAB;
};

function sendMessage_to_tab ( TAB_ID, MESSAGE, OPTIONS ) 
{
	const RESPONSE = new Promise 
	(
		( RESOLVE, REJECT ) => 
		{
			tabs.sendMessage 
			(
				TAB_ID,
				MESSAGE,
				OPTIONS,
				( RESPONSE_RECEIVED ) => 
				{
					RESOLVE( RESPONSE_RECEIVED );
				}
			);
		}
	)
	.catch 
	(
		( ERROR ) => 
		{
			console.log( `\n\n\n ERROR WHILE SENDING MESSAGE TO TAB : \n\n ${ ERROR.message } \n\n\n` );
		}
	);

	return RESPONSE;
};

function setZoom_to_tab ( TAB_ID, ZOOM_FACTOR ) 
{
	const TARGET_TAB = new Promise 
	(
		( RESOLVE, REJECT ) => 
		{
			tabs.setZoom 
			(
				TAB_ID,
				ZOOM_FACTOR,
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
			console.log( `\n\n\n ERROR WHILE SETTING ZOOM TO TAB : \n\n ${ ERROR.message } \n\n\n` );
		}
	);

	return TARGET_TAB;
};

function setZoomSettings_to_tab ( TAB_ID, ZOOM_OPTIONS ) 
{
	const TARGET_TAB = new Promise 
	(
		( RESOLVE, REJECT ) => 
		{
			tabs.setZoomSettings 
			(
				TAB_ID,
				ZOOM_OPTIONS,
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
			console.log( `\n\n\n ERROR WHILE SETTING ZOOM SETTINGS IN TAB : \n\n ${ ERROR.message } \n\n\n` );
		}
	);

	return TARGET_TAB;
};

function ungroup_tabs ( TAB_IDs ) 
{
	const TARGET_TABs = new Promise 
	(
		( RESOLVE, REJECT ) => 
		{
			tabs.ungroup 
			(
				TAB_IDs,
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
			console.log( `\n\n\n ERROR WHILE UNGROUPING TABS : \n\n ${ ERROR.message } \n\n\n` );
		}
	);

	return TARGET_TABs
};

function update_tab ( TAB_ID, UPDATE_OPTIONS ) 
{
	const TARGET_TAB = new Promise 
	(
		( RESOLVE, REJECT ) => 
		{
			tabs.update 
			(
				TAB_ID,
				UPDATE_OPTIONS,
				( TAB ) => 
				{
					RESOLVE( TAB );
				}
			);
		}
	)
	.catch 
	(
		( ERROR ) => 
		{
			console.log( `\n\n\n ERROR WHILE UPDATING TAB : \n\n ${ ERROR.message } \n\n\n` );
		}
	);

	return TARGET_TAB;
};