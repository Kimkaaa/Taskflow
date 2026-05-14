# TaskFlow

![TaskFlow 대표 화면](./docs/images/cover.png)

<br>

TaskFlow는 개인 작업을 정리하고 관리하기 위해 만든 서비스입니다.

Next.js와 TypeScript로 구현했으며, Supabase를 통해 인증과 데이터베이스를 연동하고 Vercel에 배포했습니다.

<br>
<br>

## 프로젝트 정보

- **유형**: 개인 프로젝트

- **기간**: 2026.05.06 ~ 2026.05.11

- **배포 링크**: 🔗 [https://taskflow-ten-eosin.vercel.app](https://taskflow-ten-eosin.vercel.app/)

<br>
<br>

## 기술 스택

- **프론트엔드**: TypeScript, Next.js, React, Tailwind CSS

- **인증**: Supabase Auth, GitHub OAuth

- **데이터베이스**: Supabase PostgreSQL

- **ORM**: Prisma

- **배포**: Vercel

<br>
<br>

## 주요 기능

- GitHub 로그인

- 작업 등록/수정/삭제

- 상태, 중요도, 마감일, 공개 여부 설정

- 검색, 필터링, 정렬

- 체크리스트 기반 세부 작업 관리

<br>
<br>

## 주요 화면

### 작업 목록

검색, 태그, 필터, 정렬 조건에 따라 작업을 확인할 수 있습니다.

<img src="./docs/images/task-list.png" alt="작업 목록" width="500" />

<br>

### 작업 수정

작업 기본 정보와 태그, 체크리스트를 수정할 수 있습니다.

<img src="./docs/images/task-edit.gif" alt="작업 수정" width="500" />

<br>

### 작업 상세

작업 내용과 체크리스트를 확인하고, 항목별 완료 여부를 변경할 수 있습니다.

<img src="./docs/images/task-detail.gif" alt="작업 상세" width="500" />

<br>
<br>

## 구현 내용

### 목록 조회 및 로딩 UX

배포 환경에서 목록 조회 응답이 지연되는 문제를 확인하고, 조회 방식과 로딩 피드백을 보완했습니다.

목록 화면에 필요한 필드만 `select`로 조회하고, Prisma `orderBy`와 `cursor` 기반 페이지네이션으로 초기 조회 범위를 제한했습니다.

요청이 발생하는 화면 요소에는 로딩 UI와 pending 상태를 표시해, 지연 상황에서 사용자가 처리 중임을 알 수 있도록 했습니다.

<br>

### Server Actions 기반 데이터 저장

작업 등록과 수정은 Next.js Server Actions로 처리했습니다.

기본 정보, 체크리스트, 태그를 함께 저장하기 위해 Prisma 트랜잭션을 사용했습니다.

태그는 기존 데이터를 재사용해 동일 태그가 중복 저장되지 않도록 했습니다.

입력 단계와 서버 액션에서 입력값을 검증하고, 예외 발생 시 화면에서 안내할 수 있도록 했습니다.

<br>

### GitHub OAuth 인증

Supabase Auth를 사용해 GitHub 로그인을 연동했습니다.

로그인 전 요청 경로를 `next` 값으로 전달하고, OAuth 콜백 이후 해당 경로로 이동하도록 했습니다.

`next` 값을 검증해 의도하지 않은 경로로 이동하지 않도록 제한했습니다.

<br>

### 체크리스트 관리

작업마다 체크리스트를 등록하고, 상세 화면에서 완료 여부를 변경할 수 있도록 했습니다.

입력 화면에서 항목을 편집하고, `dnd-kit`을 사용해 드래그 앤 드롭으로 순서를 변경할 수 있도록 했습니다.

변경된 순서는 `sortOrder`로 저장해, 저장 후에도 순서가 유지되도록 했습니다.
