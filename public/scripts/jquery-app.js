const pool = require(`../../db/pool-queries/pool-query`);
console.log(pool);
$(document).ready(function() {
  /*   const renderStories = function(stories) {
    for (let story of stories) {
      let $story = createStoryElement(story);
      $(`friendsstories`).prepend($story);
    }
  }; */
  const createStoryElement = function() {
    let $story = $(`<article class="testing">
     <header>
        <div>
          <p> user text </p>
        </div>
      </header>
      <div class="story-text-area"> STORY STUFF IN HERE </div>
      <footer>
        <div> </div>
      </footer>
   </article> `);
    return $(".friendsstories").append($story);
  };
  createStoryElement();


  let count = 0;

  $("#update").click(function() {
    count++;
    $("#counter").html("My current count is: " + count);
  });
});
