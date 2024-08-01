class Csv  
{
	constructor () 
	{
		this.csvString 	= "";
		this.create = ( keys_arr ) =>
		{
			let keys = [];
			/*
			for ( let i = 0; i < keys_arr.length; i++ ) 
			{
				const key = keys_arr[ i ];

				keys.push ( `"${ key }"` );
			};
			*/
			for ( let key of keys_arr ) 
			{
				keys.push ( `${ clean_text(key) }` );
			};

			this.csvString = keys.join(",");

			console.log ( this.csvString );
		};

		this.push_ = ( values_arr ) =>
		{
			const 	break_line 	= "\n";
			let 	values 		= [];

			for ( let value of values_arr ) 
			{
				values.push ( `"${ clean_text(value) }"` );
			};

			this.csvString += ( break_line + values.join(",") );

			console.log ( this.csvString );
		};

		this.download 	= 
		( filename ) => 
		{
		    let array_buffer = new TextEncoder().encode("\uFEFF" + this.csvString);
		    const anchor = document.createElement('a');
		    const blob = new Blob([array_buffer], { type: "text/csv;charset=utf-8-sig" });

		    !filename ? (filename = "myCsv") : filename;

		    anchor.download = `${filename}.csv`;
		    anchor.href = URL.createObjectURL(blob);
		    anchor.click();

		    URL.revokeObjectURL(anchor.href);
		};

		this.log = 
		() =>
		{
			console.log ( this.csvString );
		};
	};
};

function clean_text ( TEXT ) //remmove unallowed characters in csv 
{
	if ( TEXT ) 
	{
		TEXT = TEXT.toString();
	}
	else 
	{
		TEXT = "";
	};

	console.log( TEXT );

	if ( TEXT ) 
	{
		const UNALLOWED_CHARACTERS = [ `"`, `'`, `,`, /*`\n`*/, `=`,  ];

		for ( let item of UNALLOWED_CHARACTERS ) 
		{
			TEXT = TEXT.split( item ).join ( "" );
		};

		return TEXT;
	}
	else 
	{
		return "";
	};
};
/*
function DATA_TO_XLS ( INPUT_TEXT, FILENAME ) 
{
    const table = `<table>${INPUT_TEXT.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</table>`;
    const blob = new Blob
    (
    	[`<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="content-type" content="text/html; charset=UTF-8"></head><body>${table}</body></html>`], 
	    {
	        type: 'application/vnd.ms-excel'
	    }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = FILENAME + '.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};
*/

function DATA_TO_XLSX(DATA, FILENAME) 
{
	const wb = XLSX.utils.book_new();

	wb.Props = 
	{
		Title: FILENAME.split("_XLSX")[1],
		Subject: ""
	};

	wb.SheetNames.push(FILENAME.split("_XLSX")[1]);

	const ws_data = DATA;
	const ws = XLSX.utils.aoa_to_sheet(ws_data);

	wb.Sheets[FILENAME.split("_XLSX")[1]] = ws;

	const wbout = XLSX.write(wb, {bookType:'xlsx', type: 'binary'});

	const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = FILENAME + '.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

function s2ab(s) 
{
	const buf = new ArrayBuffer(s.length);
	const view = new Uint8Array(buf);

	for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
	return buf;
};