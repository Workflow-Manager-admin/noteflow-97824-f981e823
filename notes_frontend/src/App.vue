<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div id="main-layout">
    <header class="app-navbar">
      <nav class="navbar-nav">
        <div class="nav-title">
          <span class="logo-dot" />
          NoteFlow
        </div>
        <div class="nav-links">
          <RouterLink to="/" exact-active-class="active" class="nav-link">Notes</RouterLink>
          <RouterLink to="/about" exact-active-class="active" class="nav-link">About</RouterLink>
        </div>
      </nav>
    </header>
    <main class="app-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
#main-layout {
  min-height: 100vh;
  background: var(--color-background);
  width: 100vw;
  display: flex;
  flex-direction: column;
}
.app-navbar {
  width: 100%;
  background: var(--color-background-mute);
  border-bottom: 1px solid var(--color-border);
  padding: 0.7rem 1.3rem 0.7rem 0.9rem;
  box-shadow: 0 1px 6px 0 rgba(64, 94, 242, 0.03);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 110;
}
.navbar-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1320px;
}
.nav-title {
  font-weight: 600;
  font-size: 1.29rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: #405ef2;
  letter-spacing: -1.2px;
  gap: 0.56rem;
  padding: 0;
}
.logo-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(135deg, #405ef2, #8ba5c1);
  margin-right: 0.55rem;
  box-shadow: 0 1px 8px 0 #405ef220;
  display: inline-block;
}
.nav-links {
  display: flex;
  gap: 0.6rem;
}
.nav-link {
  color: var(--color-text);
  font-size: 1rem;
  padding: 0.28rem 0.92rem;
  border-radius: 6px;
  transition: background 0.14s;
  text-decoration: none;
}
.nav-link.active, .nav-link:focus {
  color: #405ef2;
  background: #eef0fa;
  font-weight: 600;
}
.nav-link:hover {
  background: #eef0fa;
}
@media (max-width: 650px) {
  .navbar-nav {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.47rem;
    padding: 0;
  }
  .nav-title {
    font-size: 1.15rem;
    margin-bottom: 0.33rem;
  }
  .nav-links {
    width: 100%;
  }
}
.app-content {
  flex: 1 1 auto;
  width: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
</style>
