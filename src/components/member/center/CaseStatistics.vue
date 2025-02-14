<template>
  <div class="row text-center mb-4">
    <div class="col-md-3" v-for="(caseItem, index) in cases" :key="index">
      <div class="card">
        <div class="card-body">
          <h3>{{ caseItem.count }}</h3>
          <p class="text-muted">{{ caseItem.label }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const cases = ref([
  { label: "救援案件數", count: 2 },
  { label: "送養案件數", count: 0 },
  { label: "遺失案件數", count: 0 },
  { label: "領養案件數", count: 2 },
]);
</script>