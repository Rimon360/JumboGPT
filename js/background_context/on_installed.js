const target_tabs_url = //set match url targets pages that will be restarted when the extension be installed.
[
	"chat.openai.com/"
];

chrome.runtime.onInstalled.addListener
(
	async ( REASON_DETAILS ) => 
	{
		reload_all_target_tabs ( target_tabs_url );
	}
);