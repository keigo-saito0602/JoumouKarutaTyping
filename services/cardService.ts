export interface Card {
  id: number;
  yomi: string;
  text: string;
  comment: string;
  picture_card: string;
  [key: string]: any;
}

export const createEmptyCard = (): Card => ({
  id: 0,
  yomi: "",
  text: "",
  comment: "",
  picture_card: "",
});

export const fetchAllCards = async (): Promise<Card[]> => {
  const { apiBase } = useRuntimeConfig().public;
  try {
    return await $fetch<Card[]>(`${apiBase}/cards`);
  } catch (error) {
    console.error("Error fetching cards:", error);
    throw error;
  }
};

export const fetchShuffledCards = async (): Promise<Card[]> => {
  const { apiBase } = useRuntimeConfig().public;
  try {
    return await $fetch<Card[]>(`${apiBase}/cards/shuffle`);
  } catch (error) {
    console.error("Error fetching shuffled cards:", error);
    throw error;
  }
};

export const fetchCardsByInitial = async (initial: string): Promise<Card[]> => {
  const { apiBase } = useRuntimeConfig().public;
  try {
    return await $fetch<Card[]>(`${apiBase}/cards/by-initial`, {
      params: { initial },
    });
  } catch (error) {
    console.error(`Error fetching cards by initial (${initial}):`, error);
    throw error;
  }
};

export const fetchCardById = async (id: number): Promise<Card> => {
  const { apiBase } = useRuntimeConfig().public;
  try {
    return await $fetch<Card>(`${apiBase}/cards/${id}`);
  } catch (error) {
    console.error(`Error fetching card by ID (${id}):`, error);
    throw error;
  }
};
