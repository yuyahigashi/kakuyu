# KAKUYU

日本をレンズに、人間の条件を考える独立系ウェブメディア。Astro、Pages CMS、GitHub、Cloudflare Pagesで運用する軽量構成です。

## ローカル確認

```sh
npm install
npm run dev
```

## 編集者の記事公開フロー

1. GitHubにこのプロジェクトを保存する
2. Pages CMS（pagescms.org）でGitHubアカウントにログインする
3. このリポジトリを選ぶ
4. 「記事」から新規作成する
5. 「下書き」をオフにして保存する

保存するとMarkdownファイルが `src/content/stories` に追加されます。Cloudflare PagesをGitHubへ接続していれば、自動的に再ビルド・公開されます。

## Cloudflare Pages設定

- Framework preset: Astro
- Build command: `npm run build`
- Build output directory: `dist`
- Node.js: 20以上

本番URLは `https://kakuyu.com` に設定済みです。

## 公開前に必要な差し替え

- `editor@example.com` を実際の連絡先へ変更
- ニュースレターフォームを配信サービスへ接続
- 実際の写真とクレジットを登録

旧Next.js試作は `work/vinext-prototype-backup` に退避してあります。
