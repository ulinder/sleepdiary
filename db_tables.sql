type,name,tbl_name,rootpage,sql
table,users,users,2,"CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    hash TEXT)"
table,diaryposts,diaryposts,4,"CREATE TABLE diaryposts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    date TEXT, 
    down TEXT, 
    awake REAL, 
    up text,
    rate INTEGER,
    status TEXT,
    t TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP
    )"
    