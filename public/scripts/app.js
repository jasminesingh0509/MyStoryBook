$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done(users => {
    $(users).appendTo($("body"));
  });
});
