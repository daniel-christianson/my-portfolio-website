(this["webpackJsonpmy-portfolio-website"]=this["webpackJsonpmy-portfolio-website"]||[]).push([[192],{300:function(t,n,e){"use strict";function a(t){!function(t){var n=["on","ignoring","group_right","group_left","by","without"],e=["sum","min","max","avg","group","stddev","stdvar","count","count_values","bottomk","topk","quantile"].concat(n,["offset"]);t.languages.promql={comment:{pattern:/(^[ \t]*)#.*/m,lookbehind:!0},"vector-match":{pattern:new RegExp("((?:"+n.join("|")+")\\s*)\\([^)]*\\)"),lookbehind:!0,inside:{"label-key":{pattern:/\b[^,]+\b/,alias:"attr-name"},punctuation:/[(),]/}},"context-labels":{pattern:/\{[^{}]*\}/,inside:{"label-key":{pattern:/\b[a-z_]\w*(?=\s*(?:=|![=~]))/,alias:"attr-name"},"label-value":{pattern:/(["'`])(?:\\[\s\S]|(?!\1)[^\\])*\1/,greedy:!0,alias:"attr-value"},punctuation:/\{|\}|=~?|![=~]|,/}},"context-range":[{pattern:/\[[\w\s:]+\]/,inside:{punctuation:/\[|\]|:/,"range-duration":{pattern:/\b(?:\d+(?:[smhdwy]|ms))+\b/i,alias:"number"}}},{pattern:/(\boffset\s+)\w+/,lookbehind:!0,inside:{"range-duration":{pattern:/\b(?:\d+(?:[smhdwy]|ms))+\b/i,alias:"number"}}}],keyword:new RegExp("\\b(?:"+e.join("|")+")\\b","i"),function:/\b[a-z_]\w*(?=\s*\()/i,number:/[-+]?(?:(?:\b\d+(?:\.\d+)?|\B\.\d+)(?:e[-+]?\d+)?\b|\b(?:0x[0-9a-f]+|nan|inf)\b)/i,operator:/[\^*/%+-]|==|!=|<=|<|>=|>|\b(?:and|or|unless)\b/i,punctuation:/[{};()`,.[\]]/}}(t)}t.exports=a,a.displayName="promql",a.aliases=[]}}]);
//# sourceMappingURL=react-syntax-highlighter_languages_refractor_promql.acf50ef9.chunk.js.map