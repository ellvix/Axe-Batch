
$(document).ready(function () {
    ExportTableEvents();
});

function ExportTableEvents() {
    $(document).on('click', '#export_table_trigger', function (e) {
        ExportTable.apply(this);
    });
}

function ExportTable(sender) {
    // code stolen from this page:
    //http://stackoverflow.com/questions/16078544/export-to-csv-using-jquery-and-html

    var table = $('table#report_table');
    var filename = "export.csv";
    var $rows = table.find('tr:not(.hidden)'),

      // Temporary delimiter characters unlikely to be typed by keyboard
      // This is to avoid accidentally splitting the actual contents
      tmpColDelim = String.fromCharCode(11), // vertical tab character
      tmpRowDelim = String.fromCharCode(0), // null character

      // actual delimiter characters for CSV format
      colDelim = '","',
      rowDelim = '"\r\n"',

      // Grab text from table into CSV formatted string
      csv = '"' + $rows.map(function (i, row) {
          var $row = $(row),
            $cols = $row.find('td:nth-child(n+2):not(.hidden),th:nth-child(n+2):not(.hidden)');

          return $cols.map(function (j, col) {
              var $col = $(col),
                text = $col.text();

              return text.replace(/"/g, '""'); // escape double quotes

          }).get().join(tmpColDelim);

      }).get().join(tmpRowDelim)
      .split(tmpRowDelim).join(rowDelim)
      .split(tmpColDelim).join(colDelim) + '"';

    // Deliberate 'false', see comment below
    if (false && window.navigator.msSaveBlob) {

        var blob = new Blob([decodeURIComponent(csv)], {
            type: 'text/csv;charset=utf8'
        });

        // Crashes in IE 10, IE 11 and Microsoft Edge
        // See MS Edge Issue #10396033
        // Hence, the deliberate 'false'
        // This is here just for completeness
        // Remove the 'false' at your own risk
        window.navigator.msSaveBlob(blob, filename);

    } else if (window.Blob && window.URL) {
        // HTML5 Blob        
        var blob = new Blob([csv], {
            type: 'text/csv;charset=utf-8'
        });
        var csvUrl = URL.createObjectURL(blob);

        $(this)
          .attr({
              'download': filename,
              'href': csvUrl
          });
    } else {
        // Data URI
        var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

        $(this)
          .attr({
              'download': filename,
              'href': csvData,
              'target': '_blank'
          });
    }
}
