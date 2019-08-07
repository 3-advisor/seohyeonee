# Setup local mongo-db (for seohyeonee/dev:local)

1. [mongo db](https://www.mongodb.com/download-center/community) 설치

    > mongoDB compass 설치 유무를 묻는데, GUI 환경에서 작업 가능하므로 권장합니다.

2. `mongodb 시동 (mongod)` : db 디렉토리 생성 및 mongod 실행

    > mongod 는 `mongodb설치경로\Server\{version}\bin` 하위에 있습니다.
    > 
    > 환경변수로 설정하거나 해당 디렉토리 안에서 실행해주세요.

    - `mongod --dbpath .\dev_db\datas`
        - 해당 dbpath는 .gitignore에 등록된 경로로써 로컬 db용 경로로 사용하시길 권장합니다.
        - `--dbpath` 인자는 mongod.cfg 파일을 생성하여 기본값으로 둘 수 있습니다.
        - 다음에 db를 시작할 때도 위와 같은 명령을 사용합니다.
        - 본인의 경우 mongod가 있는 경로에서 아래 명령을 수행하였습니다.
            - `mongod --dbpath "E:\GitHub\seohyeonee\dev_db\datas"`
        - 실행 후 `port`를 확인해주세요. (4.0.0버전 기준, 아래와 같은 로그 외에도 많은 로그가 발생하는데 두번째 로그를 확인해주세요.)
            ```
            2019-07-29T08:09:07.047-0700 I CONTROL  [main] Automatically disabling TLS 1.0, to force-enable TLS 1.0 specify --sslDisabledProtocols 'none'
            2019-07-29T08:09:07.080-0700 I CONTROL  [initandlisten] MongoDB starting : pid=1296 port=27017 dbpath=E:\GitHub\seohyeonee\dev_db\datas 64-bit host=MY_DESKTOP
            ...
            ```

3. `db` 생성

    - (compass 환경) 위에서 확인한 `port` 입력 및 `connect` 클릭
        - `db name` 은 자유 (기억해주세요.)
        - `collection name` : 아무거나 만들어도 상관 없으나, seohyeonee가 사용하는 collection name은 `restaurant` 입니다. (대소문자 구분)

4. seohyeonee/dev:local 환경 실행

    ```bash
    npm install # check and install dependencies
    npm run dev:local {port} {위에서 작성한 db name}
    ```

    ```bash
    # example
    npm install
    npm run dev:local 27017 MyLocalDB
    ```
