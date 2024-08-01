function print_response ( response ) 
{
    if ( response ) 
    {
        console.log( response );
    };
};

function message_to_background ( method, payload ) 
{
    const com = 
    {
        method  : method,
        payload : payload
    };
    const RESPONSE = new Promise 
    (
        ( RESOLVE, REJ ) => 
        {
            chrome.runtime.sendMessage 
            ( 
                com, 
                ( RESPONSE_GOTTEN ) => 
                {
                    RESOLVE ( RESPONSE_GOTTEN );
                    print_response ( RESPONSE_GOTTEN );
                } 
            );
        }
    );

    return RESPONSE;
};

function message_to_contentscript ( method, payload, TAB_ID ) 
{
    return new Promise 
    (
        async ( RESOLVE, REJECT ) => 
        {
            const com = 
            {
                method  : method,
                payload : payload
            };

            const tab_response = await sendMessage_to_tab ( TAB_ID, com, null );

            RESOLVE ( tab_response );
        }
    );
};

function handle_request ( message, sender, sendResponse ) 
{
    const method    = message.method;
    const payload   = message.payload; 

    switch ( method ) 
    {
        case "HIDE_SPLASH_SCREEN" :
            hide_splash_screen ();
            set_app_logo_icons ( { "heartbeat" : false } );
            set_appnames ();
            sendResponse ( "ok" );
        case "SHOW_SPLASH_SCREEN" :
            show_splash_screen ();
            set_app_logo_icons ( { "heartbeat" : false } );
            set_appnames ();
            sendResponse ( "ok" );
            break;
    };

    return true;
};

chrome.runtime.onMessage.addListener ( handle_request );