"use strict";

// utility function for exact regex matching
function matchExact(r, str) {
    var match = str.match(r);
    return match != null && str == match[0];
}

// utility function to get the points.
function getPoints(accepted_count) {
    return (80 / (40 + accepted_count)).toFixed(2);
}

// create DIV element and append to the table cell
function createCell(cell, text, style) {
    var div = document.createElement('div'), // create DIV element
        txt = document.createTextNode(text); // create text node
    div.appendChild(txt);                    // append text node to the DIV
    div.setAttribute('class', style);        // set DIV class attribute
    cell.appendChild(div);                   // append DIV to the table cell
}

// get the url currently opened
var loc = window.location.href;

// regex for knowing where the user is
var prob_page = new RegExp("^https:\/\/www.spoj.com\/problems\/classical\/*.+$");
var spec_page = new RegExp("^https:\/\/www.spoj.com\/problems\/[A-Z0-9]+\/*.+$");

window.addEventListener("load", main, false);

function main (e) {
    //if the user is viewing classical problems
    if (matchExact(prob_page, loc)) {
        // when the user is logged in, there are two tables of the class "problems". So this check is needed.
        var problem_table_ambiguous = document.getElementsByClassName("problems table table-condensed table-hover");
        var problem_table = problem_table_ambiguous[problem_table_ambiguous.length - 1];

        if (problem_table.rows[1].cells.length == 7) {
            // if user is logged in, the names of problems are on the 2nd column.
            var prob_name_ind = 2;
        } else {
            var prob_name_ind = 1;
        }

        // the row of the problems' accepted user counts
        var prob_users_ind = prob_name_ind + 2;

        // the number of rows
        var num_of_row = problem_table.rows.length;
        // show the points for each row.
        var th = document.createElement('th');
        th.width = 50;
        th.class = "text-center valign-middle";
        th.innerHTML = 'Points'
        problem_table.rows[0].appendChild(th);
        for (var i = 1; i <= num_of_row - 1; i++) {
            // get the problem name from DOM element
            var prob_row = problem_table.rows[i];
            var prob_name = prob_row.cells[prob_name_ind].getElementsByTagName("a")[0];
            // get the AC users DOM element
            var prob_users = prob_row.cells[prob_users_ind].getElementsByTagName("a")[0];
            // Get points
            var parsed_points = getPoints(parseInt(prob_users.innerHTML));
            //Modify Problem name DOM element
            var td = document.createElement('td');
            td.innerHTML = parsed_points;
            td.class = "text-center";
            prob_row.appendChild(td);
            // prob_name.innerHTML = '<strong>' + prob_name.innerHTML + '</strong><strong style="font-size: 10px; padding: 0px 0px 0px 15px;color : #000000 " align="right">' + String(parsed_points) + ' points</strong>';
        }
    }


    // if user is viewing a particular problem
    if (matchExact(spec_page, loc)) {
        // get the problem code DOM element
        // (the problem code can be parsed via the current page's url, but as we later need to modify the DOM element
        // it we'll stick with the current method)
        var problem_name = document.getElementById("problem-name");

        var problem_code = window.location.pathname.split('/')[2];

        //We need the number of accepted users in order to calculate the points.
        //But that data is not available on the current page, So we need to get the HTML data from the ranking page for the current problem
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/ranks/" + problem_code + "/", true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var page_code = String(xhr.responseText); //page_code now has the entire HTML code for this page(the ranking page)
                //Get the points
                var points = getPoints(parseInt(page_code.substr(page_code.indexOf("lightrow") + 37, 30)));
                //Modify the code_obj DOM element to display the points
                problem_name.innerHTML = problem_name.innerHTML + '<i> (' + points + ' points)</i>';
            }
        }
        xhr.send();
    }
};
