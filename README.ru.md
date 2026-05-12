# Job Tracker

Трекер откликов на вакансии. Я сделал его для себя, потому что таблица начала
разваливаться: много компаний, много смен статусов, и неудобно понимать, где
уже пора напомнить о себе.

[Демо](https://job-tracker-xi-lake.vercel.app) · [English README](README.md)

![demo](./client/public/demo.gif)

## Стек

- **Фронт:** React 19, TypeScript, Vite, React Router, TanStack Query, react-i18next
- **Бэк:** Node.js, Express 5, TypeScript, PostgreSQL (`pg`), Zod, JWT, bcryptjs
- **Тесты:** Vitest + Supertest для сервисов и HTTP-роутов бэка
- **CI:** GitHub Actions
- **Деплой:** Vercel для фронта, Railway для бэка и Postgres

## Запуск локально

```bash
git clone https://github.com/op7en/job-tracker.git
cd job-tracker
cp .env.example .env
```

Заполни `JWT_SECRET` и `DATABASE_URL`, потом запусти бэк:

```bash
npm install
npm run migrate
npm run dev
```

В другом терминале:

```bash
cd client
npm install
npm run dev
```

Бэк будет на `:3000`, фронт на `:5173`.

Полезные команды:

```bash
npm run build
npm test

cd client
npm run lint
npm run build
```

`JWT_SECRET` должен быть длинной случайной строкой. В проде бэк не стартует со
слабым секретом.

Для production Postgres SSL: если `DATABASE_URL` содержит `sslmode=require`,
приложение ждёт валидную цепочку сертификатов. Если провайдер использует свой
CA, нужно задать `DATABASE_CA_CERT`. Альтернатива для Railway - private database
URL без принудительного SSL.

## Что умеет

- Kanban-доска с drag-and-drop между `applied`, `interview`, `offer`,
  `rejected`
- Табличный вид для редактирования, фильтрации и удаления откликов
- История действий по каждому отклику
- Пометка откликов, которые не двигались 7+ дней
- Базовая статистика: всего откликов, интервью, офферы, отказы, response rate
- UI на английском, русском и итальянском

## Как устроен бэк

Бэк разбит на `routes -> controllers -> services -> repositories`.

Это не магическая архитектура. Часть read-методов всё ещё просто проходит через
service layer и ничего там не добавляет. Я оставил форму слоёв, потому что для
write-операций service layer уже нужен: создание и обновление открывают
транзакцию и пишут изменение отклика вместе со строкой в `activity_logs`.

Чтение, обновление и удаление откликов фильтруются по `user_id` прямо в SQL.
Эндпоинт истории проверяет ownership через join с `applications`. Это главная
линия access control в проекте.

Динамический update отклика собирается в репозитории, а не в сервисе. Репозиторий
разрешает только whitelist колонок (`company`, `position`, `status`, `notes`),
поэтому пользовательский ввод не становится именем колонки.

## Авторизация

- Access token: 15 минут, хранится в памяти на клиенте, отправляется как
  `Authorization: Bearer`.
- Refresh token: 30 дней, отправляется как `httpOnly` cookie с `path=/auth`.
- Refresh-токены в PostgreSQL лежат как SHA-256 хеши. Это не хеширование
  паролей; сам токен генерируется из 48 случайных байт.
- Каждый `/auth/refresh` ревокает старый refresh-токен и выдаёт новую пару.
- У refresh-токенов есть `family_id`. Если приходит уже ревокнутый токен,
  ревокается вся семья.
- Login всё равно вызывает `bcrypt.compare` с dummy hash, если email не найден.
  Так по времени ответа нельзя понять, какие email зарегистрированы.
- На фронте есть один общий refresh promise, поэтому несколько одновременных
  `401` не создают несколько refresh-запросов.

Отдельно пришлось разбираться с rate limiter в проде. Railway стоит за прокси,
поэтому Express нужен `app.set("trust proxy", 1)`, иначе limiter видит IP прокси,
а не клиента. Ещё пришлось использовать `ipKeyGenerator`, чтобы нормально
обрабатывать IPv6.

## База данных

PostgreSQL, 5 forward-only миграций:

- `users` - аккаунты, unique email
- `applications` - отклики, связаны с `users`
- `activity_logs` - история с JSONB payload, каскад от `applications`
- `refresh_tokens` - refresh-сессии как хеши, с `family_id`
- `schema_migrations` - учёт применённых миграций

Важные constraints:

- у `applications.status` есть database `CHECK`
- `applications.user_id` каскадится от `users`
- `activity_logs.application_id` каскадится от `applications`
- есть индексы на `applications.user_id`, `refresh_tokens.user_id`,
  `refresh_tokens.expires_at`, `refresh_tokens.family_id`

Миграционный раннер написал сам, чтобы понять, как это работает: таблица
`schema_migrations`, транзакция на каждый файл и Postgres advisory lock. У него
нет down-миграций и checksums. В командном проекте я бы взял `dbmate`,
`node-pg-migrate` или миграции из фреймворка.

## Тесты и CI

Тесты бэка покрывают сервисы и HTTP-роуты:

- register/login/refresh/logout
- rotation refresh-токенов и family revocation
- dummy bcrypt compare для login с несуществующим email
- транзакции create/update отклика и rollback при ошибке
- проверки авторизации на `/auth/me`

GitHub Actions запускает backend build + tests и frontend lint + build на pull
request и push в `main`.

Фронтовых тестов пока нет.

## Чего ещё не хватает

Эти проблемы я знаю:

- `GET /applications` без пагинации.
- `activity_logs` растёт бесконечно.
- Истёкшие и ревокнутые refresh-токены не чистятся cron job'ом.
- Нет email verification и password reset.
- Rate limit по IP, так что общий NAT может заблокировать нормальных юзеров.
- У Kanban drag-and-drop слабая keyboard accessibility.
- Проверка "не двигалось 7+ дней" считается на клиенте.
- Логи ошибок всё ещё через `console.error`; нет pino/request-id.
- На фронте нет тестов.

Это не спрятано. Это следующие очевидные шаги, если проект развивать дальше.
