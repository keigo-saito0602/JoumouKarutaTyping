<template>
  <v-container class="app-result">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <div class="result-box">
          <p class="result-text">{{ eventScore.name }}さんの結果</p>

          <p v-for="(item, i) in resultItems" :key="i" class="result-text">
            {{ item.label }} … <strong>{{ item.value }}</strong>
          </p>
        </div>

        <v-fade-transition>
          <div v-if="ready" class="result-box result-ranking">
            <p class="result-text">
              {{ resultMessage }}
            </p>
            <div v-if="posted">
              <KarutaButton
                icon="mdi-star"
                label="ランキングを見る"
                @click="goToRanking"
              />
              <KarutaButton
                icon="mdi-play"
                label="もう一度挑戦する"
                @click="goToStart"
              />
            </div>

            <div v-else>
              <KarutaTextField
                v-model="feeling"
                counter="50"
                label="感想を一言お願いします！"
                variant="outlined"
                density="comfortable"
                :rules="[rules.required, rules.maxLength(20)]"
              />
              <KarutaButton icon="mdi-send" label="送信" @click="postFeeling" />
            </div>
          </div>
        </v-fade-transition>
      </v-col>
    </v-row>

    <ConfettiOverlay ref="confettiRef" />
    <SoundPlayer ref="soundRef" />
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useGameStore } from "@/stores/game";
import KarutaButton from "@/components/parts/KarutaButton.vue";
import KarutaTextField from "@/components/parts/KarutaTextField.vue";
import ConfettiOverlay from "@/components/parts/ConfettiOverlay.vue";
import SoundPlayer from "@/components/parts/SoundPlayer.vue";
import {
  postEventScore,
  getEventScoreById,
  createEmptyEventScore,
} from "@/services/rankingService";

interface ResultItem {
  label: string;
  value: string;
}

const gameStore = useGameStore();
const router = useRouter();

const eventScore = ref(createEmptyEventScore());

// 他のstate
const ready = ref(false);
const posted = ref(false);
const feeling = ref("");

const confettiRef = ref<InstanceType<typeof ConfettiOverlay> | null>(null);
const soundRef = ref<InstanceType<typeof SoundPlayer> | null>(null);

const { t } = useI18n();
const rules = createValidationRules(t);

const fetchResults = async () => {
  soundRef.value?.play("ROLL");

  try {
    if (gameStore.result > 0) {
      const response = await postEventScore({
        name: gameStore.userName,
        cards_taken: gameStore.result,
        fault_count: gameStore.subResult,
        feeling: feeling.value,
      });
      eventScore.value = response;

      const rankResult = await getEventScoreById(response.id);
      eventScore.value.rank = rankResult.rank;
      eventScore.value.total_users = rankResult.total_users;
    }

    setTimeout(() => {
      if (eventScore.value.rank === 1) {
        soundRef.value?.play("CONGRATULATION1");
        confettiRef.value?.fire("high");
      } else {
        soundRef.value?.play("CONGRATULATION2");
        confettiRef.value?.fire("normal");
      }
      ready.value = true;
    }, 1500);
  } catch (error) {
    console.error("Failed to fetch results:", error);
    ready.value = true;
  }
};

const resultItems = computed<ResultItem[]>(() => [
  { label: "スコア", value: `${eventScore.value.score}点` },
  { label: "GETした札", value: `${eventScore.value.cards_taken}枚` },
  { label: "お手つきした数", value: `${eventScore.value.fault_count}回` },
]);

const resultMessage = computed(() => {
  if (eventScore.value.total_users > 0) {
    return `${eventScore.value.total_users}人中 ${eventScore.value.rank}位!!`;
  }
  return "次こそは札がとれるよ!! 頑張ろう!!";
});

const postFeeling = async () => {
  if (eventScore.value.id === 0) return;
  try {
    await postEventScore({
      name: gameStore.userName,
      cards_taken: gameStore.result,
      fault_count: gameStore.subResult,
      feeling: feeling.value,
    });
    posted.value = true;
  } catch (error) {
    console.error("Failed to post feeling:", error);
  }
};

const goToRanking = () => {
  router.push("/ranking");
};
const goToStart = () => gameStore.setGameStatus("START");

onMounted(fetchResults);
</script>

<style scoped>
.app-result {
  text-align: center;
  padding-top: 2rem;
}

.result-box {
  margin-bottom: 2rem;
}

.result-text {
  font-size: 1.5rem;
  line-height: 1.8;
}

.result-ranking .result-rank {
  font-size: 2rem;
  font-weight: bold;
}
</style>
