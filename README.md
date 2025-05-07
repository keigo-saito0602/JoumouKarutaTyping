# 概要

Vue 3 + Nuxt 3 + Vuetify 3 を使ったアプリ

## 📦 使用技術スタック

- **Nuxt 3**
- **Vue 3**
- **TypeScript**
- **Vuetify 3**
- **Pinia**（状態管理）
- **Vue Router**
- **Sass**
- **ESLint + Prettier**
- **i18n**（多言語対応）
- **Web Font Loader**

## 拡張機能

- Veturが入っている場合は無効化しましょう。

## 📁 ディレクトリ構成

```txt
.
├── README.md                 # プロジェクトの概要・セットアップ手順など
├── app.vue                   # ルートコンポーネント（<NuxtPage /> を配置する入口）
├── assets/                   # 静的なSassや画像、共通ミックスインなど
│   ├── mixins                # Sassのmixin定義などを格納
│   └── styles                # 共通のスタイルファイル（変数・共通レイアウトなど）
├── components/               # 再利用可能なVueコンポーネント群
│   ├── layout                # レイアウト系（ヘッダー・フッターなど）
│   ├── parts                 # UIパーツ（ボタン、モーダルなど）
│   └── project               # プロジェクト固有の機能コンポーネント
├── composables/              # use～ の関数系（Composable関数：状態の共通ロジック）
├── eslint.config.js          # ESLintの設定ファイル（v9対応形式）
├── i18n/                     # 多言語化（i18n）の設定フォルダ
│   ├── i18n.config.ts        # vue-i18n のオプション設定
│   └── locales/              # 各言語の翻訳JSONファイル
│       ├── en.json
│       └── ja.json
├── middleware/               # ルーティングの前後に挟む処理（認証チェックなど）
├── nuxt.config.ts            # Nuxtの設定ファイル（プロジェクト全体の設定）
├── package.json              # 依存パッケージ・スクリプト定義
├── pages/                    # ページコンポーネント（ルーティングに対応）
│   └── index.vue             # `/` に対応するトップページ
├── plugins/                  # プラグイン登録用（Vuetifyなど）
│   └── vuetify.ts            # Vuetifyの初期化プラグイン
├── public/                   # 静的ファイル（robots.txtやfaviconなど）
│   ├── favicon.ico
│   └── robots.txt
├── server/                   # サーバーサイドAPIやmiddleware、cronなど（Nitroで使う）
│   └── tsconfig.json         # サーバー用のTypeScript設定
├── stores/                   # Piniaのストア定義（Vuex相当の状態管理）
│   └── counter.ts            # サンプル用のカウンターストア
├── structure.txt             # 構成メモなどの補助ファイル
├── tsconfig.json             # TypeScript全体のコンパイラ設定
├── types/                    # 型定義用ファイル（interfaces, enums, types など）
├── utils/                    # ユーティリティ関数群（バリデーション・フォーマットなど）
└── yarn.lock                 # Yarnの依存関係ロックファイル
```

## 🚀 セットアップ手順

依存インストール

```bash
yarn install
```

開発サーバ起動

```bash
yarn dev
```

Lintチェック

```bash
yarn lint
```

本番ビルド

```bash
yarn build
```

## 🛠️ ディレクトリ構成の出力方法（Tips）

この構造は以下のコマンドで出力しました：

```bash
tree -L 3 -I "node_modules|.git|dist|cards"
```

- `-L 3`: 3階層まで表示
- `-I`: 除外するディレクトリを指定（パイプ `|` で複数指定可能）
- `> structure.txt`: 結果をファイルに保存
