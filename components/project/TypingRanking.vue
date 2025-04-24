<template>
  <RankingTable
    :ranking="ranking"
    :page-size="pageSize"
    :current-page="currentPage"
    @prev="prevPage"
    @next="nextPage"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { collection, onSnapshot } from "firebase/firestore";
import { getResults } from "@/services/firebaseService";
import { useFirestore } from "@/composables/useFirestore";
import { RANKING_PAGE_SIZE } from "@/types/ranking";
import RankingTable from "@/components/parts/RankingTable.vue";
import type { SortedResult } from "@/types/ranking";

const db = useFirestore();
let unsubscribe: (() => void) | null = null;

const ranking = ref<SortedResult[]>([]);
const currentPage = ref(1);
const pageSize = RANKING_PAGE_SIZE;
const totalData = computed(() => ranking.value.length);

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
