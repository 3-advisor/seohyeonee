set LOCAL_DB_PATH="./dev_db/datas"

dir %LOCAL_DB_PATH% || mkdir %LOCAL_DB_PATH%
mongod --dbpath %LOCAL_DB_PATH%
