
var testing = 0;

$(document).ready(function() {
    SetEvents();
    Init();
});

function Init() {

    $.get("source/listofsites.csv", function(res) {
        DisplaySitesFromCSV(res);
    });
}

function SetEvents() {

    // table sorting 
    $(document).on('click keydown', '.sort_wrapper', function(e) {
        if ( e.type == "click" || e.keyCode == 13 || e.keyCode == 69 ) {
            SortTable(this);
        }
    });

    // main data toggles
    $(document).on('click', '#back_to_main', function() {
        DisplayMain();
    });
    $(document).on('click', '.details_trigger', function() {
        InitDetails(this);
    });
    $(document).on('click', '.expand_trigger', function() {
        $('#' + $(this).attr('data-toggle')).toggleClass('hidden');
    });
}

function getReport(sender, file, type) {
    $.get(file, function(res) {
        if ( res.length > 0 ) {
            DisplayDetails(sender, res[0], type);
        } else {
            DisplayMessage("Message", "No data found for this site");
        }
    });
}

function DisplaySitesFromCSV(txt) {
    // split out the csv (a stack of urls and filenames), and process each
    var list = txt.split("\n");
    var num = list.length;
    for ( var i = 1 ; i < num ; i++ ) {
        var data = list[i].split("\",\"");
        var name = data[0].substr(1);
        var url = data[1]; // not needed?
        var score = data[3]; 
        var fileName = name.replace(/[\W_]+/g,"") + ".json";

        var html = "";
        html += "<tr>\n";
        html += "<td><button class='button_as_link details_trigger sort_key' data-file='outputjson/" + fileName + "'>" + name + "</button></td>\n";
        html += "<td><span class='sort_key'>" + score + "</span>%</td>\n";
        html += "</tr>\n";

        $('#full_list > tbody').append(html);
    }

    if ( testing > 0 ) {
        InitDetails($('#full_list > tbody > tr:nth-child(4) > td > .details_trigger')[0]);
    }

}

function DisplayMain() {
    $('#full_list_wrapper').removeClass('hidden');
    $('#details_wrapper').addClass('hidden');
    $('#full_list_heading').focus();
}
function InitDetails(sender) {
    $('#details').html('');
    $('#full_list_wrapper').addClass('hidden');
    $('#details_wrapper').removeClass('hidden');
    $('#details_heading').focus();

    var fileName = $(sender).attr('data-file');
    getReport(sender, fileName, "full");
}

function DisplayDetails(sender, data, type) {
    console.log(data);
    var html = "";
    var name = $(sender).html();

    html += "<h3>" + name + "</h3>\n";
    html += "<p>Score: " + Math.round(data.passes.length * 100 / (data.passes.length + data.violations.length)) + " (" + data.passes.length + " passed out of " + (data.passes.length + data.violations.length) + ")</p>\n";

    var map = GenerateMappingVar();

    for ( var m = 0 ; m < map.length ; m++ ) {
        html += '<p><button class="button_as_link expand_trigger" id="' + map[m].category + '_trigger" data-toggle="' + map[m].category + '_wrapper" aria-controls="' + map[m].category + '_wrapper">' + map[m].name + ' ' + data[map[m].category].length + '</button>\n';
        html += '<div id="' + map[m].category + '_wrapper" class="hidden">\n';

        html += '<ul>\n';
        var numInCat = data[map[m].category].length;
        for ( var i = 0 ; i < numInCat; i++ ) {
            var item = data[map[m].category][i];
            var numInNode = item.nodes.length;
            html += '<li><button class="button_as_link expand_trigger" data-toggle="' + map[m].category + i + '_wrapper" aria-controls="' + map[m].category + i + '_wrapper">' + EncodeHtml(item.help) + ' (' + numInNode + ')</button>\n';

            html += '<ul id="' + map[m].category + i + '_wrapper" class="hidden">\n';
            for ( var j = 0 ; j < numInNode ; j++ ) {
                console.log(item.nodes[j]);
                if ( item.nodes[j].any.length > 0 ) {
                    html += '<li><span class="impact_level">[' + item.nodes[j].any[0].impact + ']</span> ' + EncodeHtml(item.nodes[j].html) + '</li>\n';
                } else if ( item.nodes[j].none.length > 0 ) {
                    html += '<li><span class="impact_level">[' + item.nodes[j].none[0].impact + ']</span> ' + EncodeHtml(item.nodes[j].html) + '</li>\n';
                }
            }
            html += '</ul>\n';

            html += '</li>\n';
        }
        html += "</ul>\n";

        html += '</div>\n';
    }

    $('#details').append(html);
}

function GenerateMappingVar() {
    var map = [];
    var item;

    item = {};
    item.category = "passes";
    item.name = "Passed";
    map[0] = item;

    item = {};
    item.category = "violations";
    item.name = "Violations";
    map[1] = item;

    return map
}

function DisplayMessage(title, msg) {
    $('#message_modal .modal-title').html(title);
    $('#message_modal .modal-body').html(msg);

    $('#message_modal').modal('show');
}



