var a = "";
let CONTINUE_GENERATING_CLICKED = 0;

function input_prompt ( PROMPT_TEXT ) 
{
	const PROMPT_FIELD = document.querySelector('[id="prompt-textarea"]');

	set_native_value( PROMPT_FIELD, PROMPT_TEXT );

	const SUBMIT_PROMPT_BTN = get_submit_prompt_btn();
	SUBMIT_PROMPT_BTN.click();
};

function get_submit_prompt_btn () 
{
	const SUBMIT_PROMPT_BTN = document.querySelector('button[data-testid="fruitjuice-send-button"]')||document.querySelector('button[data-testid="send-button"]');

	return SUBMIT_PROMPT_BTN;
};

function get_prompt_result_text(PROMPT_TEXT) {
	PROMPT_TEXT = PROMPT_TEXT.toLowerCase();
  
	const PROMPTS_CONTAINERS = document.querySelectorAll("div[data-testid]");
	let PROMPT_RESULT = null;
	let TARGET_PROMPT_CONTAINER = Object.values(PROMPTS_CONTAINERS).filter((a) => a.innerText.toLowerCase().includes(PROMPT_TEXT));
	TARGET_PROMPT_CONTAINER = TARGET_PROMPT_CONTAINER[TARGET_PROMPT_CONTAINER.length - 1];
  
	if (TARGET_PROMPT_CONTAINER && TARGET_PROMPT_CONTAINER != null) {
	  const PARAGRAPHS_PARENT = TARGET_PROMPT_CONTAINER.nextElementSibling?.querySelector("p") && TARGET_PROMPT_CONTAINER.nextElementSibling?.querySelector("p") != null ? TARGET_PROMPT_CONTAINER.nextElementSibling.querySelector("p").parentElement : null;
  
	  PROMPT_RESULT = PARAGRAPHS_PARENT != null ? PARAGRAPHS_PARENT?.innerText : TARGET_PROMPT_CONTAINER.nextElementSibling?.querySelector("code")?.innerText;
	}
	return PROMPT_RESULT;
  }

function get_continue_generating_btn () 
{
	const TARGET_BUTTON_TEXT = "continue generating";
	const BUTTONS = document.querySelectorAll("button");
	const TARGET_BTN = Object.values(BUTTONS).filter(a=> a.innerText.toLowerCase() == TARGET_BUTTON_TEXT )[0];

	return TARGET_BTN;
};

function get_stop_generating_btn () 
{
	return document.querySelector('button[data-testid="fruitjuice-stop-button"]');
};

function get_regenerate_btn () 
{
	const TARGET_BUTTON_TEXT = "regenerate";
	const BUTTONS = document.querySelectorAll("button");
	const TARGET_BTN = Object.values(BUTTONS).filter(a=> a.innerText.toLowerCase() == TARGET_BUTTON_TEXT )[0];

	return TARGET_BTN;
};

async function execute_promtps ( PROMPTS_TEXTS=[] ) 
{
	message_to_background( "START_BLINKING" ); //starts badge icon blinking

	let PROMPTS_RESULTS = [];

	for ( let prompt_text of PROMPTS_TEXTS ) 
	{
		const STORAGE_INFO = await get_storage( "OPTIONS" );

		delay_per_prompt = parseFloat( STORAGE_INFO["OPTIONS"].delay_per_prompt.value );

		await delay( delay_per_prompt );

		input_prompt( prompt_text );

		await delay( 300 );

		await delay_condition 
		( 
			async () => 
			{
				const IS_PROMPT_ANSWERED = get_submit_prompt_btn() != null && get_submit_prompt_btn() != undefined && get_submit_prompt_btn().getBoundingClientRect().width > 0;
				const KEEP_GENERATING_IS_DISPLAYED = get_continue_generating_btn() != undefined && get_continue_generating_btn() != null && get_continue_generating_btn().getBoundingClientRect().width > 0;

				// 
				if ( IS_PROMPT_ANSWERED == true && KEEP_GENERATING_IS_DISPLAYED == false ) 
				{
					await delay( 300 );

					if ( get_prompt_result_text( prompt_text ) != undefined && get_prompt_result_text( prompt_text ) != null ) 
					{
						scroll_down_prompts_chat();
						//await delay( 500 );
						return true;
					};
				};

				// if clicked on continue button then this is true
				if ( (IS_PROMPT_ANSWERED == true || IS_PROMPT_ANSWERED == false) && KEEP_GENERATING_IS_DISPLAYED == true ) 
				{
					await delay( 300 );

					try 
					{
						if ( get_continue_generating_btn() && get_continue_generating_btn() != null ) 
						{
							// handle_prompt_result( prompt_text, PROMPTS_RESULTS ); // maybe this is overriting

							get_continue_generating_btn().click();

							CONTINUE_GENERATING_CLICKED += 1;

							await delay( 300 );
						};	
					} 
					catch(ERROR) 
					{
						console.log(ERROR);
					};
				};

				//if prompt text input bar is not presents then ite means there was an error in the OpenIA page and then process stops.
				if ( !document.querySelector('[id="prompt-textarea"]') || (document.querySelector('[id="prompt-textarea"]') && document.querySelector('[id="prompt-textarea"]').getBoundingClientRect().width == 0) ) 
				{
					return true;
				};
			},
			80,
			150 
		);

		//if prompt text input bar is not presents then ite means there was an error in the OpenIA page and then process stops.
		if ( !document.querySelector('[id="prompt-textarea"]') || (document.querySelector('[id="prompt-textarea"]') && document.querySelector('[id="prompt-textarea"]').getBoundingClientRect().width == 0) ) 
		{
			break;
		};

		handle_prompt_result( prompt_text, PROMPTS_RESULTS );	
	};

	/*
		HERE ENDS PROCESS.
	*/
	message_to_background( "STOP_BLINKING" ); //stops badge icon blinking

	//get prompts result again after finalized operation to avoid incompleted text results.
	PROMPTS_RESULTS = [];
	for ( let prompt_text of PROMPTS_TEXTS ) 
	{
		handle_prompt_result( prompt_text, PROMPTS_RESULTS );
	};
};

function scroll_down_prompts_chat () 
{
	const ELEMENTS = document.querySelectorAll("*");
	const TARGET_SCROLL_EL = Object.values( ELEMENTS ).filter( a => a.className.toString().includes("react-scroll-to-bottom") == true )[0];

	if ( TARGET_SCROLL_EL ) 
	{
		TARGET_SCROLL_EL.children[0].scrollTo(0, TARGET_SCROLL_EL.children[0].scrollHeight);
	};
};

function save_prompts_results ( PROMPTS_RESLTS=[] ) 
{
	set_storage( { "last_prompts" : PROMPTS_RESLTS } );
};

function handle_prompt_result ( PROMPT_TEXT, PROMPTS_RESULTS ) 
{
	const PROMPT_DATA = 
	{
		"id" : generate_id(),
		"prompt_text" : PROMPT_TEXT,
		"prompt_result" : get_prompt_result_text( PROMPT_TEXT )
	};

	PROMPTS_RESULTS.push( PROMPT_DATA );

	save_prompts_results( PROMPTS_RESULTS );

	if ( PROMPTS_RESULTS.length > 0 ) 
	{
		message_to_background( "UPDATE_PROMPTED_TEXTS_QTY", { "prompted_texts_qty" : PROMPTS_RESULTS.length } );
	};	
}; 