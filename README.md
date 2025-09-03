# Next.js Headless Blog

Un progetto **blog moderno** sviluppato con **Next.js 13 (App Router)** e **WordPress headless**. Include funzionalità avanzate come **React Server Components (RSC)**, **infinite scroll**, **autenticazione JWT**, **bookmarking**, e gestione interattiva dei commenti via WebSocket.

---

## **Indice**

- [Next.js Headless Blog](#nextjs-headless-blog)
  - [**Indice**](#indice)
  - [**Caratteristiche**](#caratteristiche)
  - [**Tecnologie**](#tecnologie)
  - [**Installazione**](#installazione)
  - [**Configurazione WordPress**](#configurazione-wordpress)
  - [**Struttura del progetto**](#struttura-del-progetto)
  - [**Funzionalità implementate**](#funzionalità-implementate)
  - [**Funzionalità future**](#funzionalità-future)
  - [**Contribuire**](#contribuire)
  - [**Licenza**](#licenza)

---

## **Caratteristiche**

* Blog headless con Next.js 13 e WordPress.
* Rendering ibrido: **RSC**, **SSR**, **client-side**.
* **Autenticazione JWT** e gestione sessione sicura con cookie HttpOnly.
* **Infinite scroll** e caricamento dinamico dei post.
* **Interazione in tempo reale** per commenti e bookmark.
* UI modulare con **componenti riutilizzabili**.
* Ottimizzazione performance e caching dati con **React Query / SWR**.

---

## **Tecnologie**

* **Frontend:** Next.js 13, React 18, TypeScript
* **Backend:** WordPress, JWT Authentication
* **Gestione stato:** React Query / SWR
* **Realtime:** WebSocket custom context
* **UI / Componenti:** TailwindCSS
* **Testing:** In previsione (Jest / React Testing Library)

---

## **Installazione**

1. Clona il repository:

```bash
git clone https://github.com/stefanoradice/nextjs-headless-blog.git
cd nextjs-headless-blog
```

2. Installa le dipendenze:

```bash
npm install
# oppure
yarn install
```

3. Configura le variabili d'ambiente (`.env.local`):

```
NEXT_PUBLIC_API_URL=https://tuo-wordpress.com/wp-json
WP_JWT_AUTH_SECRET_KEY=tuo_secret_key
```

4. Avvia il progetto in modalità sviluppo:

```bash
npm run dev
# oppure
yarn dev
```

---

## **Configurazione WordPress**

* Installare plugin:

  * JWT Authentication for WP REST API
  * Eventuali plugin per custom post type o REST endpoint personalizzati
* Creare utenti e ruoli necessari
* Verificare che i permessi REST API siano corretti

---

## **Struttura del progetto**

```
/app                 # App Router e pagine principali
/components          # Componenti riutilizzabili
/context             # Context globali (WebSocket, Auth)
/hooks               # Custom hooks
/lib                 # Funzioni di utilità e fetch API
/public              # Asset pubblici
```

---

## **Funzionalità implementate**

* Fetch dati post, categorie, tag via REST API
* Infinite scroll con React Server Components
* Autenticazione JWT con cookie HttpOnly
* Bookmark post
* Commenti in tempo reale via WebSocket
* Layout responsive e componenti modulari

---

## **Funzionalità future**

* Editing e cancellazione post
* Ruoli utenti avanzati e contenuti premium
* Ottimizzazione SEO e meta tag dinamici
* Miglioramento performance e streaming RSC
* Test automatizzati e CI/CD

---

## **Contribuire**

Contribuzioni, bug report o feature request sono benvenuti! Fork il repository e apri una pull request con una descrizione chiara.

---

## **Licenza**

[MIT](LICENSE) - libera di modificare e distribuire, citando l’autore.
