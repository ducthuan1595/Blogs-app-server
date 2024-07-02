## NAME PROJECT: BLOG-APP

## Overview
- Search Blog follow title,
- Create Blog
- Manage Blogs
- List Blog follow author
- Manage Topic
- Comment and like blog

## PROJECT STRUCTURE
# client
  * url: /
 * Pages: 
  - Home: Overview Blog,
  - Category: List Blog follow the Topic
  - Account: Info user and list blogs become user,
  - Detail: Blog detail,
  - Auth

# Server
 * url: /system
 * Pages: 
   - Dashboard: List blogs,
   - Detail: Blog detail,
   - Manage: manage Categories,
   - Auth

## MAIN TECHNOLOGY
 - Font-end: Typescript, Angular
 - Back-end:  Typescript, NodeJs(express)
 - Database: MongoD(mongoose), redis



#### Start project:
 - Run redis_cli command: `FT.CREATE blog_index PREFIX 1 blog: SCHEMA key_word TEXT`
 - Install packages command: `npm init`
 - Run project with command: `npm run dev`