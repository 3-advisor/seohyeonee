# 개발 세팅

## 필요 SW

1. NPM, Node.js
2. mongoDB

## 추천 SW

1. [mongoDB Compass](https://www.mongodb.com/products/compass)

## 설치

Just clone project.

## 실행

Seohyeonee를 실행하기 전에, 전용 DB(mongoDB) 를 먼저 실행시켜야 합니다.

DB는 3가지로 나뉘어져 있습니다.

- local :
    - Pull Request 올리기 전에 기여자분들께서 테스트 용도로 사용해야 하는 환경입니다.
    - 로컬에서 직접 실행해야 합니다.
- dev-server :
    - master branch 이외 모든 remote branch 에서 사용합니다. (CI)
    - 별도의 원격 서버에서 실행되고 있습니다.
- real-server : 
    - master branch 에서 사용합니다. (CI / release)
    - 별도의 원격 서버에서 실행되고 있습니다.

> 추후 dev-server에 대한 read-only access user 를 생성하여 contributor 도 dev-server test 를 가능하게끔 할 예정

### local db 실행
1. `npm install`
2. `npm run db:local`

> 자세한 내용은 [로컬 디비 가이드](../local_db/readme.md) 를 참고해주세요.

### dev-server db 사용

> 추후 dev-server에 대한 read-only access user 를 생성하여 contributor 도 dev-server test 를 가능하게끔 할 예정

### Seohyeonee [로컬db 환경] 실행

1. `npm install`
2. `npm run dev:local`

### Seohyeonee [개발db 환경] 실행

1. `npm install`
2. `npm run dev`

> 추후 dev-server에 대한 read-only access user 를 생성하여 contributor 도 dev-server test 를 가능하게끔 할 예정

## 세부 설정 파일 설명

### [local.env](https://www.npmjs.com/package/dotenv)

서버 실행에 필요한 .env (dotenv) 파일 입니다.

### eslintrc.json

Ecma script lint 규칙입니다.

# 기여 규칙

## test 코드 작성 및 사용

- PR을 요청하기 전에 test 코드를 실행해주세요.
    ```
    npm run test
    npm test
    ```
- 새로운 feature가 개발되었다면 이에 대한 검증 코드를 삽입해주세요.

### test 코드 작성 규칙

#### 모듈별 테스트

테스트하고자 하는 모듈의 현재 디렉토리에 `모듈명.test.js` 라는 이름으로 명명해야 합니다.

## lint 사용 강제

- 이 프로젝트는 lint 사용을 강제합니다.
- lint 규칙에 맞지 않으면 commit 되지 않습니다. 아래 명령어를 통해 수정해주세요.
    ```
    npm run lint
    npm run lint:fix
    ```
- lint 규칙 수정이 필요한 경우 Issue 에 먼저 등록해주세요.
