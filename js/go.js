// Page specific adjustments
TwitterPostsParams.feed_limit = 20;

// Create Feed Objects
var Feeds = {
  //DailyBooth     : new Feed(DailyBoothPhotosParams),
  Delicious      : new Feed(DeliciousBookmarksParams),
  Disqus         : new Feed(DisqusCommentsParams),
  Flickr         : new Feed(FlickrPhotosParams),
  GithubActivity : new Feed(GithubActivityParams),
  //GithubCommits  : new Feed(GithubCommitsParams),
  GithubGists    : new Feed(GithubGistsParams),
  //GoogleCalendar : new Feed(GoogleCalendarUpcomingParams),
  GooglePlus     : new Feed(GooglePlusActivityParams),
  GoogleReader   : new Feed(GoogleReaderStarredParams),
  Instapaper     : new Feed(InstapaperStarredParams),
  Lastfm         : new Feed(LastfmFavsParams),
  StackOverflow  : new Feed(StackOverflowAnswersParams),
  Tumblr         : new Feed(TumblrPostsParams),
  Twitter        : new Feed(TwitterPostsParams),
  Vimeo          : new Feed(VimeoActivityParams),
  YouTube        : new Feed(YouTubeFavoritesParams)
};

$(document).ready(function(){ 
  
  // Asynchronously load the template definition file.
  $.get('/templates/standard.html', function(templates) {
    // Inject all those templates at the end of the document.
    $('body').append(templates);
   
    // Trigger templating system to read templates
    ich.refresh();
    
    // Render templates
    $.each(Feeds, function(i,item){
      item.render();
    });
    
    //setTimeout('$("#content").children().tsort({attr:"timestamp",order:"desc"})',2000);
  });
  
});