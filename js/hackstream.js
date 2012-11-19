hsManager = {
	// Set twitter username, number of tweets & id/class to append tweets
	appendTo: '#hackstream',
	apiURI: '/api/v1/blocks',

	// Core function of hsManager
	// -Retrieve tweets from twitter from specified user
	// 	-If successful, generate HTML to display the data
	//	-Use jQuery.Isotope to get the stream items into horizontal layout
	loadTweets: function(lastid) {
		$.ajax({
			url: hsManager.apiURI + '?lastid=' + lastid + '&count=10',
			type: 'GET',
			dataType: 'json',
			success: function(data, textStatus, xhr) {

				// Append streamitems into page
				var html = '<div class="streamitem" data-category="CATEGORY" data-created=CREATED data-promoted="PROMOTED">IMG_TAG TWEET_TEXT<div class="time">AGO</div><div class="user">USER</div></div>';
				var img;
				var imgwidth;
				var userlink;
				var category;
				for (var i = 0; i < data.results.length; i++) {
					imgwidth = 200;
					if (data.results[i].promoted = '1') {
						imgwidth = 400;
					}
				
					try {
						if (data.results[i].pic) {
							img = '<a href="' + data.results[i].pic + '" class="fancy">';
							img += '<img src="' + data.results[i].picThumb + '" alt="" width="' + imgwidth + '" />';
							img += '</a>';
							category = 'image';
						} else {
							img = '';
							category = 'text';
						}
					} catch (e) {
					
					}

					userlink = '<a href="' + data.results[i].service + '.com/' + data.results[i].fromScreenName + '">';
					userlink += '@' + data.results[i].fromScreenName + '</a>';

					$(hsManager.appendTo).append(
						html.replace('CATEGORY', category)
							.replace('CREATED', data.results[i].created)
							.replace('PROMOTED', data.results[i].promoted)
							.replace('IMG_TAG', img)
							.replace('TWEET_TEXT', hsManager.ify.clean(data.results[i].text, img) )
							.replace(/USER/g, userlink)
							.replace('AGO', hsManager.timeAgo(data.results[i].created*1000) )
					);
				}

				// Use jQuery Isotope to lay out the data
				var $container = $('#hackstream');
				$container.imagesLoaded(function() {
					$container.isotope({
						itemSelector : '.streamitem',
						layoutMode: 'masonry',
						masonry: {
    						columnWidth: 230
  						}
					}).css('overflow','auto');
				});
				
				// Activate fancybox 
				$("a.fancy").fancybox({
					'overlayShow'	: false,
					'transitionIn'	: 'elastic',
					'transitionOut'	: 'elastic',
					'overlayShow'	: true
				});
			}
		});
	},

	// Add a single tweet to hackstream
	addTweet: function(data) {
		// data.text: content
		// data.fromScreenName: screen name
		// data.pic: media (if any)
		// data.picThumb: pic thumbnail (if any)
		// data.created: timestamp
		var html = '<div class="streamitem" data-category="CATEGORY" data-created=CREATED data-promoted="PROMOTED">IMG_TAG TWEET_TEXT<div class="time">AGO</div><div class="user">USER</div></div>';
		var img;
		var imgwidth = 200;
		var userlink;
		var category;
		if (data.promoted = '1') {
			imgwidth = 400;
		}
		try {
			if (data.pic) {
				img = '<a href="' + data.pic + '" class="fancy">';
				img += '<img src="' + data.picThumb + '" alt="" width="' + imgwidth + '" />';
				img += '</a>';
				category = 'image';
			} else {
				img = '';
				category = 'text';
			}
		} catch (e) {
		}

		userlink = '<a href="' + data.service + '.com/' + data.fromScreenName + '">';
		userlink += '@' + data.fromScreenName + '</a>';

		var $newItem = $(html.replace('CATEGORY', category)
				.replace('CREATED', data.created)
				.replace('PROMOTED', data.promoted)
				.replace('IMG_TAG', img)
				.replace('TWEET_TEXT', hsManager.ify.clean(data.text, img) )
				.replace(/USER/g, userlink)
				.replace('AGO', hsManager.timeAgo(data.created*1000) )
		);

		var $container = $('#hackstream');
		$container.imagesLoaded(function() {
			$container.prepend( $newItem ).isotope( 'reloadItems' ).isotope({ sortBy: 'original-order' });
		});
	},

	// Get tweets from Hack Movement database
	getTweets: function(lastid, count) {
		$.ajax({
			url: hsManager.apiURI + '?lastid=' + lastid + '&count=' + count,
			type: 'GET',
			dataType: 'json',
			success: function(data, textStatus, xhr) {
				for (var i = 0; i < data.results.length; i++) {
					hsManager.addTweet(data.results[i]);
				}
				// Activate fancybox
				$("a.fancy").fancybox({
					'overlayShow'	: false,
					'transitionIn'	: 'elastic',
					'transitionOut'	: 'elastic',
					'overlayShow'	: true
				});
			}
		});
	},
	
	/**
      * relative time calculator FROM TWITTER
      * @param {string} twitter date string returned from Twitter API
      * @return {string} relative time like "2 minutes ago"
      */
    timeAgo: function(unixtimestamp) {
		var rightNow = new Date();
		var then = new Date(unixtimestamp);

		var diff = rightNow - then;

		var second = 1000,
		minute = second * 60,
		hour = minute * 60,
		day = hour * 24,
		week = day * 7;

		if (isNaN(diff) || diff < 0) {
			return ""; // return blank string if unknown
		}
		if (diff < second * 2) {
			// within 2 seconds
			return "right now";
		}
		if (diff < minute) {
			return Math.floor(diff / second) + " seconds ago";
		}
		if (diff < minute * 2) {
			return "about 1 minute ago";
		}
		if (diff < hour) {
			return Math.floor(diff / minute) + " minutes ago";
		}
		if (diff < hour * 2) {
			return "about 1 hour ago";
		}
		if (diff < day) {
			return  Math.floor(diff / hour) + " hours ago";
		}
		if (diff > day && diff < day * 2) {
			return "yesterday";
		}
		if (diff < day * 365) {
			return Math.floor(diff / day) + " days ago";
		}
		else {
			return "over a year ago";
		}
	}, // timeAgo()
    
	
    /**
      * The Twitalinkahashifyer!
      * http://www.dustindiaz.com/basement/ify.html
      * Eg:
      * ify.clean('your tweet text');
      */
    ify:  {
      	link: function(tweet, hasIMG) {
	        return tweet.replace(/\b(((https*\:\/\/)|www\.)[^\"\']+?)(([!?,.\)]+)?(\s|$))/g, function(link, m1, m2, m3, m4) {
		    	var http = m2.match(/w/) ? 'http://' : '';
		    	if (hasIMG) return '';
		 		else return '<a class="twtr-hyperlink" target="_blank" href="' + http + m1 + '">' + ((m1.length > 25) ? m1.substr(0, 24) + '...' : m1) + '</a>' + m4;
	        });
      	},

      	at: function(tweet) {
	        return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20})/g, function(m, username) {
	   			return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/intent/user?screen_name=' + username + '">@' + username + '</a>';
	        });
      	},

      	list: function(tweet) {
	        return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20}\/\w+)/g, function(m, userlist) {
	     		return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/' + userlist + '">@' + userlist + '</a>';
	        });
      	},

   		hash: function(tweet) {
        	return tweet.replace(/(^|\s+)#(\w+)/gi, function(m, before, hash) {
          		return before + '<a target="_blank" class="twtr-hashtag" href="http://twitter.com/search?q=%23' + hash + '">#' + hash + '</a>';
        	});
		},

      	clean: function(tweet , hasIMG) {
	      	return this.hash(this.at(this.list(this.link(tweet, hasIMG))));
      	}
    }, // ify

    applyFilters: function(state) {
    	var $container = $('#hackstream');
    	var newFilter;
    	if (state == 0) {
    		newFilter = "[data-category='none']";
    	} else if (state == 1) {
    		newFilter = "[data-category='text']";
    	} else if (state == 2) {
    		newFilter = "[data-category='image']";
    	} else {
    		newFilter = "[data-category='text'], [data-category='image']";
    	}
    	$container.isotope({ filter:newFilter });
    }
};




// Start hsManager
hsManager.loadTweets(1353150000);
