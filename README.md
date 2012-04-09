Clickcyclist
============

**Author:** Luke Hudson <lukeletters@gmail.com>

AJAX-based jquery slideshow plugin.... yes, another one!

This differs from other slideshow plugins, in that it relies totally on getting
input from a RESTy (RESTish if you like) API which spits out JSON.

This JSON is then templated to HTML and used to power the slideshow.

Expected API
------------
Clickcyclist expects a JSON RESTish API where we can call the following:


Beneath `http://BASEURL/` (as defined in options or in data-baseurl HTML5 attribute):

### /fetch ###
#### Params ####
These allow you to limit the per-page item count, and start with a different number than the first item.

    int count

    int start

Eg, `count=10&offset=1` would give up to 10 items (less if end is reached), starting on the second item (item 1)

#### Return ####
Expect an array of JSON objects.  Each JSON object will provide fields and
values for templating into HTML using ICanHazJS system as described below.

### /count ###
No parameters are taken
#### Returns ####
Gives us an integer, representing to total size of the dataset (as opposed to paged count).

The results returned from the RESTish `/fetch` command will be used to create HTML using a template.
By default a Mustache template with the ID of #slide is used.  This can be altered by passing the template variable into options.

Your template should look something like the following:  (see index.html for an example)

    <script type="text/html" id="slide">
    	<h2>{{ title }}</h2>
    	<p><img src="{{ bannerImage }}" /><br/>
       	{{ content }}
    	</p>
    </script>

Usage
-----

    $('mydiv').cyclist({
    	perPage: 12,
    	template: 'mydiv_template',
    	baseURL: 'http://mysite.example.com/slideshowapi/'	
    });
    
    $('mydiv').cyclist('next'); // manually show next slide
    $('mydiv').cyclist('prev'); // manually show previous slide

External code
-------------
Uses [ICanHazJS](http://icanhazjs.com/) for templating HTML. 
