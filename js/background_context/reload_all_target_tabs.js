async function reload_all_target_tabs ( TARGET_URLs ) 
{
	const tabs = await query_tabs ( {} ); 

	for ( let tab of tabs ) 
	{
		for ( let url of TARGET_URLs ) 
		{
			const is_target_tab = tab.url.split ( url ).length > 1;

			if ( is_target_tab == true ) 
			{
				await reload_tab ( tab.id, {} );
			};
		};
	};
};