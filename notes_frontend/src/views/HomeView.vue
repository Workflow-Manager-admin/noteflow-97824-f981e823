<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useNotesStore } from "@/stores/notes";
import NoteList from "@/components/NoteList.vue";
import NoteEditor from "@/components/NoteEditor.vue";
import NoteSearch from "@/components/NoteSearch.vue";

const store = useNotesStore();

const searchQuery = ref("");
const creating = ref(false);

onMounted(() => {
  store.fetchNotes();
});
watch(
  () => store.organizationFilter,
  (org) => store.fetchNotes(org || undefined)
);

// Set organization
function handleSetOrg(org: string | null) {
  store.setOrganizationFilter(org);
  store.fetchNotes(org || undefined);
  // Deselect when changing org filter
  store.setActiveNote(null);
}

function handleSelect(id: string) {
  store.setActiveNote(id);
  creating.value = false;
}

function handleNew() {
  creating.value = true;
  store.setActiveNote(null);
}

function handleEditorCreate(payload: { title: string; content: string; organization?: string }) {
  store
    .createNote(payload)
    .then(() => {
      creating.value = false;
    })
    .catch(() => {});
}

import type { Note } from "@/api/notes";

function handleEditorUpdate(note: Note) {
  store.updateNote(note.id, {
    title: note.title,
    content: note.content,
    organization: note.organization,
  });
}

function handleEditorDelete(id: string) {
  store.deleteNote(id);
  store.setActiveNote(null);
  creating.value = false;
}

// Search
function handleSearch(q: string) {
  if (q) {
    store.searchNotes(q, store.organizationFilter || undefined);
  } else {
    store.fetchNotes(store.organizationFilter || undefined);
  }
}

 // DATA for editors
const currentNote = computed(() => {
  if (creating.value) return null;
  return store.activeNote;
});
</script>

<template>
  <main class="note-main-layout">
    <div class="left-panel">
      <NoteSearch
        v-model="searchQuery"
        @search="handleSearch"
        @clear="() => handleSearch('')"
      />
      <NoteList
        :notes="store.filteredNotes"
        :selected="store.activeNoteId"
        :organizations="store.organizations"
        :orgFilter="store.organizationFilter"
        @select="handleSelect"
        @new="handleNew"
        @set-org="handleSetOrg"
      />
    </div>
    <div class="main-panel">
      <NoteEditor
        :note="creating ? { id: '', title: '', content: '', createdAt: '', updatedAt: '', organization: store.organizationFilter || undefined } : currentNote"
        :organizations="store.organizations"
        @create="handleEditorCreate"
        @update="handleEditorUpdate"
        @delete="handleEditorDelete"
      />
    </div>
  </main>
</template>

<style scoped>
.note-main-layout {
  display: flex;
  flex-direction: row;
  gap: 2.2rem;
  padding-top: 0.5rem;
}
.left-panel {
  flex: 0 0 320px;
  min-width: 220px;
  max-width: 340px;
  width: 29vw;
  display: flex;
  flex-direction: column;
  gap: 0.73rem;
}
.main-panel {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

@media (max-width: 1000px) {
  .note-main-layout {
    flex-direction: column;
    gap: 0.9rem;
  }
  .left-panel {
    flex-direction: row;
    min-width: 0;
    max-width: none;
    width: 100%;
    gap: 0.7rem;
  }
  .main-panel {
    width: 100%;
    min-width: 0;
    padding-top: 0.4rem;
  }
}
@media (max-width: 600px) {
  .note-main-layout {
    padding-top: 0.1rem;
    gap: 0.5rem;
  }
}
</style>
