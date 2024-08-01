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
                    //print_response ( RESPONSE_GOTTEN );
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
        case "EXECUTE_PROMPTS" :
            new Promise
            (
                async () => 
                {
                    sendResponse("ok");

                    const PROMPTS_TEXTS = JSON.parse( payload["PROMPTS"] );
                    const PROMPTS_RESULTS = await execute_promtps( PROMPTS_TEXTS );
                }
            );
            return true;
    };

    return true;
};

chrome.runtime.onMessage.addListener ( handle_request );