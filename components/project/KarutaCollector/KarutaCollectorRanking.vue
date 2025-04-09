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
          <td>
            {{ getRank(index) }}
            <span class="ranking-small">位</span>
          </td>
          <td>
            {{ data.name }}
            <span class="ranking-small">さん</span>
          </td>
          <td>
            {{ data.result }}
            <span class="ranking-small">枚</span>
          </td>
          <td>
            {{ data.sub_result }}
            <span class="ranking-small">回</span>
          </td>
        </tr>

        <tr v-for="i in emptyRowCount" :key="'empty-' + i">
          <td colspan="4">&nbsp;</td>
        </tr>
      </tbody>
    </v-table>

    <v-row justify="center" class="pagination-buttons mt-4">
      <v-btn icon @click="prevPage" :disabled="isFirstPage">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn icon @click="nextPage" :disabled="isLastPage">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { collection, onSnapshot } from "firebase/firestore";
import { getResults } from "@/services/api";
import { useFirestore } from "@/composables/useFirestore";
import { RANKING_PAGE_SIZE } from "@/types/ranking";
import type { SortedResult } from "@/types/ranking";

const db = useFirestore();
let unsubscribe: (() => void) | null = null;

const ranking = ref<SortedResult[]>([]);
const currentPage = ref(1);
const pageSize = RANKING_PAGE_SIZE;
const totalData = computed(() => ranking.value.length);

const currentPageData = computed(() =>
  ranking.value.slice(
    (currentPage.value - 1) * pageSize,
    currentPage.value * pageSize
  )
);

const emptyRowCount = computed(() =>
  Math.max(0, pageSize - currentPageData.value.length)
);

const isFirstPage = computed(() => currentPage.value === 1);
const isLastPage = computed(
  () => currentPage.value >= Math.ceil(totalData.value / pageSize)
);

const nextPage = () => {
  if (!isLastPage.value) currentPage.value++;
};

const prevPage = () => {
  if (!isFirstPage.value) currentPage.value--;
};

const getRank = (index: number) => {
  return (currentPage.value - 1) * pageSize + index + 1;
};

const getRealtimeResults = async () => {
  unsubscribe = onSnapshot(
    collection(db, "event_results"),
    async () => {
      const results = await getResults();
      ranking.value = results;
    },
    (error) => {
      console.error("Error fetching results:", error);
    }
  );
};

onMounted(getRealtimeResults);
onBeforeUnmount(() => {
  if (unsubscribe) unsubscribe();
});
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
