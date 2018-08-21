function CSVtoArray(text) {
    var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
    // Return NULL if input string is not well formed CSV string.
    if (!re_valid.test(text)) return null;
    var a = [];                     // Initialize array to receive values.
    text.replace(re_value, // "Walk" the string using replace with callback.
        function(m0, m1, m2, m3) {
            // Remove backslash from \' in single quoted values.
            if      (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
            // Remove backslash from \" in double quoted values.
            else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
            else if (m3 !== undefined) a.push(m3);
            return ''; // Return empty string.
        });
    // Handle special case of empty last value.
    if (/,\s*$/.test(text)) a.push('');
    return a;
};

function EncodeHtml(str) {
    return str.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
        return '&#'+i.charCodeAt(0)+';';
    });
}

function SortTable(sender) {
    var updown = $(sender).find('.glyphicon-chevron-down').hasClass('hidden');
    var colNum = $('table#full_list tr th').index($(sender).parent()) + 1;

    $('.sort_wrapper > .glyphicon').removeClass('hidden');
    if ( updown ) {
        $(sender).find('.glyphicon-chevron-down').removeClass('hidden');
        $(sender).find('.glyphicon-chevron-up').addClass('hidden');
    } else {
        $(sender).find('.glyphicon-chevron-down').addClass('hidden');
        $(sender).find('.glyphicon-chevron-up').removeClass('hidden');
    }

    // get data to sort
    var rows = [];
    var keys = [];
    $('table#full_list > tbody > tr').each(function () {
        var thisKey = $(this).find('td:nth-child(' + colNum + ') .sort_key').html();

        if (typeof (thisKey) != "undefined") {
            if ( ! isNaN(thisKey) ) {
                keys.push(Number(thisKey));
                rows.push($(this));
            } else {
                keys.push(thisKey.toLowerCase());
                rows.push($(this));
            }
        }
    });

    // sort it
    var data = [];
    for (var i = 0 ; i < keys.length ; i++) {
        data.push([keys[i], rows[i]]);
    }
    data.sort(function (a, b) {
        if (a[0] === b[0]) {
            return 0;
        }
        else {
            return (a[0] < b[0]) ? -1 : 1;
        }
    });
    if (!updown) {
        data.reverse();
    }

    // display it
    //$('table#full_list > tbody').html('');
    for (var i = 0 ; i < data.length ; i++) {
        var id = "na";

        data[i][1].detach();
        $('table#full_list > tbody').append(data[i][1]);
    }
}
