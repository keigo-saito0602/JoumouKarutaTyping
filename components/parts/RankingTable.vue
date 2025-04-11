<template>
  <v-container class="app-ranking">
    <v-table class="ranking-table" density="comfortable">
      <thead>
        <tr>
          <th><v-icon start>mdi-crown</v-icon>順位</th>
          <th><v-icon start>mdi-account</v-icon>ニックネーム</th>
          <th><v-icon start>mdi-check</v-icon>札の数</th>
          <th><v-icon start>mdi-close</v-icon>お手つき</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(data, index) in currentPageData" :key="index">
          <td>{{ getRank(index) }}<span class="ranking-small">位</span></td>
          <td>{{ data.name }}<span class="ranking-small">さん</span></td>
          <td>{{ data.result }}<span class="ranking-small">枚</span></td>
          <td>{{ data.sub_result }}<span class="ranking-small">回</span></td>
        </tr>

        <tr v-for="i in emptyRowCount" :key="'empty-' + i">
          <td colspan="4">&nbsp;</td>
        </tr>
      </tbody>
    </v-table>

    <v-row justify="center" class="pagination-buttons mt-4">
      <v-btn icon @click="$emit('prev')" :disabled="isFirstPage">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn icon @click="$emit('next')" :disabled="isLastPage">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { SortedResult } from "@/types/ranking";

const props = defineProps<{
  ranking: SortedResult[];
  pageSize: number;
  currentPage: number;
}>();

const emit = defineEmits<{
  (e: "prev"): void;
  (e: "next"): void;
}>();

const currentPageData = computed(() =>
  props.ranking.slice(
    (props.currentPage - 1) * props.pageSize,
    props.currentPage * props.pageSize
  )
);

const emptyRowCount = computed(() =>
  Math.max(0, props.pageSize - currentPageData.value.length)
);

const isFirstPage = computed(() => props.currentPage === 1);
const isLastPage = computed(
  () => props.currentPage >= Math.ceil(props.ranking.length / props.pageSize)
);

const getRank = (index: number) => {
  return (props.currentPage - 1) * props.pageSize + index + 1;
};
</script>

<style scoped lang="scss">
.app-ranking {
  text-align: center;
}

.ranking-table {
  margin: 0 auto;
  max-width: 720px;
  th,
  td {
    text-align: center;
    padding: 8px;
  }
}

.ranking-small {
  font-size: 0.75rem;
  color: #666;
}

.pagination-buttons {
  margin-top: 1rem;
}
</style>
