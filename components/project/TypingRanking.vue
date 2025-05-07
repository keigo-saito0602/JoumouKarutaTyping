<template>
  <div v-if="ranking.length === 0">
    <p>ランキングを読み込み中...</p>
  </div>
  <RankingTable
    v-else
    :ranking="ranking"
    :page-size="pageSize"
    :current-page="currentPage"
    @prev="prevPage"
    @next="nextPage"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { RANKING_PAGE_SIZE } from "@/types/ranking";
import RankingTable from "@/components/parts/RankingTable.vue";
import type { EventScore } from "@/services/rankingService";
import { getEventScores } from "@/services/rankingService";

const ranking = ref<EventScore[]>([]);
const currentPage = ref(1);
const pageSize = RANKING_PAGE_SIZE;

const nextPage = () => {
  const totalPages = Math.ceil(ranking.value.length / pageSize);
  if (currentPage.value < totalPages) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const fetchRanking = async () => {
  try {
    const results = await getEventScores();
    ranking.value = results;
  } catch (error) {
    console.error("ランキングデータ取得に失敗:", error);
  }
};

onMounted(fetchRanking);
</script>
