
INSERT INTO stories
  (
  user_id, text, created_at, updated_at, title, picture_url, is_completed)
VALUES
  (
    1, 'There once was a cool unicorn crossing the street.', '1999-01-08
04:05:06', '1999-01-08
04:05:06', 'The Best Story That Was Ever Written', 'http://clipart-library.com/images/rcLnpag7i.jpg
    ', true ),

  ( 2, 'On the first day of school I met ky best friend in the whole wide world.', '1999-01-08
04:05:06', NOW(), 'Me and My Best Friend', 'https://cms-tc.pbskids.org/arthurwebsite/resources/static/health/asthma_story_1.png
    ', false ),

  ( 3, 'In a glaxy far far away a princess was sleeping under a tree.', '1999-01-08
04:05:06', '1999-01-08
04:05:06', 'Sleepy princess', 'https://previews.123rf.com/images/sivanova/sivanova1208/sivanova120800004/14751000-illustration-of-sleeping-princess-isolated-on-white-background.jpg
    ', false ),

  ( 1, 'The clouds are made of cotton candy.', '1999-01-08
04:05:06', NOW(), 'The Sky', 'https://c8.alamy.com/comp/DBJ2CC/childs-drawing-horse-under-rainbow-in-blue-sky-DBJ2CC.jpg
    ', false );
