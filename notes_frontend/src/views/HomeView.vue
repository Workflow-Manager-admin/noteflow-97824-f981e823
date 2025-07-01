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
  gap: 2.1rem;
  padding-top: 0.4rem;
  align-items: flex-start;
  width: 100%;
}
.left-panel {
  flex: 0 0 300px;
  min-width: 180px;
  max-width: 350px;
  width: 29vw;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.main-panel {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  width: 100%;
}

@media (max-width: 1000px) {
  .note-main-layout {
    flex-direction: column;
    gap: 0.8rem;
    width: 100%;
  }
  .left-panel {
    flex-direction: row;
    min-width: 0;
    max-width: none;
    width: 100%;
    gap: 0.64rem;
    align-items: stretch;
    justify-content: stretch;
  }
  .main-panel {
    width: 100%;
    min-width: 0;
    padding-top: 0.25rem;
  }
}
@media (max-width: 650px) {
  .note-main-layout {
    flex-direction: column;
    padding-top: 0.03rem;
    gap: 0.27rem;
    width: 100%;
  }
  .left-panel {
    flex-direction: column;
    width: 100%;
    gap: 0.2rem;
    max-width: none;
    padding: 0;
  }
  .main-panel {
    padding-top: 0.13rem;
    min-width: 0;
  }
}
@media (max-width: 400px) {
  .note-main-layout {
    padding-top: 0rem;
    gap: 0.09rem;
  }
}
</style>
