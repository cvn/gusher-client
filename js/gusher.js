// Feed object constructor

// setup
// feed_url: where the feed is write LIMIT where the max results returned can be set
// datelines: 0 = no datelines, 1 = all datelines, 2 = all datelines except today, default is 2
//
// object parameters
// base: use dot notation to specify properties, default is '.' which bases at root of object
//
// adjusters
// tester: a function that runs before building the feed item object, return false and it will skip to next item
// normalizer: a function that returns the normalized date string

function Feed(params){
  this.params = {
    feed_url: params.feed_url || '',
    base: params.base || '.',
    debug: params.debug || 0,
    tester: params.tester || function(){},
    date: params.date || '',
    date_display: (typeof(params.date_display)!='undefined') ? params.date_display : 2,
    daysago: (typeof(params.daysago)!='undefined') ? params.daysago : 7,
    normalizer: params.normalizer || function(str){return str},
    order: params.order || 'descend',
    service: params.service || '',
    site: params.site || '',
    site_url: params.site_url || '',
    title: params.title || '',
    body: params.body || '',
    comments: params.comments || '',
    replies: params.replies || '',
    likes: params.likes || '',
    icon: params.icon || '',
    type: params.type || 'post',
    post_icon: params.post_icon || '',
    post_url: params.post_url || '',
    target: params.target || '#content',
    template: params.template || 'blogTemplate',
    user_url: params.user_url || ''
  }
}
Feed.prototype = {
  dateline: function(dateStr){
    // make object accessible in this scope
    var self = this;
    var dateDisplay = self.params.date_display;
    // dateDisplay: 0 - no datelines, 1 - all datelines, 2 - all datelines except for today
    if ( (dateDisplay==1) || (dateDisplay==2 && dateStr!=formatDate()) ) {
      var order = self.params.order,
          target = self.params.target;
      // see if anything has been posted on the same day
      var days = $.map($(target).children(), function(val){
        val = $(val).attr('timestamp');
        if (typeof(val)=='undefined'){
          val = '';
        } else {
          val = formatDate(new Date(+val));
        }
        return val;
      });
      // if this is the first post on a day 
      if ($.inArray(dateStr, days)==-1){
        var dateObj = new Date(timestamp);
        // set time to midnight
        dateObj = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
        // if order is descending, set time to to 11:59PM, so that it sorts before entries from the same day
        if (order=='descend') {
          dateObj = new Date(dateObj.getTime()+((24 * 60 * 60 * 1000) - 1))
        }
        self.position('<h3 class="dateline" timestamp="' + dateObj.getTime() + '">'+dateStr+'</h3>', dateObj.getTime());
      }
    }
  },
  render: function(limit){
    limit = limit || 10;
    // make object accessible in this scope
    var self = this;
    // get the feed
    $.getJSON(self.params.feed_url.replace('LIMIT', limit),
      function(data){
        if (self.params.debug){ console.log(['DATA',data]); }
        // normalize the feed attach point
        baseArray = getProps(self.params.base, data);
        // iterate over feed items
        $.each(baseArray, function(i,item){
            if (self.params.debug){ console.log(['ITEM',this]); }
            // test if limit reached
            if(i >= limit) return false;
            // module specific code
            if (self.params.tester(this)==false){
              if(self.params.debug){
                return(console.log(self.params.service+' item malformed. Not processed.'));
              } else {
                return;
              }
            }
            // test if time limit reached
            var dateObj = new Date(self.params.normalizer(getProps(self.params.date, this)));
            this.date_obj = dateObj; // make it available to view constructor functions
            datestring = formatDate(dateObj);
            timestamp = dateObj.getTime();
            timelimit = (self.params.daysago == 0) ? 0 : new Date().getTime() - (self.params.daysago * 24 * 60 * 60 * 1000);
            if(timestamp < timelimit) {
              if(self.params.debug){
                return(console.log(self.params.service+' item too old (' + datestring + ') Not processed.'));
              } else {
                return;
              }
            }
            // construct view
            var view = {
              order : self.params.order,
              service : self.params.service,
              site : getProps(self.params.site, this),
              site_url : getProps(self.params.site_url, this),
              title : getProps(self.params.title, this),
              body : getProps(self.params.body, this),
              comments : getProps(self.params.comments, this),
              date : datestring,
              timestamp : timestamp,
              replies: getProps(self.params.replies, this),
              likes: getProps(self.params.likes, this),
              icon : self.params.icon,
              post_icon : getString(self.params.post_icon, this),
              post_url : getProps(self.params.post_url, this),
              type: getString(self.params.type, this),
              user_url : self.params.user_url
            }
            var template = getString(self.params.template, this);
            var item = ich[template](view);
            self.insert(item, timestamp, datestring);
        });
        $('#services').append('<li><img class="favicon" src="'+self.params.icon+'"> <a href="'+self.params.user_url+'">' + self.params.service + '</a></li>')
      });
  },
  insert: function(item, timestamp, dateStr){
    // make object accessible in this scope
    var self = this;
    // make a new date header if necessary
    self.dateline(dateStr);
    // put item where it belongs
    self.position(item, timestamp);
  },
  position: function(item, timestamp){
    // make object accessible in this scope
    var self = this;
    var order = self.params.order,
        target = self.params.target;
    // make list of existing items
    var list = $.map($(target).children(), function(val){
      return $(val).attr('timestamp');
    });
    // insert new item into list maintaining sort
    list.push(timestamp);
    list.sort();
    if (order!='ascend'){ 
      list.reverse();
    }
    var i = $.inArray(timestamp, list);
    if (i==0){
      $(item).prependTo(target);
    } else {
      $(item).insertAfter(target + ' > :nth-child(' + i + ')');
    }
  }
}

// Utility Functions

var formatDate = function(dateObj){
  dateObj = dateObj || new Date();
  var dayname = new Array('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'),
      monthname = new Array('January','February','March','April','May','June','July','August','September','October','November','December');
  var dn = dayname[dateObj.getDay()],
      d  = dateObj.getDate(),
      mn = monthname[dateObj.getMonth()],
      y = dateObj.getYear();
  if(y < 1000) y+=1900;
  return dn + ', ' + d + ' ' + mn + ' ' + y; //equivalent to dateObj.strftime('%A, %e %B %Y');
}

var getProps = function(path, context){
  // Get properties of an object
  // ex: getProps('response.posts', this) // Returns the subobject at this.response.posts
  // Path function, object as argument
  
  // emtpy string in returns empty string
  if (path==''){
    context = '';
  // function returns result of function
  } else if (typeof(path)=='function'){
    context = path(context);
  // string returns property at position specified by string
  } else if (path!='.'){
    var path = path.split('.');	
    for ( var i = 0; i < path.length; i++ ){
      context = context[path[i]];
    };
  }
  return context;
}

var getString = function(str, context){
  // If str is function, return the results with the context object as the argument
  if (typeof(str)=='function'){
    str = str(context);
  }
  return str;
}

var getFavicon = function(url){
  url = url.split('/')[2].split('.');
  return 'http://' + url[url.length-2] + '.' + url[url.length-1] + '/favicon.ico';	
}

var getHost = function(url){
  url = url.split('/')[2].split('.');
  return url[url.length-2] + '.' + url[url.length-1];	
}
