function print_response ( response ) 
{
    if ( response ) 
    {
        console.log( response );
    };
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

function message_to_popup ( method, payload ) 
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
                    if ( chrome.runtime.lastError ) 
                    {
                        console.log ( chrome.runtime.lastError );
                    };

                    RESOLVE ( RESPONSE_GOTTEN );
                    print_response ( RESPONSE_GOTTEN );
                } 
            );
        }
    );

    return RESPONSE;
};

function handle_request ( message, sender, sendResponse ) 
{
    const method    = message.method;
    const payload   = message.payload; 

    switch ( method ) 
    {
        case "SET_BADGE" :
            set_badge ( payload.badge_icon, payload.badge_color );
            sendResponse ( "ok" );
            break;
        case "CLEAR_SAVED_TASKS_LOGS" :
            clear_saved_log ();
            sendResponse ("ok");
            break;
        case "CREATE_NEW_TAB" :     
            new Promise 
            (
                async ( RESOLVE, REJECT ) => 
                {
                    const TAB_PROPS = 
                    {
                        "url" : payload["url"],
                        "active" : payload["active"] ? payload["active"] : true
                    };
                    const CREATED_TAB = await create_tab ( TAB_PROPS );

                    //send the created tab details data stringified
                    sendResponse ( JSON.stringify ( CREATED_TAB ) );
                }
            );
            return true;
        case "CREATE_DESKTOP_NOTIFICATION" : 
            const NOTIFICATION_BODY = 
            {
                "title" : payload["title"],
                "message" : payload["message"],
                "id" : payload["id"],
                "buttons" : payload["buttons"]
            };

            create_notification ( NOTIFICATION_BODY["title"], NOTIFICATION_BODY["message"], NOTIFICATION_BODY["id"], NOTIFICATION_BODY["buttons"] );

            sendResponse ( "ok" );
            break;
        case "RELOAD_TABS" : 
            new Promise 
            (
                async ( RESOLVE, REJECT ) => 
                {
                    const TABS = await query_tabs ( {} );

                    for ( let tab_item of TABS ) 
                    {
                        if ( payload["url_match"] ) //if this option present will only reload matching certain tabs based on given keywords.
                        {
                            for ( let target_match of payload["url_match"] ) 
                            {
                                const IS_MATCHED_TAB_URL = tab_item["url"].split ( target_match ).length > 1;

                                if ( IS_MATCHED_TAB_URL == true ) 
                                {
                                    reload_tab ( tab_item["id"] );
                                }
                                else 
                                {
                                    continue;
                                };
                            };
                        }
                        else 
                        {
                            reload_tab ( tab_item["id"] );
                        };
                    };

                    sendResponse ( "ok" );
                }
            );
            return true;
        case "FOCUS_TAB" : 
            update_tab ( payload["TAB_ID"], { "active" : true } );
            sendResponse ( "ok" );
            break;
        case "EDIT_ALARM_INTERVAL" :     
            new Promise 
            (
                async ( RESOLVE, REJECT ) => 
                {
                    const NEW_ALARM = await edit_alarm_interval( payload["ALARM_NAME"], payload["PERIOD_IN_MINUTES"] );

                    sendResponse( "ok" );
                }
            );
            return true;
        case "START_BLINKING" :     
            new Promise 
            (
                async ( RESOLVE, REJECT ) => 
                {
                    sendResponse( "ok" );
                    start_blinking();
                }
            );
            return true;
        case "STOP_BLINKING" :     
            new Promise 
            (
                async ( RESOLVE, REJECT ) => 
                {
                    sendResponse( "ok" );
                    blinking_stopped = true;
                }
            );
            return true;
        case "UPDATE_PROMPTED_TEXTS_QTY" :     
            new Promise 
            (
                async ( RESOLVE, REJECT ) => 
                {
                    sendResponse( "ok" );
                    prompted_texts_qty = payload["prompted_texts_qty"];
                }
            );
            return true;
    };

    return true;
};

chrome.runtime.onMessage.addListener ( handle_request );