var path = require('path');
var fs = require('fs');

module.exports = function (content, file, opt) {
    // 只对 html 类文件进行处理
    if (!file.isHtmlLike) {
        return content;
    }
    // Buffer转换
    if (content instanceof Buffer) {
        content = content.toString('utf-8');
    }
    var lang = fis.compile.lang;

    if (!opt.condition) {
        return content;
    }

    return content.replace(/<link.*?theme.*?href=['"](.*?)["'].*?\>/ig, function (all, value) {
        var condAry = [];
        if (!opt.theme) {
            opt.theme = [];
            var styleInfo = fis.project.lookup(value, file);
            var styleFile = styleInfo.file;
            var styleContent = styleFile.getContent();
            var styleMatchs = styleContent.match(/\@import\s+[\"\'](.*?@{theme}.*?)[\"\']/i);
            var styleThemeMatch = styleContent.match(/\@theme\s*\:\s*(.*?)(\;)/i);
            var configInfo = fis.project.lookup(styleMatchs[1].replace('@{theme}', styleThemeMatch[1]) + '.less', styleFile);
            var regTheme = new RegExp(styleMatchs[1].split('\/').pop().replace('@{theme}', '(.*?)') + '.less', 'i');
            var configFiles = fs.readdirSync(configInfo.file.dirname).filter(function (f) {
                var nFile = f.match(regTheme);
                if (nFile) {
                    opt.theme.push(nFile[1])
                }
                return nFile;
            });
        }

        opt.theme.forEach(function (item, i) {
            if (i === 0) {
                condAry.push("{%if " + opt.condition + "==" + item + "%}");
            }
            else {
                condAry.push("{%elseif " + opt.condition + "==" + item + "%}");
            }
            condAry.push(all.replace(/href=['"](.*?)["']/ig, function (link, href) {
                    return "href=\"__theme(" + href + "," + item + ")\""
                }) + '<!--ignore-->');
        })
        condAry.push("{%else%}");
        condAry.push(all + '<!--ignore-->');
        condAry.push("{%endif%}");
        return condAry.join('\n');
    });
};