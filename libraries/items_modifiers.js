function change_element_background ( ELEMENT, COLOR, css_prop="backgroundColor" ) 
{
	if ( ELEMENT ) 
	{
		ELEMENT.style[ css_prop ] = COLOR;
	};
};

async function change_element_background_by_time ( ELEMENT, COLOR, ORIGINAL_COLOR, TIME_MILLIS, css_prop="backgroundColor" ) 
{
	if ( ELEMENT ) 
	{
		change_element_background ( ELEMENT, COLOR, css_prop );

		//after { time_miliis } seconds the ELEMENT get back to it original style:
		await delay ( TIME_MILLIS );

		change_element_background ( ELEMENT, ORIGINAL_COLOR, css_prop );
	};
};

async function show_element_by_time ( ELEMENT, DISPLAY_TYPE="flex", TIME_MILLIS ) 
{
	if ( ELEMENT ) 
	{
		ELEMENT.style.display = DISPLAY_TYPE;

		//after { time_miliis } seconds the ELEMENT get back to it original style:
		await delay ( TIME_MILLIS );

		ELEMENT.style.display = "none";
	};
};

function show_element ( ELEMENT, DISPLAY_TYPE="flex" ) 
{
	if ( ELEMENT ) 
	{
		ELEMENT.style.display = DISPLAY_TYPE;
	};
};
function hide_element ( ELEMENT ) 
{
	if ( ELEMENT ) 
	{
		ELEMENT.style.display = "none";
	};
};
function disable_element ( ELEMENT ) 
{
	if ( ELEMENT ) 
	{
		ELEMENT.style.pointerEvents = "none";
		ELEMENT.style.opacity 		= "0.65";
		ELEMENT.style.userSelect 	= "none";
		ELEMENT.style.cursor 		= "not-allowed";
		ELEMENT.style.filter 		= ELEMENT.style.filter.split("none").join("") + " brightness(0.5)";
	};
};

function enable_element ( ELEMENT ) 
{
	if ( ELEMENT ) 
	{
		ELEMENT.style.pointerEvents = "all";
		ELEMENT.style.opacity 		= "1";
		ELEMENT.style.userSelect 	= "initial";
		ELEMENT.style.cursor 		= "initial";
		ELEMENT.style.filter 		= ELEMENT.style.filter.split( "brightness(0.5)" ).join("");
	};
};

async function disable_element_by_time ( ELEMENT, TIME_MILLIS ) 
{
	if ( ELEMENT ) 
	{
		disable_element ( ELEMENT );

		//after { time_miliis } seconds the ELEMENT get back to it original style:
		await delay ( TIME_MILLIS );

		enable_element ( ELEMENT );
	};

};

function scale_element ( ELEMENT, SCALE_VALUE ) 
{
	if ( ELEMENT ) 
	{
		ELEMENT.style.transform = `scale(${ SCALE_VALUE });`;
	};
};

async function scale_element_by_time ( ELEMENT, SCALE_VALUE, TIME_MILLIS ) 
{
	if ( ELEMENT ) 
	{
		scale_element ( ELEMENT, SCALE_VALUE );

		//after { time_miliis } seconds the ELEMENT get back to it original style:
		await delay ( TIME_MILLIS );

		scale_element ( ELEMENT, "1" );
	};
};