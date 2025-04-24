<template>
  <v-container class="app-result">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <div class="result-box">
          <p class="result-text">{{ userName }}さんの結果</p>

          <p v-for="(item, i) in resultItems" :key="i" class="result-text">
            {{ item.label }} … <strong>{{ item.value }}</strong>
          </p>
        </div>

        <v-fade-transition>
          <div v-if="ready" class="result-box result-ranking">
            <p class="result-text">
              <span v-if="total > 0">
                {{ resultMessage }}
              </span>
              <span v-else>
                {{ resultMessage }}
              </span>
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
import { ref, onMounted } from "vue";
import { useGameStore } from "@/stores/game";
import { addResult, getRank, setFeeling } from "@/services/firebaseService";
import KarutaButton from "@/components/parts/KarutaButton.vue";
import KarutaTextField from "@/components/parts/KarutaTextField.vue";
import ConfettiOverlay from "@/components/parts/ConfettiOverlay.vue";
import SoundPlayer from "@/components/parts/SoundPlayer.vue";

interface ResultItem {
  label: string;
  value: string;
}

// Store
const gameStore = useGameStore();
const router = useRouter();

// State
const userId = ref("");
const rank = ref(0);
const total = ref(0);
const ready = ref(false);
const posted = ref(false);
const feeling = ref("");

const confettiRef = ref<InstanceType<typeof ConfettiOverlay> | null>(null);
const soundRef = ref<InstanceType<typeof SoundPlayer> | null>(null);

const { t } = useI18n();
const rules = createValidationRules(t);

// Fetch results & play sound
const fetchResults = async () => {
  soundRef.value?.play("ROLL");

  if (gameStore.result > 0) {
    userId.value = await addResult(
      gameStore.userName,
      gameStore.result,
      gameStore.subResult
    );
  }

  if (!userId.value) {
    ready.value = true;
    return;
  }

  const [rankResult, totalUsers] = await getRank(userId.value);
  rank.value = rankResult;
  total.value = totalUsers;

  setTimeout(() => {
    if (rank.value === 1) {
      soundRef.value?.play("CONGRATULATION1");
      confettiRef.value?.fire("high");
    } else {
      soundRef.value?.play("CONGRATULATION2");
      confettiRef.value?.fire("normal");
    }
    ready.value = true;
  }, 1500);
};

const userName = computed(() => gameStore.userName);

const resultItems = computed<ResultItem[]>(() => [
  { label: "GETした札", value: `${gameStore.result}枚` },
  { label: "お手つきした数", value: `${gameStore.subResult}回` },
  // TODO: 今後スコアだったり追加する場合は以下に記載。
]);

const resultMessage = computed(() => {
  if (total.value > 0) {
    return `${total.value}人中 ${rank.value}位!!`;
  }
  return "次こそは札がとれるよ!! 頑張ろう!!";
});

// 感想送信
const postFeeling = () => {
  posted.value = true;
  setFeeling(userId.value, feeling.value);
};

// 画面遷移
const goToRanking = () => {
  router.push("/ranking");
};
const goToStart = () => gameStore.setGameStatus("START");

// Lifecycle
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
