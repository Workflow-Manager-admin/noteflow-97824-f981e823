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
  border-radius: var(--corner-radius, 14px);
  box-shadow: 0 2px 9px 0 rgba(64, 94, 242, 0.06);
  padding: 2.1rem 1.3rem;
  min-height: 320px;
  width: 100%;
  transition: background 0.3s;
  margin-bottom: 1.1rem;
}

.editor-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.editor-field label {
  font-weight: 500;
  color: var(--color-heading);
  margin-bottom: 0.34rem;
  display: block;
  letter-spacing: -0.4px;
}

.editor-field input,
.editor-field textarea {
  width: 100%;
  font-size: 1rem;
  padding: 0.68rem 0.98rem;
  border-radius: 9px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text);
  margin-top: 0.07rem;
  resize: vertical;
  transition: border 0.2s, background 0.15s;
  box-sizing: border-box;
}
.editor-field input:focus,
.editor-field textarea:focus {
  outline: none;
  border: 1.6px solid #405ef2;
  background: #eef0fa;
}
.editor-actions {
  display: flex;
  gap: 0.8rem;
  margin-top: 0.37rem;
  justify-content: flex-end;
  flex-wrap: wrap;
}
.btn {
  appearance: none;
  background: var(--color-background);
  border: 1px solid var(--color-border-hover);
  padding: 0.47rem 1.13rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.14s, border 0.14s, color 0.14s;
  font-weight: 500;
  font-size: 1rem;
  min-width: 96px;
}
.btn-primary {
  background: #405ef2;
  color: #fff;
  border: 1px solid #405ef2;
  box-shadow: 0 2px 12px 0 #405ef220;
}
.btn-primary:hover,
.btn-primary:focus {
  background: #233292;
  color: #fff;
}
.btn-delete {
  color: #cb0d1f;
  border: 1px solid #cb0d1f;
  background: #f9f2f3;
}
.btn-delete:hover,
.btn-delete:focus {
  background: #f7c8ce;
}
@media (max-width: 600px) {
  .note-editor,
  .note-editor-empty {
    padding: 0.65rem 0.23rem;
    box-shadow: none;
    border-radius: 7px;
  }
  .editor-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 0.55rem;
  }
}
.note-editor-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text);
  min-height: 160px;
  opacity: 0.8;
  font-size: 1.01rem;
  background: none;
  box-shadow: none;
}
</style>
