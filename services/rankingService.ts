export interface EventScore {
  id: number;
  rank: number;
  total_users: number;
  name: string;
  feeling: string;
  score: number;
  cards_taken: number;
  fault_count: number;
  created_at?: string;
}

export const createEmptyEventScore = (): EventScore => ({
  id: 0,
  rank: 0,
  total_users: 0,
  name: "",
  feeling: "",
  score: 0,
  cards_taken: 0,
  fault_count: 0,
  created_at: "",
});

export const postEventScore = async (score: {
  name: string;
  cards_taken: number;
  fault_count: number;
  feeling: string;
}): Promise<EventScore> => {
  const { apiBase } = useRuntimeConfig().public;
  return await $fetch<EventScore>(`${apiBase}/event_scores`, {
    method: "POST",
    body: score,
  });
};

export const getEventScores = async (): Promise<EventScore[]> => {
  const { apiBase } = useRuntimeConfig().public;
  return await $fetch<EventScore[]>(`${apiBase}/event_scores`);
};

export const getEventScoreById = async (id: number): Promise<EventScore> => {
  const { apiBase } = useRuntimeConfig().public;
  return await $fetch<EventScore>(`${apiBase}/event_scores/${id}`);
};
