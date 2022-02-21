---
layout: page
title: Archive
permalink: /archive/
---

<div class="archive">
    <div class="list_article">
    {% for post in site.posts  %}
        {% capture this_year %}{{ post.date | date: "%Y" }}{% endcapture %}
        {% capture this_month %}{{ post.date | date: "%B" }}{% endcapture %}
        {% capture next_year %}{{ post.previous.date | date: "%Y" }}{% endcapture %}
        {% capture next_month %}{{ post.previous.date | date: "%m" }}{% endcapture %}
        {% if forloop.first %}
            <h2>{{this_year}}</h2>
        {% endif %}
        <div class="single_fake">
            <div class="single">
                <div class="article_title abs-title">
                    <a href="{{ post.url | prepend: site.baseurl }}" class="article-list-title" title="{{ post.title }}">{{ post.title }}</a>
                </div>
                <div class="tip category-tips">
                    <div class="meta-tip">
                        {% for category in post.categories %}
                        <a href="#"> <span class="badge">{{category}}</span></a>
                        {% endfor %} 
                        {% for tag in post.tags %}
                        <span class="label label-success"><i class="icon">&#xe610;</i> {{tag}}</span> 
                        {% endfor %}
                    </div>
                </div>
            </div>
            <div class="tip">
                <div class="meta-tip">
                    <span class="cut cut28">
                <i class="author-head"></i>
                Vace
             </span>
            <span>
                 
                 <i class="icon">&#xe602;</i>
                 {{ post.date | date: "%b %-d, %Y" }}
             </span>
                    <a href="" class="read-later-btn pull-right">
                        <i class="icon">&#xe624;</i> 稍后阅读
                    </a>
                    <div class="clearfix"></div>
                </div>
            </div>
        </div>

        {% if forloop.last %}
        {% else %}
            {% if this_year != next_year %}
            <h2>{{next_year}}</h2>
            {% endif %}
        {% endif %}
    {% endfor %}
    </div>
</div>