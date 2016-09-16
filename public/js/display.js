'use strict';

var service = 'http://localhost:3000';

$(document).ready(function(){

    $.ajax(
    {
        headers: {'Authorization': localStorage.token},
        type: "GET",
        url: '/sessions',
        data: "{}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        cache: false,
        success: function (data) {
            var trHTML = '';

            for (var i=0; i < data.length;i++) {
                var delButton = '<button type="button" class="removeSession" id="' + data[i]._id + '">Remove</button>'
                var d = new Date(data[i].timeIn);
                var time = d.toTimeString().split(' ')[0];
                trHTML += '<tr><td>' + data[i].subject + '</td><td>'
                                                     + data[i].table     + '</td><td>'
                                                     + time                 + '</td><td>'
                                                     + delButton         + '</td></tr>';
            }// for

            $('#sessionList').append(trHTML);

            var sessionButton = $('.removeSession');
            sessionButton.click(function () {
                $.ajax(
                {
                    headers: {'Authorization': localStorage.token},
                    type: "PUT",
                    url: '/sessions/' + this.id,
                    data: "{}",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    cache: false,
                    success: function (data) {
                        location.reload();
                    },// success
                    error: function (msg) {
                        alert(msg.responseText);
                    }// error
                });// ajax
            })// click

        },// success

        error: function (msg) {
            alert(msg.responseText);
        }// error
    });// ajax

})// ready
