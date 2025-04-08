<template>
  <v-container class="container">
    <v-table class="ranking-table">
      <thead>
        <tr>
          <th><v-icon left>mdi-crown</v-icon>順位</th>
          <th><v-icon left>mdi-account</v-icon>ニックネーム</th>
          <th><v-icon left>mdi-check</v-icon>札の数</th>
          <th><v-icon left>mdi-close</v-icon>お手つき</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(data, index) in currentPageData" :key="index">
          <td class="ranking-crown-col">
            {{ (currentPage - 1) * pageSize + index + 1 }}
            <span class="ranking-small">位</span>
          </td>
          <td class="ranking-name-col">
            {{ data.name }}
            <span class="ranking-small">さん</span>
          </td>
          <td class="ranking-result-col">
            {{ data.result }}
            <span class="ranking-small">枚</span>
          </td>
          <td class="ranking-sub-result-col">
            {{ data.sub_result }}
            <span class="ranking-small">回</span>
          </td>
        </tr>
        <!-- 空行を埋める -->
        <tr
          v-for="index in pageSize - currentPageData.length"
          :key="'empty-' + index"
        >
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </v-table>

    <v-row justify="center" class="pagination-buttons">
      <v-btn icon @click="prevPage" :disabled="currentPage === 1">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn
        icon
        @click="nextPage"
        :disabled="currentPage === Math.ceil(totalData / pageSize)"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { collection, onSnapshot } from "firebase/firestore";
import { getResults } from "@/services/api";
import { RANKING_PAGE_SIZE } from "@/types/ranking";
import type { SortedResult } from "@/types/ranking";
import { useFirestore } from "@/composables/useFirestore";

const pageSize = RANKING_PAGE_SIZE;
const ranking = ref<SortedResult[]>([]);
const currentPage = ref<number>(1);
const totalData = ref<number>(0);
const currentPageData = ref<SortedResult[]>([]);
const db = useFirestore();

let unsubscribe: (() => void) | null = null;

const paginateData = (page: number): SortedResult[] => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return ranking.value.slice(startIndex, endIndex);
};

const nextPage = () => {
  if (currentPage.value < Math.ceil(totalData.value / pageSize)) {
    currentPage.value++;
    currentPageData.value = paginateData(currentPage.value);
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    currentPageData.value = paginateData(currentPage.value);
  }
};

const getRealtimeResults = async () => {
  unsubscribe = onSnapshot(
    collection(db, "event_results"),
    async () => {
      const realtimeResults = await getResults();
      ranking.value = realtimeResults;
      totalData.value = ranking.value.length;
      currentPageData.value = paginateData(currentPage.value);
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
