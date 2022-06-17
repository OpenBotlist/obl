$('#search').keyup(function () {
  var value = $(this).val().toLowerCase();
  $('.bots').filter(function () {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
  });
});
