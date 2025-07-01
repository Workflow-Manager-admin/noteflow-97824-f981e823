<template>
  <aside class="note-list-panel">
    <div class="note-list-header">
      <select v-model="org" @change="setOrganization" class="org-select">
        <option value="">All</option>
        <option v-for="orgLabel in organizations" :key="orgLabel" :value="orgLabel">
          {{ orgLabel }}
        </option>
      </select>
      <button class="btn btn-primary" @click="$emit('new')">New Note</button>
    </div>
    <ul class="note-list">
      <li
        v-for="item in notes"
        :key="item.id"
        :class="{ active: item.id === selected }"
        @click="$emit('select', item.id)"
      >
        <div class="note-title">{{ item.title || "Untitled" }}</div>
        <div class="note-snippet">{{ item.content.slice(0, 80) }}<span v-if="item.content.length > 80">…</span></div>
        <div class="note-meta">
          <span class="note-org" v-if="item.organization">{{ item.organization }}</span>
          <span class="note-date">{{ formatDate(item.updatedAt) }}</span>
        </div>
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { Note } from "@/api/notes";

const props = defineProps<{
  notes: Note[];
  selected: string | null;
  organizations: string[];
  orgFilter: string | null;
}>();

const emits = defineEmits(["select", "new", "set-org"]);

const org = ref(props.orgFilter || "");

// Respond to props change
watch(
  () => props.orgFilter,
  (val) => (org.value = val || "")
);

function setOrganization() {
  emits("set-org", org.value || null);
}

function formatDate(dt: string) {
  const date = new Date(dt);
  return date.toLocaleDateString() +
    " " +
    date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}
</script>

<style scoped>
.note-list-panel {
  background: var(--color-background-soft);
  border-radius: 12px;
  box-shadow: 0 2px 10px 0 rgba(18, 18, 17, 0.04);
  padding: 1.1rem 0.7rem 0.5rem 0.7rem;
  min-width: 250px;
  min-height: 380px;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-bottom: 1.1rem;
}
.note-list-header {
  display: flex;
  gap: 0.7rem;
  align-items: center;
  margin-bottom: 0.7rem;
}
.org-select {
  flex: 1 1 90%;
  background: var(--color-background-mute);
  border-radius: 8px;
  border: 1px solid var(--color-border);
  font-size: 0.95rem;
  padding: 0.4rem 0.7rem;
}
.btn-primary {
  background: #405ef2;
  color: #fff;
  border: 1px solid #405ef2;
  padding: 0.44rem 1.1rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
}
.btn-primary:hover {
  background: #233292;
}
.note-list {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1 1 auto;
  overflow-y: auto;
}
.note-list li {
  background: var(--color-background);
  border-radius: 8px;
  margin-bottom: 0.6rem;
  padding: 0.75rem 0.72rem 0.5rem 0.72rem;
  cursor: pointer;
  transition: background 0.14s, box-shadow 0.16s;
  border: 1.1px solid transparent;
  box-shadow: 0 1px 2px rgba(18,18,17, 0.02);
  word-break: break-word;
}
.note-list li.active,
.note-list li:hover {
  background: #eef0fa;
  border: 1.3px solid #405ef2;
}
.note-title {
  font-weight: 600;
  color: #405ef2;
  font-size: 1.08rem;
  margin-bottom: 0.23rem;
}
.note-snippet {
  font-size: 0.99rem;
  color: var(--color-text);
  margin-bottom: 0.11rem;
  opacity: 0.85;
}
.note-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #8ba5c1;
  opacity: 0.98;
}
.note-org {
  font-weight: 500;
}
.note-date {
  opacity: 0.79;
}
@media (max-width: 900px) {
  .note-list-panel {
    min-width: 100px;
    max-width: 100%;
    padding: 0.7rem 0.3rem;
    border-radius: 8px;
  }
  .note-list-header {
    flex-direction: column;
    gap: 0.3rem;
    align-items: stretch;
    margin-bottom: 0.54rem;
  }
}
</style>
