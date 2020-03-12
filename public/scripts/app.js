$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done(users => {
    console.log(users);

    $(users).appendTo($("body"));
  });
});
