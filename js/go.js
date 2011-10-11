$(document).ready(function(){ 
  
  // Asynchronously load the template definition file.
  $.get('/templates/standard.html', function(templates) {
    // Inject all those templates at the end of the document.
    $('body').append(templates);
   
    // Trigger templating system to read templates
    ich.refresh();
    
    // Render templates
    DeliciousBookmarks.render();
    DisqusComments.render();
    FlickrPhotos.render();
    GithubActivity.render();
    //GithubCommits.render();
    GithubGists.render();
    GoogleCalendarUpcoming.render();
    GooglePlusActivity.render();
    GoogleReaderStarred.render();
    InstapaperStarred.render();
    LastfmFavs.render();
    StackOverflowAnswers.render();
    TumblrPosts.render();
    TwitterPosts.render(20);
    VimeoActivity.render();
    YouTubeFavorites.render();
    
    //setTimeout('$("#content").children().tsort({attr:"timestamp",order:"desc"})',2000);
  });
  
});