(this["webpackJsonpmy-portfolio-website"]=this["webpackJsonpmy-portfolio-website"]||[]).push([[130],{97:function(t,e,n){"use strict";function a(t){!function(t){var e=t.util.clone(t.languages.javascript),n=/(?:\s|\/\/.*(?!.)|\/\*(?:[^*]|\*(?!\/))\*\/)/.source,a=/(?:\{(?:\{(?:\{[^{}]*\}|[^{}])*\}|[^{}])*\})/.source,s=/(?:\{<S>*\.{3}(?:[^{}]|<BRACES>)*\})/.source;function o(t,e){return t=t.replace(/<S>/g,(function(){return n})).replace(/<BRACES>/g,(function(){return a})).replace(/<SPREAD>/g,(function(){return s})),RegExp(t,e)}s=o(s).source,t.languages.jsx=t.languages.extend("markup",e),t.languages.jsx.tag.pattern=o(/<\/?(?:[\w.:-]+(?:<S>+(?:[\w.:$-]+(?:=(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s{'"/>=]+|<BRACES>))?|<SPREAD>))*<S>*\/?)?>/.source),t.languages.jsx.tag.inside.tag.pattern=/^<\/?[^\s>\/]*/,t.languages.jsx.tag.inside["attr-value"].pattern=/=(?!\{)(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s'">]+)/,t.languages.jsx.tag.inside.tag.inside["class-name"]=/^[A-Z]\w*(?:\.[A-Z]\w*)*$/,t.languages.jsx.tag.inside.comment=e.comment,t.languages.insertBefore("inside","attr-name",{spread:{pattern:o(/<SPREAD>/.source),inside:t.languages.jsx}},t.languages.jsx.tag),t.languages.insertBefore("inside","special-attr",{script:{pattern:o(/=<BRACES>/.source),alias:"language-javascript",inside:{"script-punctuation":{pattern:/^=(?=\{)/,alias:"punctuation"},rest:t.languages.jsx}}},t.languages.jsx.tag);var g=function t(e){return e?"string"===typeof e?e:"string"===typeof e.content?e.content:e.content.map(t).join(""):""};t.hooks.add("after-tokenize",(function(e){"jsx"!==e.language&&"tsx"!==e.language||function e(n){for(var a=[],s=0;s<n.length;s++){var o=n[s],i=!1;if("string"!==typeof o&&("tag"===o.type&&o.content[0]&&"tag"===o.content[0].type?"</"===o.content[0].content[0].content?a.length>0&&a[a.length-1].tagName===g(o.content[0].content[1])&&a.pop():"/>"===o.content[o.content.length-1].content||a.push({tagName:g(o.content[0].content[1]),openedBraces:0}):a.length>0&&"punctuation"===o.type&&"{"===o.content?a[a.length-1].openedBraces++:a.length>0&&a[a.length-1].openedBraces>0&&"punctuation"===o.type&&"}"===o.content?a[a.length-1].openedBraces--:i=!0),(i||"string"===typeof o)&&a.length>0&&0===a[a.length-1].openedBraces){var c=g(o);s<n.length-1&&("string"===typeof n[s+1]||"plain-text"===n[s+1].type)&&(c+=g(n[s+1]),n.splice(s+1,1)),s>0&&("string"===typeof n[s-1]||"plain-text"===n[s-1].type)&&(c=g(n[s-1])+c,n.splice(s-1,1),s--),n[s]=new t.Token("plain-text",c,null,c)}o.content&&"string"!==typeof o.content&&e(o.content)}}(e.tokens)}))}(t)}t.exports=a,a.displayName="jsx",a.aliases=[]}}]);
//# sourceMappingURL=react-syntax-highlighter_languages_refractor_jsx.411f37f6.chunk.js.map