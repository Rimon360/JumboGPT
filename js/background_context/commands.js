function commnad_fired_handler ( COMMAND_NAME ) 
{
	switch ( COMMAND_NAME ) 
	{
		/*
		case "your_command_name":

			break;
		*/
	}
};

if ( chrome.commands ) 
	chrome.commands.onCommand.addListener ( commnad_fired_handler );