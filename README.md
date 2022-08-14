# Keep Problems

A Browser extension which helps to save and keep track of problems from different platforms(codeforces, codechef, atcoder, leetcode etc.)

This is the replica of [Keep Problems](https://github.com/jainnirav88/keep-problems), in this problems are stored in mongoDB atlas instead of chrome local storage.

To use it, server needs to be running in the backend.

## Features

### Add Problem

- Save problem with link, name, difficulty, tags, code and notes
- If codeforces problem, then it will fetch name, difficulty and tags
- For other platforms, it will fetch possible information
- Add code and notes in code and notes section
- Manage problems in different folders by giving appropriate folder name

### Import/Export

- Do you share problems with other? If yes, then this feature can be very useful for you
- Add and filter problems you want to store and click on Export button in navbar. JSON file will be stored in your computer
- Share this json file with anyone
- User can Import this problems in Other page by providing JSON file, folder name (optional) and tags (optional)

### Sort, Search, Filter, Edit, Delete

- Sort by name, date, difficulty in ascending/descending order
- Search/ Filter by name, link, difficulty and tags
- Edit problem data or Delete problem
- Filter problems by folder

### Screenshots

![](/screenshots/home-page-main.png)
![](/screenshots/home-page-accordion-selected.png)
![](/screenshots/home-page-difficulty-search-sort-selected.png)
![](/screenshots/add-problem-accordion-open-folders-selected.png)
![](/screenshots/other-page-import-selected.png)

- For more screenshots [see here](/screenshots)

## License

MIT