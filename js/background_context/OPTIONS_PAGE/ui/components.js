const components = 
{
	create : ( HTML, CLASSLIST=[], ATTRIBUTES={}, INNERTEXTS_DATA={} ) => 
	{
		const TAG_NAME 				= HTML.match ( /<([^\s>]+)(\s|>)+/ )[1];
		const COMPONENT_CONTAINER 	= document.createElement ( "CMPNT-CONTAINER" ); COMPONENT_CONTAINER.innerHTML = HTML;
		const COMPONENT 			= COMPONENT_CONTAINER.getElementsByTagName ( TAG_NAME )[ 0 ];

		for ( let class_item of CLASSLIST ) 
		{
			COMPONENT.classList.add ( class_item );	
		};
		for ( let [attr_key, attr_val] of Object.entries ( ATTRIBUTES ) ) 
		{
			COMPONENT.setAttribute ( attr_key, attr_val );
		};
		for ( let [target_selector, innertext_val] of Object.entries ( INNERTEXTS_DATA ) ) 
		{
			COMPONENT.querySelectorAll ( `${ target_selector }` )[0].innerText = innertext_val;
		};

		return COMPONENT;
	}	
};

function inject_component ( COMPONENT, INJECTION_TARGET, PREPEND=false ) 
{
  	if ( PREPEND == true ) 
  	{
  		INJECTION_TARGET.prepend ( COMPONENT );
  	}
  	else 
  	{
  		INJECTION_TARGET.append ( COMPONENT );
  	};
};