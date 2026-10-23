# Rico Fieldnotes

홈 화면은 포트폴리오, 프로젝트, 블로그 기록, 소개로 구성됩니다.

## 글 작성

기존 Jekyll 발행 방식을 유지합니다. `_drafts/`는 비공개 초안이며, 발행할 글만 `_posts/YYYY-MM-DD-slug.md`에 둡니다. `main`에 반영하면 GitHub Pages가 다시 빌드합니다. `fieldnotes-posts.json`은 Jekyll의 `site.posts`에서 자동 생성되므로 글과 카테고리가 자동 반영됩니다. 초안은 홈 목록에 포함하지 않습니다.

```yaml
---
layout: post
title: "새로운 글 제목"
category: "Research"
description: "글 목록에 보이는 짧은 설명"
date: 2026-10-24 10:00:00 +0900
---
```

## 포트폴리오 수정

- 자기소개, 학력, GitHub 프로젝트 카드, 이메일: `index.html`
- 업무·연구 프로젝트의 기간, 내용, 기술: `fieldnotes/work-projects.json`
- 색상, 글꼴, 반응형 레이아웃: `fieldnotes/style.css`
- 검색, 카테고리, 테마와 글 읽기: `fieldnotes/main.js`
- 브라우저 아이콘: `fieldnotes/favicon.svg`

추가 패키지나 API 키가 필요하지 않습니다. 기존 `_layouts`, `_posts`, `_drafts`, `about.html`, RSS, 개별 글 주소와 이미지는 유지됩니다. 예전 글을 직접 열면 기존 글 레이아웃으로 표시되며 새 홈페이지에서는 읽기 창으로 열립니다. 테마 선택은 방문자의 브라우저에 저장됩니다.

Sites 배포본은 제작 당시 발행된 글의 스냅샷입니다. GitHub Pages는 빌드마다 최신 글을 가져옵니다. Sites에서도 최신 글을 반영하려면 Sites 버전을 다시 배포합니다.

## 업무·연구 프로젝트 출처

LinkedIn 프로필의 프로젝트 6개를 2026-10-24에 확인했습니다: https://www.linkedin.com/in/ricokim328/details/projects/

기재된 기간과 기술을 기준으로 한국어 요약을 작성했습니다. 위성 재급유 AOCS와 SaD NeRF는 원문에 세부 수행 내용이 없어 주제 설명만 제공합니다. CPSat의 발사 완료나 성능 수치는 확인된 내용이 없어 추가하지 않았습니다. 진행 중 표시는 확인 당시 프로필 기준입니다.
