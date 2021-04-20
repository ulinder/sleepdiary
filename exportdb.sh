#!/usr/bin/env bash
# obtains all data tables from database and export 
sqlite3 -header -csv sleepdiary.sqlite < export.sql > db_tables.sql
