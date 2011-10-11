
                         __
       ____ ___  _______/ /_  ___  _____
      / __ `/ / / / ___/ __ \/ _ \/ ___/
     / /_/ / /_/ (__  ) / / /  __/ /
     \__, /\__,_/____/_/ /_/\___/_/
    /____/  by Chad von Nau


Gusher is a script for making a master stream of all your online activity. It's pre alpha and I'm still working out a lot of issues. I do not recommend using it yet. Gusher supports these services:

    Delicious
    Disqus
    Flickr
    Github
    Google+
    Google Calendar
    Google Reader
    Instapaper
    Last.fm
    Stack Overflow
    Tumblr
    Twitter
    Vimeo
    YouTube

Gusher makes it easy to add new feeds. Anything that can be accessed as JSONP is a potential source. RSS & Atom feeds can also be added using Google Reader's API (See Instapaper for example).


REQUIREMENTS

* jQuery
* ICanHaz.js


USAGE

1. To use one of the built in services, adjust the feed_url to point to your feed. In the example below, you would replace YOUR-NAME-HERE with your YouTube account name.

YouTubeFavorites.params.feed_url = 'https://gdata.youtube.com/feeds/api/users/YOUR-NAME-HERE/favorites?v=2&alt=jsonc&format=5&max-results=LIMIT&callback=?';

2. Then render.

YouTubeFavorites.render();


RELEASE NOTES

  .1  - Initial release
  .2  - Wrote a Feed class to standardize the way feeds are created
  .21 - Added support for Github activity and Commit feeds
  .22 - CSS cleanup. New icons. Moved feed rendering from feeds.js to go.js
