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
        <label>Content</label>
        <div class="rte-toolbar" v-if="editor">
          <button type="button" class="rte-btn" @click="editor.chain().focus().toggleBold().run()" :class="{ active: editor.isActive('bold') }" title="Bold"><b>B</b></button>
          <button type="button" class="rte-btn" @click="editor.chain().focus().toggleItalic().run()" :class="{ active: editor.isActive('italic') }" title="Italic"><i>I</i></button>
          <button type="button" class="rte-btn" @click="editor.chain().focus().toggleStrike().run()" :class="{ active: editor.isActive('strike') }" title="Strikethrough"><s>S</s></button>
          <button type="button" class="rte-btn" @click="editor.chain().focus().toggleBulletList().run()" :class="{ active: editor.isActive('bulletList') }" title="Bulleted List">• List</button>
          <button type="button" class="rte-btn" @click="editor.chain().focus().toggleOrderedList().run()" :class="{ active: editor.isActive('orderedList') }" title="Numbered List">1. List</button>
          <button type="button" class="rte-btn" @click="editor.chain().focus().setParagraph().run()" :class="{ active: editor.isActive('paragraph') }" title="Paragraph">¶</button>
          <button type="button" class="rte-btn" @click="editor.chain().focus().toggleHeading({level: 1}).run()" :class="{ active: editor.isActive('heading', { level: 1 }) }" title="Heading 1">H1</button>
          <button type="button" class="rte-btn" @click="editor.chain().focus().toggleHeading({level: 2}).run()" :class="{ active: editor.isActive('heading', { level: 2 }) }" title="Heading 2">H2</button>
        </div>
        <editor-content
          class="tiptap-content"
          v-if="editor"
          :editor="editor"
          id="note-content"
        />
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
import { ref, watch, onBeforeUnmount } from "vue";
import type { Note } from "@/api/notes";
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";

const props = defineProps<{
  note: Note | null;
  organizations: string[];
}>();

const emits = defineEmits(["update", "delete", "create"]);

const localTitle = ref("");
const localContent = ref(""); // HTML string for TipTap
const localOrganization = ref<string | undefined>("");

const editor = ref<Editor | null>(null);

// Sync local fields from note prop
watch(
  () => props.note,
  (val) => {
    if (val) {
      localTitle.value = val.title;
      localContent.value = val.content || "";
      localOrganization.value = val.organization;
      // Re-set content in TipTap
      if (editor.value) {
        editor.value.commands.setContent(val.content || "");
        // Avoid triggering update callback (initialized)
      }
    } else {
      localTitle.value = "";
      localContent.value = "";
      localOrganization.value = "";
      if (editor.value) {
        editor.value.commands.setContent("");
      }
    }
  },
  { immediate: true }
);

// Initialize TipTap editor
watch(
  () => editor.value,
  (ed) => {
    if (ed && localContent.value !== undefined) {
      ed.commands.setContent(localContent.value);
    }
  }
);

// On first mount, initialize editor
if (!editor.value) {
  editor.value = new Editor({
    content: localContent.value,
    extensions: [
      StarterKit,
    ],
    onUpdate: ({ editor }) => {
      localContent.value = editor.getHTML();
    },
    editorProps: {
      attributes: {
        id: "note-content",
        class: "tiptap-content"
      }
    },
    autofocus: false
  });
}

// Destroy TipTap instance on unmount
onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});

function handleSave() {
  // Always use HTML content from TipTap as the content
  if (!props.note) {
    emits("create", {
      title: localTitle.value,
      content: editor.value ? editor.value.getHTML() : "",
      organization: localOrganization.value || undefined,
    });
  } else {
    emits("update", {
      ...props.note,
      title: localTitle.value,
      content: editor.value ? editor.value.getHTML() : "",
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

.editor-field input {
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
.editor-field input:focus {
  outline: none;
  border: 1.6px solid #405ef2;
  background: #eef0fa;
}

/* TipTap editor custom styles */
.tiptap-content {
  min-height: 168px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 9px;
  padding: 0.73rem 1.1rem;
  font-size: 1rem;
  line-height: 1.7;
  color: var(--color-text);
  margin-top: 0.09rem;
  margin-bottom:1px;
  transition: border 0.2s, background 0.15s;
  outline: none;
  box-sizing: border-box;
  word-wrap: break-word;
  resize: vertical;
}
.tiptap-content:focus {
  border: 1.6px solid #405ef2;
  background: #eef0fa;
}
.tiptap-content p {
  margin: 0 0 0.44em 0;
}
.tiptap-content ul,
.tiptap-content ol {
  margin: 0 0 0.44em 1.3em;
}
.tiptap-content li {
  margin-bottom: 0.19em;
}
.tiptap-content h1 {
  font-size: 1.42rem;
  color: #405ef2;
  margin-top: .82em;
  margin-bottom: .28em;
  font-weight: 700;
}
.tiptap-content h2 {
  font-size: 1.15rem;
  color: #405ef2;
  margin-top: .63em;
  margin-bottom: .22em;
  font-weight: 600;
}
.tiptap-content strong {
  font-weight: 700;
  color: #233292;
}
.tiptap-content em {
  font-style: italic;
}
.tiptap-content s {
  color: #8ba5c1;
}

.rte-toolbar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.33rem;
  flex-wrap: wrap;
  user-select: none;
}
.rte-btn {
  background: #eef0fa;
  border: 1.2px solid var(--color-border-hover);
  color: #405ef2;
  font-size: 1.02rem;
  padding: 0.19em 0.62em;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.14s, border 0.12s, color 0.14s;
  margin-right: 0.07em;
  min-width: 30px;
  font-weight: 500;
}
.rte-btn.active,
.rte-btn:focus {
  background: #405ef2;
  color: #fff;
  border: 1.3px solid #405ef2;
}
.rte-btn:hover {
  background: #dbe1fa;
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
  .tiptap-content {
    padding: 0.38rem 0.45rem;
    font-size: 0.97rem;
  }
  .rte-toolbar {
    gap: 0.24rem;
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
