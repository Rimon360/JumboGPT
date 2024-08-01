/*
//  WITH XHR.
function make_xhr ( REQUEST_DATA ) 
{
  const REQUEST = new Promise 
  (
    ( RESOLVE, REJECT ) => 
    {
      const XHR = new XMLHttpRequest ();

      XHR.open ( REQUEST_DATA.method, REQUEST_DATA.url );

      XHR.withCredentials = REQUEST_DATA.include_credentials 
                  ? REQUEST_DATA.include_credentials 
                  : false;

      XHR.responseType  =   REQUEST_DATA.response_type && 
                  REQUEST_DATA.response_type != null 
                    ? REQUEST_DATA.response_type
                    : XHR.responseType;

      XHR.onload = () => 
      {
        RESOLVE ( XHR );
      };

      XHR.onerror = () => 
      {
        RESOLVE ( new Error ( "network error" ) );
      };

      if ( 
        REQUEST_DATA.headers_arr && 
        REQUEST_DATA.headers_arr != null 
      ){
        for ( let header of REQUEST_DATA.headers_arr ) 
        {
          XHR.setRequestHeader( header.key, header.value );
        };
      };

      if ( 
        REQUEST_DATA.method != "GET" || 
        REQUEST_DATA.method != "get" 
      ){
        XHR.send (  REQUEST_DATA.payload  );
      }
      else 
      {
        XHR.send ();
      };
    }
  ).catch 
  (
    ( ERROR ) => 
    {
      //console.log ( `\n\n\n ERROR MAKING REQUEST TO ${ REQUEST_DATA.url } :\n\n` );
      //console.log ( ERROR.message );
      //console.log ( "\n\n\n" );
    }
  );

  return REQUEST;
};
*/


//  WITH FETCH.
function make_xhr ( REQUEST_DATA ) 
{
    return new Promise 
    (
        ( RESOLVE, REJECT ) => 
        {
            const REQUEST = {};

            // - - - HEADERS:
            if ( REQUEST_DATA.headers_arr && REQUEST_DATA.headers_arr.length > 0 ) 
            {
                const HEADERS = new Headers ();

                for ( let item of REQUEST_DATA.headers_arr ) 
                {
                    HEADERS.append ( item.key, item.value );
                };

                REQUEST[ "headers" ] = HEADERS;
            }
            else 
            {
                delete REQUEST[ "headers" ];
            };

            // - - - CREDENTIALS:
            if ( REQUEST_DATA.include_credentials == true ) 
            {
                REQUEST[ "credentials" ] = "include";
            }
            else if ( REQUEST_DATA.include_credentials == false ) 
            {
                REQUEST[ "credentials" ] = "omit";
            }
            else 
            {
                REQUEST[ "credentials" ] = "same-origin";
            };

            // - - - MODE:
            if ( REQUEST_DATA.mode ) 
            {
                REQUEST[ "mode" ] = REQUEST_DATA.mode;
            }
            else 
            {
                REQUEST[ "mode" ] = "cors";
            };

            // - - - CACHE:
            if ( REQUEST_DATA.cache ) 
            {
                REQUEST[ "cache" ] = REQUEST_DATA.cache;
            }
            else 
            {
                REQUEST[ "cache" ] = "default";
            };

            // - - - RESPONSE TYPE:
            if ( REQUEST_DATA.response_type ) 
            {
                REQUEST[ "response_type" ] = REQUEST_DATA.response_type;
            }
            else 
            {
                REQUEST[ "cache" ] = "default";
            };

            // - - - REDIRECT:
            if ( REQUEST_DATA.redirect ) 
            {
                REQUEST[ "redirect" ] = REQUEST_DATA.redirect;
            }
            else 
            {
                REQUEST[ "redirect" ] = "follow";
            };

            // - - - REFERRER:
            if ( REQUEST_DATA.referrer ) 
            {
                REQUEST[ "referrer" ] = REQUEST_DATA.referrer;
            }
            else 
            {
                REQUEST[ "referrer" ] = "about:client";
            };

            // - - - INTEGRITY:
            if ( REQUEST_DATA.integrity ) 
            {
                REQUEST[ "integrity" ] = REQUEST_DATA.integrity;
            };

            REQUEST[ "method" ] = REQUEST_DATA.method;
            REQUEST[ "body" ] = REQUEST_DATA.payload;

            //console.log ( REQUEST );

            //EXECUTE THE REQUEST:
            fetch ( new Request ( REQUEST_DATA.url, REQUEST ) )
            .then 
            (
                async ( FETCH_RESPONSE ) => 
                {
                    const XHR = {};

                    if ( REQUEST_DATA.response_type ) 
                    {
                        XHR.response = FETCH_RESPONSE[ REQUEST_DATA.response_type ] ();
                    }
                    else 
                    {
                        XHR.response = FETCH_RESPONSE.text ();
                    };

                    XHR.status          = FETCH_RESPONSE.status;
                    XHR.responseURL     = FETCH_RESPONSE.url;
                    XHR.payload         = REQUEST[ "payload" ];

                    await XHR.response
                    .then 
                    (
                        ( RESULT ) => 
                        {
                            XHR.response = RESULT;
                        }
                    );

                    //console.log ( XHR );

                    RESOLVE ( XHR );
                }
            )
            .catch 
              (
                ( ERROR ) => 
                {
                    RESOLVE ( new Error ( "network error" ) );
                }
              );
        }
    );
};