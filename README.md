## 要件定義
動画投稿サイトのリンクを付箋みたいに残すアプリ
- Input
  - ID
    - 任意文字列
  - TEXT
    - 任意文字列、リンクとか
- Output
  - ID
  - TEXT

## 手順
### Node.js, Vue.jsインストール
```
# curl -sL https://rpm.nodesource.com/setup_13.x | bash
# yum -y install nodejs
# node -v
v13.13.0
# npm -v
6.14.4
# mkdir myapp
# cd myapp
```

### MongoDBインストール
```
# cat <<"EOF" > /etc/yum.repos.d/mongodb-org-4.0.repo
[mongodb-org-4.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/4.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-4.0.asc
EOF
# yum install -y mongodb-org
# mongod -version
Node.jsからMongoDBを操作するモジュール
# npm install mongoose --save
```
### MongoDB設定
```
# systemctl start mongod
MongoDB接続
# mongo
admin データベースに接続
> use admin
管理ユーザ登録
> db.createUser({user:"admin", pwd:"password", roles:[{role:"root", db:"admin"}]})
ユーザ確認
> db.getUsers()
一旦抜ける
> exit
```
`/etc/mongod.conf`編集。標準の設定ファイルには
```
storage:
  dbPath: /var/lib/mongo
```
となっているが、`/data/db`に格納する様になっているらしいので下記コマンドで作成する。
```
# mkdir -p /data/db && chown -R mongod:mongod /data/db
```
認証機能を使用するので下記を追記
```
security:
  authorization: enabled
```
再起動後接続確認
```
# systemctl restart mongod
# mongo -u admin -ppassword -authenticationDatabase admin
>
```
一時データベース作成
```
database 一覧表示
> show dbs
database 選択
> use admin
使用中database 確認
> db
admin
コレクション作成
> db.createCollection('links');
> show collections
サンプルデータ挿入
> db.links.insert({ linkname : "夜マオふにゃふにゃ", linkurl : "https://youtu.be/6cbqUl-3xDQ?t=65" });
```
## memo
express(Backend)
