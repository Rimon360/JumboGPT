async function add_data_to_clipboard ( TEXT_DATA ) 
{
	let IS_COPIED = null; 

	await navigator.clipboard.writeText ( TEXT_DATA )
	.then 
	(
		() => //resolved (text copied)
		{
			IS_COPIED = true;

			console.log ( IS_COPIED );
		},
		() => //rejected (text not copied)
		{
			IS_COPIED = false;

			console.log ( IS_COPIED );
		}
	)

	return IS_COPIED;
};

function readclipboard_data () 
{
	return new Promise 
	(
		async ( RESOLVE, REJECT ) => 
		{
			const TEXT = await navigator.clipboard.readText ()

			RESOLVE ( TEXT );
		}
	)
	.catch 
	(
		( ERR ) => 
		{
			console.error ( 'Failed to read clipboard contents: ', ERR );
		}
	);
};