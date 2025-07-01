<template>
  <div class="note-editor" v-if="note">
    <form @submit.prevent="handleSave" class="editor-form">
      <div class="editor-field">
        <label for="note-title">Title</label>
        <input v-model="localTitle" id="note-title" placeholder="Untitled note..." required />
      </div>
      <div class="editor-field">
        <label for="note-org">Organization</label>
        <input
          v-model="localOrganization"
          id="note-org"
          list="organization-list"
          placeholder="Folder/category (optional)"
        />
        <datalist id="organization-list">
          <option v-for="org in organizations" :key="org" :value="org" />
        </datalist>
      </div>
      <div class="editor-field">
        <label for="note-content">Content</label>
        <textarea
          v-model="localContent"
          id="note-content"
          rows="12"
          placeholder="Write your note here..."
        ></textarea>
      </div>
      <div class="editor-actions">
        <button
          v-if="note.id"
          type="button"
          class="btn btn-delete"
          @click="handleDelete"
        >
          Delete
        </button>
        <button type="submit" class="btn btn-primary">
          {{ note.id ? "Save Changes" : "Create Note" }}
        </button>
      </div>
    </form>
  </div>
  <div v-else class="note-editor-empty">
    <p>Select a note to view or edit, or click "New Note" to create.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { Note } from "@/api/notes";

const props = defineProps<{
  note: Note | null;
  organizations: string[];
}>();

const emits = defineEmits(["update", "delete", "create"]);

const localTitle = ref("");
const localContent = ref("");
const localOrganization = ref<string | undefined>("");

// When props.note changes, update local fields
watch(
  () => props.note,
  (val) => {
    if (val) {
      localTitle.value = val.title;
      localContent.value = val.content;
      localOrganization.value = val.organization;
    } else {
      localTitle.value = "";
      localContent.value = "";
      localOrganization.value = "";
    }
  },
  { immediate: true }
);

function handleSave() {
  if (!props.note) {
    // Create new
    emits("create", {
      title: localTitle.value,
      content: localContent.value,
      organization: localOrganization.value || undefined,
    });
  } else {
    emits("update", {
      ...props.note,
      title: localTitle.value,
      content: localContent.value,
      organization: localOrganization.value || undefined,
    });
  }
}

function handleDelete() {
  if (props.note && props.note.id) {
    emits("delete", props.note.id);
  }
}
</script>

<style scoped>
.note-editor,
.note-editor-empty {
  background: var(--color-background-soft);
  border-radius: 16px;
  box-shadow: 0 2px 6px 0 rgba(64, 94, 242, 0.05);
  padding: 2rem 1.5rem;
  min-height: 350px;
  width: 100%;
  transition: background 0.3s;
  margin-bottom: 1.5rem;
}
.editor-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.editor-field label {
  font-weight: 500;
  color: var(--color-heading);
  margin-bottom: 0.35rem;
  display: block;
}
.editor-field input,
.editor-field textarea {
  width: 100%;
  font-size: 1rem;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text);
  margin-top: 0.1rem;
  resize: vertical;
  transition: border 0.2s;
}
.editor-field input:focus,
.editor-field textarea:focus {
  outline: none;
  border: 1.5px solid #405ef2;
}
.editor-actions {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  justify-content: flex-end;
}
.btn {
  appearance: none;
  background: var(--color-background);
  border: 1px solid var(--color-border-hover);
  padding: 0.48rem 1.3rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s, border 0.15s, color 0.15s;
  font-weight: 500;
  font-size: 1rem;
}
.btn-primary {
  background: #405ef2;
  color: #fff;
  border: 1px solid #405ef2;
}
.btn-primary:hover {
  background: #233292;
}
.btn-delete {
  color: #cb0d1f;
  border: 1px solid #cb0d1f;
  background: #f9f2f3;
}
.btn-delete:hover {
  background: #f7c8ce;
}
@media (max-width: 600px) {
  .note-editor,
  .note-editor-empty {
    padding: 1rem 0.5rem;
  }
}
.note-editor-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text);
  min-height: 200px;
}
</style>
