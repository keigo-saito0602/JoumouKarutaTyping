import { mount, flushPromises } from "@vue/test-utils";
import RankingPage from "@/pages/ranking.vue";
import TypingRanking from "@/components/project/TypingRanking.vue";
import { getEventScores } from "@/services/rankingService";
import { vi } from "vitest";

// サービスのモック
vi.mock("@/services/rankingService", () => ({
  getEventScores: vi.fn(),
}));

describe("Ranking Page", () => {
  it("renders TypingRanking component", () => {
    const wrapper = mount(RankingPage);
    expect(wrapper.findComponent(TypingRanking).exists()).toBe(true);
  });
});

describe("TypingRanking component", () => {
  const mockScores = [
    {
      id: 1,
      rank: 1,
      total_users: 100,
      name: "Alice",
      feeling: "楽しかった",
      score: 150,
      cards_taken: 25,
      fault_count: 1,
      created_at: "2024-05-30T10:00:00Z",
    },
    {
      id: 2,
      rank: 2,
      total_users: 100,
      name: "Bob",
      feeling: "まあまあ",
      score: 140,
      cards_taken: 24,
      fault_count: 2,
      created_at: "2024-05-29T11:00:00Z",
    },
  ];

  it("fetches and displays ranking data", async () => {
    vi.mocked(getEventScores).mockResolvedValue(mockScores);

    const wrapper = mount(TypingRanking);
    await flushPromises();

    expect(wrapper.text()).toContain("Alice");
    expect(wrapper.text()).toContain("Bob");
    expect(wrapper.text()).toContain("楽しかった");
    expect(wrapper.text()).toContain("まあまあ");
  });

  it("shows loading message before data is loaded", async () => {
    vi.mocked(getEventScores).mockImplementation(() => new Promise(() => {}));

    const wrapper = mount(TypingRanking);
    expect(wrapper.text()).toContain("ランキングを読み込み中...");
  });

  it("handles fetch error gracefully", async () => {
    const error = new Error("API error");
    vi.mocked(getEventScores).mockRejectedValue(error);

    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    mount(TypingRanking);
    await flushPromises();

    expect(spy).toHaveBeenCalledWith("ランキングデータ取得に失敗:", error);
    spy.mockRestore();
  });
});
