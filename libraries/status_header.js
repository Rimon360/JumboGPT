const status_header = {
    element: null,

    create: () =>
    {
        const html =
            `
        <!--<fixed-status-header>-->
                <text> </text>
                <button> Ok </button>
        <!--</fixed-status-header>-->
        `;
        const COMPONENT         = document.createElement("fixed-status-header");

        COMPONENT.innerHTML     = html;
        
        const close_btn         = COMPONENT.getElementsByTagName("button")[0];

        COMPONENT.classList.add( "fade-in" );
        close_btn.addEventListener( "click", status_header.hide );

        return COMPONENT;
    },

    inject: ( INJECT_TARGET ) =>
    {
        const COMPONENT = status_header.create();
        const is_already_injected = INJECT_TARGET.getElementsByTagName("fixed-status-header").length > 0;

        if (is_already_injected == false)
        {
            INJECT_TARGET.prepend( COMPONENT );
        };

        status_header.element = COMPONENT;
    },

    set_text: ( text ) =>
    {
        try
        {
            if ( status_header.element )
                status_header.element.querySelector("text").innerHTML = text;
        }
        catch ( e )
        {
            console.log( e );
        };
    },

    show: () =>
    {
        try
        {
            if ( status_header.element )
                status_header.element.setAttribute("style", "display: flex;");
        }
        catch ( e )
        {
            console.log( e );
        };
    },
    
    hide: () =>
    {
        try
        {
            if ( status_header.element )
                status_header.element.setAttribute("style", "display: none;");
        }
        catch (e)
        {
            console.log(e);
        };
    }
};