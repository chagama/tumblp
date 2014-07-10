(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-52557759-1');
ga('set', 'checkProtocolTask', function(){});
ga('set', 'appName', (function(){return chrome.runtime.getManifest().name;}()));
ga('set', 'appVersion', (function(){return chrome.runtime.getManifest().version;}()));
ga('set', 'screenName', (function(){return window.location.href.split('/').pop();}()));
ga('set', 'forceSSL', true);
ga('send', 'screenview');

// ga('create', 'UA-52557759-2');
// ga('set', 'checkProtocolTask', function(){});
// ga('set', 'location', 'http://tumblp.com');
// ga('set', 'page', (function(){return window.location.href.split('/').pop();}()));
// ga('set', 'forceSSL', true);
// ga('send', 'pageview');