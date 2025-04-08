// utils/authApi.ts
interface LoginPayload {
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  // 模擬的なサーバー応答（実際はここを $fetch などに変更）
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (
        payload.email === "test@example.com" &&
        payload.password === "password"
      ) {
        resolve({
          user: {
            id: "123",
            name: "テストユーザー",
            email: payload.email,
          },
          token: "mock-jwt-token",
        });
      } else {
        reject(new Error("メールアドレスまたはパスワードが正しくありません"));
      }
    }, 500);
  });
};

// **
// * Go バックエンドと連携する本番用のログイン処理
// */
// export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
//   try {
//     const res = await $fetch<AuthResponse>('/api/login', {
//       method: 'POST',
//       body: payload,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     return res;
//   } catch (error: any) {
//
//     throw new Error(error?.data?.message || 'ログインに失敗しました');
//   }
// };
