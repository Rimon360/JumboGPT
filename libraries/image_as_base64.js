function read_file ( STREAM ) 
{
    try 
    {
        return new Promise 
        (
            ( RESOLVE, REJECT ) => 
            {
                const reader = new FileReader();

                reader.onloadend = () =>
                {
                    try 
                    {
                        const content = 
                        {
                            base64      : reader.result,
                            binaryBlob  : atob( reader.result.split( ',' )[1] )
                        };

                        RESOLVE( content );    
                    } 
                    catch ( ERROR ) 
                    {
                        // statements
                        console.log( ERROR );
                    };
                };

                reader.readAsDataURL( STREAM );
            }
        );  
    } 
    catch ( ERROR ) 
    {
        // statements
        console.log( ERROR );
    }
};

async function get_image_as_base64 ( URL ) 
{
    try 
    {
        const BLOB_CONTENT = await make_xhr (
            {
                "method"            : "GET",
                "url"               : URL,
                "response_type"     : "blob"
            }
        );
        
        if ( BLOB_CONTENT.status >= 200 && BLOB_CONTENT.status < 399 ) 
        {
            const NEW_CONTENT = await read_file ( BLOB_CONTENT.response );

            return NEW_CONTENT;
        };    
    } 
    catch ( ERROR ) 
    {
        // statements
        console.log ( ERROR );
    }
};