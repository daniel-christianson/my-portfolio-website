(this["webpackJsonpmy-portfolio-website"]=this["webpackJsonpmy-portfolio-website"]||[]).push([[152],{68:function(e,t,n){"use strict";function a(e){!function(e){function t(e,t){return"___"+e.toUpperCase()+t+"___"}Object.defineProperties(e.languages["markup-templating"]={},{buildPlaceholders:{value:function(n,a,o,r){if(n.language===a){var i=n.tokenStack=[];n.code=n.code.replace(o,(function(e){if("function"===typeof r&&!r(e))return e;for(var o,s=i.length;-1!==n.code.indexOf(o=t(a,s));)++s;return i[s]=e,o})),n.grammar=e.languages.markup}}},tokenizePlaceholders:{value:function(n,a){if(n.language===a&&n.tokenStack){n.grammar=e.languages[a];var o=0,r=Object.keys(n.tokenStack);!function i(s){for(var c=0;c<s.length&&!(o>=r.length);c++){var p=s[c];if("string"===typeof p||p.content&&"string"===typeof p.content){var u=r[o],l=n.tokenStack[u],g="string"===typeof p?p:p.content,f=t(a,u),k=g.indexOf(f);if(k>-1){++o;var m=g.substring(0,k),h=new e.Token(a,e.tokenize(l,n.grammar),"language-"+a,l),y=g.substring(k+f.length),d=[];m&&d.push.apply(d,i([m])),d.push(h),y&&d.push.apply(d,i([y])),"string"===typeof p?s.splice.apply(s,[c,1].concat(d)):p.content=d}}else p.content&&i(p.content)}return s}(n.tokens)}}}})}(e)}e.exports=a,a.displayName="markupTemplating",a.aliases=[]}}]);
//# sourceMappingURL=react-syntax-highlighter_languages_refractor_markupTemplating.f52b9615.chunk.js.map