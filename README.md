# fakeFileSystem

Goal here is to create a fake file system that makes use of https://github.com/lamckalex/simpleUserStorage

Written in Node.js

# Setup
Install the project dependencies: 
```
npm install
```

#### Run the script
```
node app.js
```

# Usage

```
┌─────────┬───────────┬────────────────────────────┬───────────────────────────────────┐
│ (index) │     0     │             1              │                 2                 │
├─────────┼───────────┼────────────────────────────┼───────────────────────────────────┤
│    0    │ 'Command' │         'Param(s)'         │           'Description'           │
│    1    │  'tree'   │    '{absolutePathName}'    │      'Prints Tree Structure'      │
│    2    │   'ls'    │             ''             │     'Lists current directory'     │
│    3    │   'cat'   │        '{fileName}'        │          'reads a file'           │
│    4    │  'touch'  │ '{fileName} {fileContent}' │ 'Writes a file with file content' │
│    5    │   'rm'    │        '{fileName}'        │         'Removes a file'          │
│    6    │  'mkdir'  │       '{folderName}'       │        'Creates a folder'         │
│    7    │  'rmdir'  │       '{folderName}'       │        'Removes a folder'         │
│    8    │   'cd'    │        '{pathName}'        │       'Navigates to a path'       │
│    9    │   'pwd'   │             ''             │       'Prints current Path'       │
│   10    │  'exit'   │             ''             │  'Exits the program gracefully'   │
│   11    │  'help'   │             ''             │           'Prints help'           │
└─────────┴───────────┴────────────────────────────┴───────────────────────────────────┘
```
