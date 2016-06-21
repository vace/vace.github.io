---
layout: post
title:  IOS的WebApp化相关属性
categories: [前端]
tags: [html5,ios,meta,link]
---

最近因为业务需要将一些应用伪APP化,收集了一些信息,当把网站通过safari添加到主屏幕功能放置到移动设备桌面上以后，通过设置apple-touch-startup-image可以为WebApp设置一个类似NativeApp的启动画面。


'''html
<!doctype html>

<!-- http://taylor.fausak.me/2015/01/27/ios-8-web-apps/ -->

<html>
  <head>
    <title>iOS 8 web app</title>

    <!-- CONFIGURATION -->

    <!-- Allow web app to be run in full-screen mode. -->
    <meta name="apple-mobile-web-app-capable"
          content="yes">

    <!-- Make the app title different than the page title. -->
    <meta name="apple-mobile-web-app-title"
          content="iOS 8 web app">

    <!-- Configure the status bar. -->
    <meta name="apple-mobile-web-app-status-bar-style"
          content="black">

    <!-- Set the viewport. -->
    <meta name="viewport"
          content="initial-scale=1">

    <!-- Disable automatic phone number detection. -->
    <meta name="format-detection"
          content="telephone=no">

    <!-- ICONS -->

    <!-- iPad retina icon -->
    <link href="https://placehold.it/152"
          sizes="152x152"
          rel="apple-touch-icon-precomposed">

    <!-- iPad retina icon (iOS < 7) -->
    <link href="https://placehold.it/144"
          sizes="144x144"
          rel="apple-touch-icon-precomposed">

    <!-- iPad non-retina icon -->
    <link href="https://placehold.it/76"
          sizes="76x76"
          rel="apple-touch-icon-precomposed">

    <!-- iPad non-retina icon (iOS < 7) -->
    <link href="https://placehold.it/72"
          sizes="72x72"
          rel="apple-touch-icon-precomposed">

    <!-- iPhone 6 Plus icon -->
    <link href="https://placehold.it/180"
          sizes="120x120"
          rel="apple-touch-icon-precomposed">

    <!-- iPhone retina icon (iOS < 7) -->
    <link href="https://placehold.it/114"
          sizes="114x114"
          rel="apple-touch-icon-precomposed">

    <!-- iPhone non-retina icon (iOS < 7) -->
    <link href="https://placehold.it/57"
          sizes="57x57"
          rel="apple-touch-icon-precomposed">

    <!-- STARTUP IMAGES -->

    <!-- iPad retina portrait startup image -->
    <link href="https://placehold.it/1536x2008"
          media="(device-width: 768px) and (device-height: 1024px)
                 and (-webkit-device-pixel-ratio: 2)
                 and (orientation: portrait)"
          rel="apple-touch-startup-image">

    <!-- iPad retina landscape startup image -->
    <link href="https://placehold.it/1496x2048"
          media="(device-width: 768px) and (device-height: 1024px)
                 and (-webkit-device-pixel-ratio: 2)
                 and (orientation: landscape)"
          rel="apple-touch-startup-image">

    <!-- iPad non-retina portrait startup image -->
    <link href="https://placehold.it/768x1004"
          media="(device-width: 768px) and (device-height: 1024px)
                 and (-webkit-device-pixel-ratio: 1)
                 and (orientation: portrait)"
          rel="apple-touch-startup-image">

    <!-- iPad non-retina landscape startup image -->
    <link href="https://placehold.it/748x1024"
          media="(device-width: 768px) and (device-height: 1024px)
                 and (-webkit-device-pixel-ratio: 1)
                 and (orientation: landscape)"
          rel="apple-touch-startup-image">

    <!-- iPhone 6 Plus portrait startup image -->
    <link href="https://placehold.it/1242x2148"
          media="(device-width: 414px) and (device-height: 736px)
                 and (-webkit-device-pixel-ratio: 3)
                 and (orientation: portrait)"
          rel="apple-touch-startup-image">

    <!-- iPhone 6 Plus landscape startup image -->
    <link href="https://placehold.it/1182x2208"
          media="(device-width: 414px) and (device-height: 736px)
                 and (-webkit-device-pixel-ratio: 3)
                 and (orientation: landscape)"
          rel="apple-touch-startup-image">

    <!-- iPhone 6 startup image -->
    <link href="https://placehold.it/750x1294"
          media="(device-width: 375px) and (device-height: 667px)
                 and (-webkit-device-pixel-ratio: 2)"
          rel="apple-touch-startup-image">

    <!-- iPhone 5 startup image -->
    <link href="https://placehold.it/640x1096"
          media="(device-width: 320px) and (device-height: 568px)
                 and (-webkit-device-pixel-ratio: 2)"
          rel="apple-touch-startup-image">

    <!-- iPhone < 5 retina startup image -->
    <link href="https://placehold.it/640x920"
          media="(device-width: 320px) and (device-height: 480px)
                 and (-webkit-device-pixel-ratio: 2)"
          rel="apple-touch-startup-image">

    <!-- iPhone < 5 non-retina startup image -->
    <link href="https://placehold.it/320x460"
          media="(device-width: 320px) and (device-height: 480px)
                 and (-webkit-device-pixel-ratio: 1)"
          rel="apple-touch-startup-image">

    <!-- HACKS -->

    <!-- Prevent text size change on orientation change. -->
    <style>
      html {
        -webkit-text-size-adjust: 100%;
      }
    </style>
  </head>

  <body>
    <h1>iOS 8 web app</h1>
  </body>
</html>
'''