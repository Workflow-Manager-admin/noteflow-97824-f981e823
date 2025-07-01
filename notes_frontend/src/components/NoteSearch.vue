<template>
  <form class="note-search-form" @submit.prevent="onSearch">
    <input
      class="search-input"
      v-model="q"
      type="search"
      placeholder="Search notes..."
      aria-label="Search notes"
    />
    <button type="submit" class="btn btn-search" title="Search">
      🔍
    </button>
    <button
      v-if="q"
      type="button"
      class="btn btn-clear"
      @click="clear"
      title="Clear search"
    >✕</button>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  modelValue: string;
}>();

const emits = defineEmits(["update:modelValue", "search", "clear"]);

const q = ref(props.modelValue || "");

watch(
  () => props.modelValue,
  (val) => {
    if (val !== q.value) q.value = val;
  }
);

function onSearch() {
  emits("search", q.value);
}

function clear() {
  q.value = "";
  emits("clear");
  emits("update:modelValue", "");
}
</script>

<style scoped>
.note-search-form {
  display: flex;
  gap: 0.4rem;
  align-items: center;
  margin-bottom: 1rem;
  background: var(--color-background-soft);
  padding: 0.39rem 0.56rem;
  border-radius: 10px;
  box-shadow: 0 1px 3px 0 rgba(18, 18, 17, 0.06);
}
.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 1rem;
  color: var(--color-text);
  outline: none;
}
.btn {
  border: none;
  background: none;
  padding: 0.29rem 0.5rem;
  cursor: pointer;
  font-size: 1.16rem;
  border-radius: 6px;
  transition: background 0.14s;
}
.btn-search:hover,
.btn-clear:hover {
  background: #eef0fa;
}
</style>
