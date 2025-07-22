# OTOBINGO - オンライン動画ビンゴアプリ

ニコニコ動画やYouTubeの動画を使って、オンラインでビンゴ大会を開催できるWebアプリケーションです。

## ✨ 主な機能

- **プロジェクトベース**: 大会ごとにプロジェクトを作成し、参加者を管理できます。
- **リアルタイム同期**: Firebase Realtime Database を利用して、ゲームの進行状況が全参加者の画面にリアルタイムで反映されます。
- **動画でビンゴ**: ニコニコ動画 (smXXXXXXXX) やYouTubeのIDを使って、オリジナルのビンゴカードを作成できます。
- **主催者・参加者モード**: 主催者はゲームの開始や動画のコール、参加者はカードの作成やリセットができます。
- **自動ビンゴ判定**: ビンゴが成立すると自動で検知し、ランキングが表示されます。

## 🛠️ 技術スタック

- **フロントエンド**: React
- **リアルタイムデータベース**: Firebase Realtime Database
- **ホスティング**: Vercel

## 🚀 ローカルでの動かし方

1.  このリポジトリをクローンします。
    ```bash
    git clone https://github.com/Sakefry/OTOBINGO.git
    cd OTOBINGO
    ```

2.  必要なパッケージをインストールします。
    ```bash
    npm install
    ```

3.  Firebaseプロジェクトを作成し、設定情報を `src/firebase.js` に記述します。
    - [Firebase Console](https://console.firebase.google.com/) から新しいプロジェクトを作成します。
    - 「Realtime Database」を有効化します（テストモードでOK）。
    - 「プロジェクト設定」からWebアプリを追加し、`firebaseConfig` オブジェクトを取得して `src/firebase.js` に貼り付けます。

4.  開発サーバーを起動します。
    ```bash
    npm start
    ```
    ブラウザで `http://localhost:3000` が開きます。

## 🤝 コントリビューション

このプロジェクトへのコントリビューションを歓迎します！バグ報告、機能追加の提案、プルリクエストなど、お気軽にどうぞ。

1.  このリポジトリをフォークします。
2.  新しいブランチを作成します (`git checkout -b feature/your-feature`)。
3.  変更をコミットします (`git commit -m 'Add some feature'`)。
4.  ブランチにプッシュします (`git push origin feature/your-feature`)。
5.  プルリクエストを作成します。

---
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
