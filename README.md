# fis3-parser-swig-lesstheme

一般结合fis3-parser-html-theme使用


使用

```

fis.match('/view/**.{html,tpl}', {
    parser: [
        fis.plugin('swig-theme', {
            condition: "http.get('BusinessId')"
        }),
        fis.plugin('html-theme')
    ],
    release: '$0',
    useHash: false
});


```


