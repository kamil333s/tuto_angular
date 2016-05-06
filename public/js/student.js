'use strict';
var service = 'http://localhost:3000';

$(document).ready(function(){

    $.ajax(
    {
        headers: {'Authorization': localStorage.token},
        type: "GET",
        url: '/subjects',
        data: "{}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        cache: false,
        success: function (data) {
            var trHTML = '';

            for (var i=0; i < data[0].subjects.length;i++) {
                // delButton = '<button type="button" class="removeSession" id="' + data[i]._id + '">Remove</button>'
                trHTML += '<option value="' + data[0].subjects[i] + '">' + data[0].subjects[i] + '</option>"' ;
            }// for

            $('#subject').append(trHTML);

            $.ajax(
                {
                    headers: {'Authorization': localStorage.token},
                    type: "GET",
                    url: '/tables',
                    data: "{}",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    cache: false,
                    success: function (data) {
                        var trHTML = '';
                        for (var i=0; i < data[0].tables.length;i++) {
                            trHTML += '<option value="' + data[0].tables[i] + '">' + data[0].tables[i] + '</option>"' ;
                        }// for
                        $('#table').append(trHTML);
                    },// success
                    error: function (msg) {
                        alert(msg.responseText);
                    }// error
                });// ajax
        },// success
        error: function (msg) {
            alert(msg.responseText);
        }// error
    });// ajax

    var subjects;
    var tables;
    var session;
    $('#submitSession').on('click', function(e) {
      e.preventDefault();
      subjects = $('#subject').val();
      tables = $('#table').val();
      session = {subject:subjects, table: tables}
      $.ajax({
        headers: {'Authorization': localStorage.token},
        type: 'POST',
        url: '/sessions',
        data: session
      }).done(function(data) {
        console.log(data);
      })
    })

})// ready
