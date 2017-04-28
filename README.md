#Sum it up

A petite "spreadsheet" addition app for those who believe in the superiority of the sum. 

If you find yourself continually wanting to add value(s) and eliminate excess functions, this app is for you!

## Feature and Tech spec
![img](http://interdigitize.com/assets/images/2017-0428-sum-it-up-spec.jpg)

* Supports positive and negative integers.

* Ignores blank cells

* Ignores non-numeric cells. If a cell contains a word, like “apple”, and other cells in that column are numbers, a sum will still be calculated.

* Numbers can be anywhere in the column. They do not have to start at the top or be adjacent to each other.

* NOTE: You can not type directly into the header or sum rows.

## Code plan

* Revisit the tutorial steps using them as prompts to recall what to do in what order. If stuck, rewatch the videos and pause when needed to implement and debug. Do this to create the basic infrastructure.

* When I start working on “sum row” functionality, create a topic branch from the master branch.
```git checkout -b sum-row.```

* Once fully functional, push the topic branch up to Github.
```git push origin sum-row```

* Create a pull request review from Tim (@tim-hr) and Kay (@speschell)